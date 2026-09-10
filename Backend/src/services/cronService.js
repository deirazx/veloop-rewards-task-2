'use strict';

const cron = require('node-cron');
const crypto = require('crypto');
const Giveaway = require('../models/Giveaway');
const Participation = require('../models/Participation');
const Winner = require('../models/Winner');

// ─── Official Pool Duration Matrix ───────────────────────────────────────────
// Maps pool slug pattern → duration in milliseconds for the next respawned cycle.
const POOL_DURATION_MAP = [
  {
    // Grand Pool: iPhone 15 Pro — Monthly (30-day cycle)
    match: (g) => g.slug.includes('iphone') || g.title.toLowerCase().includes('iphone'),
    durationMs: 30 * 24 * 60 * 60 * 1000,
    label: 'Monthly (30-Day Grand Pool)'
  },
  {
    // Fast-Draw: ₹20 Recharge — Daily (24-hour cycle)
    match: (g) =>
      g.slug.includes('micro') ||
      g.slug.includes('20') ||
      g.title.toLowerCase().includes('recharge') ||
      g.title.includes('₹20'),
    durationMs: 24 * 60 * 60 * 1000,
    label: 'Fast-Draw (24-Hour Daily Pool)'
  },
  {
    // Bi-Weekly: ₹500 Amazon Voucher — 3-day cycle
    match: (g) =>
      (g.slug.includes('500') || g.title.toLowerCase().includes('500')) &&
      g.title.toLowerCase().includes('amazon'),
    durationMs: 3 * 24 * 60 * 60 * 1000,
    label: 'Bi-Weekly (3-Day Pool)'
  },
  {
    // Weekly: All other pools (Apple Watch, AirPods, ₹2000 Amazon) — 7-day cycle
    match: () => true,
    durationMs: 7 * 24 * 60 * 60 * 1000,
    label: 'Weekly (7-Day Pool)'
  }
];

/**
 * Resolve the official next-cycle duration for a given giveaway.
 */
function resolveDuration(giveaway) {
  for (const rule of POOL_DURATION_MAP) {
    if (rule.match(giveaway)) {
      return { durationMs: rule.durationMs, label: rule.label };
    }
  }
  return { durationMs: 7 * 24 * 60 * 60 * 1000, label: 'Weekly (7-Day Pool)' };
}

/**
 * Generate a cryptographically-graded hex seed string.
 */
function genSeed() {
  return '0x' + crypto.randomBytes(8).toString('hex');
}

/**
 * Mask a customUserId in privacy-safe format: VE10025 → VE****25
 */
function maskUserId(uid) {
  if (!uid || uid.length < 4) return '****';
  return uid.slice(0, 2) + '****' + uid.slice(-2);
}

/**
 * Core lifecycle processor for a single expired giveaway.
 * 1. Transitions status to ENDED.
 * 2. Runs the transparent selection to pick winners (if participants exist).
 * 3. Clones and respawns the pool with the official cycle duration.
 */
async function processExpiredPool(giveaway) {
  const poolTag = `[Lifecycle][${giveaway.giveawayId}]`;

  try {
    // ── Step 1: Mark pool as ENDED ────────────────────────────────────────────
    await Giveaway.findByIdAndUpdate(giveaway._id, { status: 'ENDED' });
    console.log(`${poolTag} Pool closed. Status → ENDED.`);

    // ── Step 2: Transparent Winner Selection ──────────────────────────────────
    const primaryPrize = giveaway.prizes?.[0];
    const winnerCount = primaryPrize?.winnerCount || 1;

    const participants = await Participation.find({
      giveawayId: giveaway.giveawayId,
      status: 'CONFIRMED'
    }).lean();

    if (participants.length === 0) {
      console.log(`${poolTag} No participants registered. Draw skipped. Pool will respawn.`);
    } else {
      // Fisher-Yates shuffle for an unbiased random selection
      const pool = [...participants];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }

      const selected = pool.slice(0, Math.min(winnerCount, pool.length));
      const drawTimestamp = new Date();

      const winnerDocs = selected.map((p) => ({
        giveawayId: giveaway.giveawayId,
        giveawayDocId: giveaway._id,
        userId: p.userId,
        customUserId: p.customUserId,
        maskedUserId: maskUserId(p.customUserId),
        ticketNumber: p.ticketNumber,
        prizeId: primaryPrize?.prizeId || 'prize-auto',
        prizeName: primaryPrize?.name || giveaway.title,
        prizeType: primaryPrize?.type || 'PHYSICAL',
        drawTimestamp,
        claimStatus: 'UNCLAIMED',
        verificationSeed: genSeed(),
        drawSeed: genSeed()
      }));

      try {
        const inserted = await Winner.insertMany(winnerDocs, { ordered: false });
        console.log(
          `${poolTag} ✅ Transparent Selection complete. ${inserted.length} winner(s) selected and recorded.`
        );
        inserted.forEach((w) => {
          console.log(`${poolTag}   → Winner: ${w.maskedUserId} | Ticket: ${w.ticketNumber}`);
        });
      } catch (insertErr) {
        // insertMany with ordered:false continues past duplicates — log only unique errors
        if (insertErr.code !== 11000) {
          console.error(`${poolTag} ❌ Winner insertion error:`, insertErr.message);
        } else {
          console.warn(`${poolTag} ⚠️ Some duplicate winner entries skipped.`);
        }
      }
    }

    // ── Step 3: Respawn next cycle ────────────────────────────────────────────
    const { durationMs, label } = resolveDuration(giveaway);
    const now = new Date();
    const nextEndAt = new Date(now.getTime() + durationMs);

    // Generate a unique giveawayId and slug for the new cycle
    const cycleTag = `cycle-${Date.now()}`;
    const baseSlug = giveaway.slug.replace(/-cycle-\d+$/, ''); // strip previous cycle suffix
    const baseGwId = giveaway.giveawayId.replace(/-cycle-\d+$/, '');

    const newGiveaway = new Giveaway({
      giveawayId: `${baseGwId}-${cycleTag}`,
      title: giveaway.title,
      slug: `${baseSlug}-${cycleTag}`,
      status: 'ACTIVE',
      startAt: now,
      endAt: nextEndAt,
      category: giveaway.category,
      entryFee: giveaway.entryFee,
      currency: giveaway.currency,
      retailPrice: giveaway.retailPrice,
      totalSpots: giveaway.totalSpots,
      maxEntries: giveaway.maxEntries,
      spotsTaken: 0,
      currentEntries: 0,
      participantsCount: 0,
      image: giveaway.image,
      description: giveaway.description,
      prizes: giveaway.prizes.map((p) => ({
        ...p,
        prizeId: `${p.prizeId}-${cycleTag}`
      })),
      terms: giveaway.terms
    });

    await newGiveaway.save();
    console.log(
      `${poolTag} 🔄 Respawned → [${newGiveaway.giveawayId}] | Duration: ${label} | Ends: ${nextEndAt.toISOString()}`
    );
  } catch (err) {
    console.error(`${poolTag} ❌ Lifecycle processing error:`, err.message);
  }
}

