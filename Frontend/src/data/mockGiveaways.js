/**
 * Authoritative Mock Data Layer
 * Models exact pricing, currency types (VEs, SVEs, Tokens), and prize categories (PHYSICAL, GIFT_CARD)
 */

export const mockGiveaways = [
  {
    id: "giveaway-iphone-15-pro",
    slug: "iphone-15-pro",
    title: "Apple iPhone 15 Pro (128GB)",
    subtitle: "Titanium craftsmanship, A17 Pro chip & Pro camera system",
    cost: 250,
    currency: "VEs",
    type: "PHYSICAL",
    category: "Flagship Tech",
    status: "ACTIVE", // ACTIVE or ENDED
    tag: "High Value Pool",
    retailPrice: "₹1,34,900",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
    bannerGradient: "from-purple-900/40 via-deep-card to-obsidian",
    accentColor: "#7C3AED",
    totalSpots: 500,
    spotsTaken: 412,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(), // 36 hours from now
    participantsCount: 389,
    description: "Participate in the flagship Veloop Tier-1 draw for a brand-new iPhone 15 Pro in Natural Titanium. Direct factory dispatch insured with AppleCare+ eligible warranty.",
    specifications: [
      { label: "Processor", value: "A17 Pro Bionic (3nm)" },
      { label: "Build", value: "Grade 5 Titanium Frame" },
      { label: "Storage", value: "128 GB High-Speed NVMe" },
      { label: "Display", value: "6.1\" Super Retina XDR 120Hz" }
    ],
    terms: [
      "1 entry allowed per verified account per round.",
      "Physical dispatch restricted to serviceable Indian postal codes.",
      "Deduction of 250 VEs is final upon confirmation and non-refundable."
    ],
    winners: [] // Giveaway is still live
  },
  {
    id: "giveaway-apple-watch-s9",
    slug: "apple-watch-series-9",
    title: "Apple Watch Series 9 GPS",
    subtitle: "Midnight Aluminum Case with Sport Band (45mm)",
    cost: 200,
    currency: "VEs",
    type: "PHYSICAL",
    category: "Wearables",
    status: "ACTIVE",
    tag: "Trending",
    retailPrice: "₹44,900",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80",
    bannerGradient: "from-blue-950/40 via-deep-card to-obsidian",
    accentColor: "#3B82F6",
    totalSpots: 350,
    spotsTaken: 278,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(), // 18 hours from now
    participantsCount: 260,
    description: "Elevate your fitness tracking, heart health alerts, and double-tap interactions with the latest Apple Watch Series 9 GPS edition.",
    specifications: [
      { label: "Chipset", value: "S9 SiP with 4-core Neural Engine" },
      { label: "Display", value: "Always-On Retina (Up to 2000 nits)" },
      { label: "Water Resistance", value: "50m ISO Standard 22810" },
      { label: "Sensors", value: "ECG, Blood Oxygen, Temp Sensing" }
    ],
    terms: [
      "1 entry allowed per verified KYC account.",
      "Shipping address must be confirmed within 7 days of draw.",
      "Requires 200 VEs available balance."
    ],
    winners: []
  },
  {
    id: "giveaway-airpods-pro",
    slug: "airpods-pro-2nd-gen",
    title: "AirPods Pro (2nd Generation)",
    subtitle: "Active Noise Cancellation with USB-C MagSafe Case",
    cost: 500,
    currency: "SVEs",
    type: "PHYSICAL",
    category: "Premium Audio",
    status: "ACTIVE",
    tag: "Super Tier",
    retailPrice: "₹24,900",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80",
    bannerGradient: "from-amber-950/40 via-deep-card to-obsidian",
    accentColor: "#F59E0B",
    totalSpots: 200,
    spotsTaken: 184,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // 4 hours left!
    participantsCount: 172,
    description: "Pro-level Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio with dynamic head tracking.",
    specifications: [
      { label: "Audio Chip", value: "Apple H2 Headphone chip" },
      { label: "Charging", value: "USB-C & MagSafe Wireless" },
      { label: "Battery", value: "Up to 30 hrs with charging case" },
      { label: "Durability", value: "IP54 dust, sweat, and water resistant" }
    ],
    terms: [
      "Exclusive to Super-VE (SVE) holders.",
      "Physical prize delivered with sealed retail packaging.",
      "500 SVEs required for entry."
    ],
    winners: []
  },
  {
    id: "giveaway-amazon-voucher-2k",
    slug: "amazon-voucher-2000",
    title: "₹2,000 Amazon Pay E-Voucher",
    subtitle: "Instant digital code redeemable for shopping & bills",
    cost: 500,
    currency: "VEs",
    type: "GIFT_CARD",
    category: "Digital Voucher",
    status: "ACTIVE",
    tag: "Instant Digital",
    retailPrice: "₹2,000",
    image: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1000&q=80",
    bannerGradient: "from-emerald-950/40 via-deep-card to-obsidian",
    accentColor: "#10B981",
    totalSpots: 1000,
    spotsTaken: 620,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    participantsCount: 590,
    description: "Add ₹2,000 directly to your Amazon Pay balance. Zero shipping delay, 100% digital code delivered directly to your verified email.",
    specifications: [
      { label: "Delivery", value: "Instant Digital Code via Email" },
      { label: "Validity", value: "1 Year from date of issuance" },
      { label: "Usability", value: "Shopping, Recharges, Bill payments" }
    ],
    terms: [
      "No physical delivery required; strictly email dispatched.",
      "Non-transferable code issued to registered recipient email.",
      "Requires 500 VEs deduction."
    ],
    winners: []
  },
  {
    id: "giveaway-token-voucher-20",
    slug: "micro-voucher-20",
    title: "₹20 Instant Recharge Voucher",
    subtitle: "Quick liquidity micro-reward for active community tokens",
    cost: 2000,
    currency: "Tokens",
    type: "GIFT_CARD",
    category: "Community Token Draw",
    status: "ACTIVE",
    tag: "High Frequency",
    retailPrice: "₹20",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80",
    bannerGradient: "from-violet-950/40 via-deep-card to-obsidian",
    accentColor: "#8B5CF6",
    totalSpots: 5000,
    spotsTaken: 3410,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    participantsCount: 3100,
    description: "Exchange your daily platform Tokens for guaranteed direct digital gift vouchers. Fast draw cycles running daily.",
    specifications: [
      { label: "Draw Frequency", value: "Every 24 Hours" },
      { label: "Format", value: "Alphanumeric Gift Pin" },
      { label: "Redemption", value: "Play Store / UPI / Utility" }
    ],
    terms: [
      "Burn 2,000 Community Tokens to reserve ticket.",
      "Winners drawn automatically via audited provably fair algorithm.",
      "Sent strictly to user's registered email."
    ],
    winners: []
  },
  {
    id: "giveaway-ended-macbook-pro",
    slug: "macbook-pro-m3-ended",
    title: "MacBook Pro 14\" M3 Pro (Completed)",
    subtitle: "Event concluded - Proof of provably fair selection",
    cost: 800,
    currency: "VEs",
    type: "PHYSICAL",
    category: "Pro Hardware",
    status: "ENDED",
    tag: "Winner Announced",
    retailPrice: "₹1,99,900",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
    bannerGradient: "from-slate-900/60 via-deep-card to-obsidian",
    accentColor: "#94A3B8",
    totalSpots: 500,
    spotsTaken: 500,
    endsAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    participantsCount: 500,
    description: "The prestigious M3 Pro MacBook draw has finished. Below is the audited winner record.",
    specifications: [
      { label: "Status", value: "Audit Verified" },
      { label: "RNG Seed", value: "0x89f2a71d99b24e6c" }
    ],
    terms: [
      "Winner must claim within 14 days of declaration.",
      "Requires physical KYC & delivery address verification."
    ],
    winners: [
      {
        userId: "usr_veloop_99", // Matches our current test user Alex Mercer!
        name: "Alex Mercer (You)",
        email: "alex.mercer@veloop.io",
        ticketNumber: "TK-889412",
        drawTimestamp: "Yesterday, 18:30 IST",
        prizeTitle: "MacBook Pro 14\" M3 Pro",
        prizeType: "PHYSICAL",
        claimStatus: "UNCLAIMED" // UNCLAIMED or CLAIMED
      }
    ]
  },
  {
    id: "giveaway-ended-steam-voucher",
    slug: "steam-voucher-5000-ended",
    title: "₹5,000 Steam Wallet Code (Completed)",
    subtitle: "Concluded digital gift voucher draw",
    cost: 600,
    currency: "VEs",
    type: "GIFT_CARD",
    category: "Gaming Digital",
    status: "ENDED",
    tag: "Winner Announced",
    retailPrice: "₹5,000",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
    bannerGradient: "from-cyan-950/50 via-deep-card to-obsidian",
    accentColor: "#06B6D4",
    totalSpots: 300,
    spotsTaken: 300,
    endsAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    participantsCount: 300,
    description: "Completed digital gift card draw. The winner has been determined via provably fair RNG.",
    specifications: [
      { label: "Status", value: "Delivered" },
      { label: "Voucher Type", value: "Digital Email Pin" }
    ],
    terms: [
      "Digital dispatch strictly to winner's email address."
    ],
    winners: [
      {
        userId: "usr_other_41",
        name: "Rohan V.",
        email: "rohan.v****@gmail.com",
        ticketNumber: "TK-114092",
        drawTimestamp: "2 days ago, 14:00 IST",
        prizeTitle: "₹5,000 Steam Wallet Code",
        prizeType: "GIFT_CARD",
        claimStatus: "CLAIMED"
      }
    ]
  }
];

export const CURRENT_USER = {
  id: "usr_veloop_99",
  name: "Alex Mercer",
  email: "alex.mercer@veloop.io",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  kycVerified: true,
  tier: "Platinum Elite"
};
