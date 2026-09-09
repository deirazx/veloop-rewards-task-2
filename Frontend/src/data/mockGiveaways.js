/**
 * Authoritative Giveaway Data matching PDF Specification
 * Contains ONLY the exactly 6 required active giveaways.
 * In initial live state with zero-mock data, participation starts at 0 entries.
 */

export const mockGiveaways = [
  {
    id: 'gw-1',
    slug: 'iphone-15-pro',
    title: 'Apple iPhone 15 Pro (128GB)',
    subtitle: 'Titanium craftsmanship with A17 Pro chip & Pro camera system',
    entryFee: 250,
    cost: 250,
    currency: 'VEs',
    currentEntries: 0,
    maxEntries: 500,
    spotsTaken: 0,
    totalSpots: 500,
    participantsCount: 0,
    image: '/assets/iphone-prize.jpg',
    daysLeft: 15,
    type: 'PHYSICAL',
    category: 'Flagship Tech',
    retailPrice: '₹1,34,900',
    status: 'ACTIVE',
    endsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    accentColor: '#7C3AED',
    bannerGradient: 'from-purple-900/40 via-deep-card to-obsidian',
    tag: 'Flagship Pool',
    description: 'Titanium craftsmanship with A17 Pro chip. 100% genuine insured delivery.',
    specifications: [
      { label: 'Processor', value: 'A17 Pro Bionic (3nm)' },
      { label: 'Build', value: 'Grade 5 Titanium Frame' },
      { label: 'Storage', value: '128 GB High-Speed NVMe' },
      { label: 'Display', value: '6.1" Super Retina XDR 120Hz' }
    ],
    terms: [
      '1 entry permitted per verified account.',
      'Cryptographically audited draw upon countdown completion.',
      'Deduction is final upon confirmation.'
    ],
    winners: []
  },
  {
    id: 'gw-2',
    slug: 'apple-watch-series-9',
    title: 'Apple Watch Series 9 GPS',
    subtitle: 'Midnight Aluminum Case with Sport Band (45mm)',
    entryFee: 200,
    cost: 200,
    currency: 'VEs',
    currentEntries: 0,
    maxEntries: 350,
    spotsTaken: 0,
    totalSpots: 350,
    participantsCount: 0,
    image: '/assets/apple-watch.jpg',
    daysLeft: 12,
    type: 'PHYSICAL',
    category: 'Wearables',
    retailPrice: '₹44,900',
    status: 'ACTIVE',
    endsAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    accentColor: '#3B82F6',
    bannerGradient: 'from-blue-950/40 via-deep-card to-obsidian',
    tag: 'Trending',
    description: 'Advanced health metrics, ECG, and S9 SiP processor.',
    specifications: [
      { label: 'Chipset', value: 'S9 SiP with 4-core Neural Engine' },
      { label: 'Display', value: 'Always-On Retina (Up to 2000 nits)' },
      { label: 'Water Resistance', value: '50m ISO Standard 22810' }
    ],
    terms: [
      '1 entry permitted per verified KYC account.',
      'Shipping address must be confirmed within 7 days of draw.'
    ],
    winners: []
  },
  {
    id: 'gw-3',
    slug: 'airpods-pro-2nd-gen',
    title: 'AirPods Pro (2nd Generation)',
    subtitle: 'Active Noise Cancellation with USB-C MagSafe Case',
    entryFee: 500,
    cost: 500,
    currency: 'SVEs',
    currentEntries: 0,
    maxEntries: 200,
    spotsTaken: 0,
    totalSpots: 200,
    participantsCount: 0,
    image: '/assets/airpods.jpg',
    daysLeft: 5,
    type: 'PHYSICAL',
    category: 'Audio',
    retailPrice: '₹24,900',
    status: 'ACTIVE',
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    accentColor: '#06B6D4',
    bannerGradient: 'from-cyan-950/40 via-deep-card to-obsidian',
    tag: 'Super Tier',
    description: 'Pro Active Noise Cancellation and USB-C MagSafe case.',
    specifications: [
      { label: 'Audio Chip', value: 'Apple H2 Headphone chip' },
      { label: 'Charging', value: 'USB-C & MagSafe Wireless' }
    ],
    terms: [
      'Exclusive to Super-VE (SVE) holders.',
      'Physical prize delivered with sealed retail packaging.'
    ],
    winners: []
  },
  {
    id: 'gw-4',
    slug: 'amazon-gift-voucher-2000',
    title: '₹2,000 Amazon Gift Voucher',
    subtitle: 'Instant digital code redeemable for shopping & bills',
    entryFee: 500,
    cost: 500,
    currency: 'VEs',
    currentEntries: 0,
    maxEntries: 1000,
    spotsTaken: 0,
    totalSpots: 1000,
    participantsCount: 0,
    image: '/assets/amazon-2000.jpg',
    daysLeft: 10,
    type: 'GIFT_CARD',
    category: 'Digital Voucher',
    retailPrice: '₹2,000',
    status: 'ACTIVE',
    endsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    accentColor: '#F59E0B',
    bannerGradient: 'from-amber-950/40 via-deep-card to-obsidian',
    tag: 'Instant Digital',
    description: 'Direct digital voucher pin dispatched instantly to verified email.',
    specifications: [
      { label: 'Delivery', value: 'Instant Digital Code via Email' },
      { label: 'Validity', value: '1 Year from date of issuance' }
    ],
    terms: [
      'No physical delivery required; strictly email dispatched.',
      'Non-transferable code issued to registered recipient email.'
    ],
    winners: []
  },
  {
    id: 'gw-5',
    slug: 'amazon-gift-voucher-500',
    title: '₹500 Amazon Gift Voucher',
    subtitle: 'Quick shopping boost for verified members',
    entryFee: 300,
    cost: 300,
    currency: 'VEs',
    currentEntries: 0,
    maxEntries: 3000,
    spotsTaken: 0,
    totalSpots: 3000,
    participantsCount: 0,
    image: '/assets/amazon-500.png',
    daysLeft: 8,
    type: 'GIFT_CARD',
    category: 'Digital Voucher',
    retailPrice: '₹500',
    status: 'ACTIVE',
    endsAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    accentColor: '#10B981',
    bannerGradient: 'from-emerald-950/40 via-deep-card to-obsidian',
    tag: 'Shopping Voucher',
    description: 'Quick shopping boost. Instant digital gift card voucher for Amazon Pay.',
    specifications: [
      { label: 'Format', value: 'Digital Code' },
      { label: 'Redemption', value: 'Amazon Pay Balance' }
    ],
    terms: [
      '1 entry permitted per account.',
      'Dispatched to email.'
    ],
    winners: []
  },
  {
    id: 'gw-6',
    slug: 'micro-voucher-20',
    title: '₹20 Instant Recharge Voucher',
    subtitle: 'Quick liquidity micro-reward for active community tokens',
    entryFee: 2000,
    cost: 2000,
    currency: 'Tokens',
    currentEntries: 0,
    maxEntries: 5000,
    spotsTaken: 0,
    totalSpots: 5000,
    participantsCount: 0,
    image: '/assets/recharge-voucher.png',
    daysLeft: 2,
    type: 'GIFT_CARD',
    category: 'Community Token Draw',
    retailPrice: '₹20',
    status: 'ACTIVE',
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    accentColor: '#8B5CF6',
    bannerGradient: 'from-violet-950/40 via-deep-card to-obsidian',
    tag: 'High Frequency',
    description: 'Exchange platform tokens for quick liquid recharge vouchers.',
    specifications: [
      { label: 'Draw Frequency', value: 'Every 24 Hours' },
      { label: 'Format', value: 'Alphanumeric Gift Pin' }
    ],
    terms: [
      'Burn 2,000 Community Tokens to reserve ticket.',
      'Winners drawn automatically via audited algorithm.'
    ],
    winners: []
  }
];

export const CURRENT_USER = {
  id: 'usr_veloop_99',
  customUserId: 'VE10025',
  name: 'Alex Mercer',
  email: 'alex.mercer@veloop.io',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  isKycVerified: true,
  tier: 'Platinum Elite',
  balances: { VES: 1000, SVES: 1500, Tokens: 3000, VEs: 1000, SVEs: 1500 }
};