/**
 * Main cron tick: query for expired ACTIVE pools and process each one.
 */
async function lifecycleTick() {
  try {
    const now = new Date();
    const expiredPools = await Giveaway.find({
      status: 'ACTIVE',
      endAt: { $lte: now }
    }).lean();

    if (expiredPools.length === 0) return; // Nothing to process — exit silently

    console.log(`\n[Lifecycle] ⏱ Tick at ${now.toISOString()} — Found ${expiredPools.length} expired pool(s).`);

    // Process pools sequentially to avoid race conditions on shared resources
    for (const pool of expiredPools) {
      await processExpiredPool(pool);
    }
  } catch (err) {
    // Top-level catch: must never crash the cron job
    if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
      console.warn('[Lifecycle] ⚠️ Database unreachable. Will retry on next tick.');
    } else {
      console.error('[Lifecycle] ❌ Unexpected error in lifecycle tick:', err.message);
    }
  }
}

/**
 * Keep-Alive: Self-ping the /api/health endpoint every 14 minutes.
 * Prevents Render free-tier from spinning down the server due to inactivity,
 * ensuring the lifecycle cron continues to fire uninterrupted.
 */
function initKeepAlive() {
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL;

  if (!RENDER_URL) {
    // Localhost or unknown environment — keep-alive not needed
    console.log('[KeepAlive] ℹ️  No RENDER_EXTERNAL_URL set. Keep-alive disabled (local mode).');
    return null;
  }

  const https = require('https');
  const http = require('http');
  const pingUrl = `${RENDER_URL}/api/health`;

  const keepAliveJob = cron.schedule('*/14 * * * *', () => {
    const client = pingUrl.startsWith('https') ? https : http;
    const req = client.get(pingUrl, (res) => {
      console.log(`[KeepAlive] 💓 Self-ping → ${pingUrl} | Status: ${res.statusCode}`);
    });
    req.on('error', (err) => {
      console.warn(`[KeepAlive] ⚠️ Self-ping failed: ${err.message}`);
    });
    req.end();
  }, { scheduled: true, timezone: 'UTC' });

  console.log(`[KeepAlive] ✅ Keep-Alive ping initialized → ${pingUrl} (every 14 min)`);
  return keepAliveJob;
}

/**
 * Initialize and register the cron job.
 * Call this once from server.js after the DB connects.
 */
function initLifecycleCron() {
  // Schedule: every minute — "* * * * *"
  const job = cron.schedule('* * * * *', lifecycleTick, {
    scheduled: true,
    timezone: 'UTC'
  });

  console.log('[Lifecycle] ✅ Automated Pool Lifecycle Engine initialized.');
  console.log('[Lifecycle]    → Cron schedule: every 60 seconds (UTC)');
  console.log('[Lifecycle]    → Duration Matrix: Grand=30d | Weekly=7d | Bi-Weekly=3d | Fast-Draw=24h');

  // Boot the Render keep-alive pinger (no-op on localhost)
  initKeepAlive();

  return job;
}

module.exports = { initLifecycleCron };
