import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockGiveaways, CURRENT_USER } from '../data/mockGiveaways';

const GiveawayContext = createContext();

export const GiveawayProvider = ({ children }) => {
  // Initial Balances curated to allow both Sufficient and Deficit demo states
  const [balances, setBalances] = useState(() => {
    const saved = localStorage.getItem('veloop_balances');
    return saved ? JSON.parse(saved) : { VEs: 350, SVEs: 300, Tokens: 1800 };
  });

  const [giveaways, setGiveaways] = useState(mockGiveaways);

  // Set of giveaway IDs user has joined
  const [joinedGiveaways, setJoinedGiveaways] = useState(() => {
    const saved = localStorage.getItem('veloop_joined');
    return saved ? JSON.parse(saved) : [];
  });

  // Submitted claims record { [giveawayId]: { ...claimData, timestamp } }
  const [claims, setClaims] = useState(() => {
    const saved = localStorage.getItem('veloop_claims');
    return saved ? JSON.parse(saved) : {};
  });

  const [currentUser] = useState(CURRENT_USER);

  // Sync to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem('veloop_balances', JSON.stringify(balances));
  }, [balances]);

  useEffect(() => {
    localStorage.setItem('veloop_joined', JSON.stringify(joinedGiveaways));
  }, [joinedGiveaways]);

  useEffect(() => {
    localStorage.setItem('veloop_claims', JSON.stringify(claims));
  }, [claims]);

  // Check if user has already participated
  const hasJoined = (giveawayId) => {
    return joinedGiveaways.includes(giveawayId);
  };

  // Calculate deficit if balance is insufficient
  const getBalanceCheck = (cost, currency) => {
    const available = balances[currency] || 0;
    const isSufficient = available >= cost;
    const deficit = Math.max(0, cost - available);
    const remaining = isSufficient ? available - cost : available;

    return {
      available,
      required: cost,
      isSufficient,
      deficit,
      remaining
    };
  };

  // Join giveaway action with balance deduction
  const joinGiveaway = async (giveawayId, cost, currency) => {
    const check = getBalanceCheck(cost, currency);
    if (!check.isSufficient) {
      throw new Error(`Insufficient ${currency}. Deficit: ${check.deficit}`);
    }

    if (hasJoined(giveawayId)) {
      throw new Error("You're already participating in this giveaway.");
    }

    // Deduct balance
    setBalances((prev) => ({
      ...prev,
      [currency]: prev[currency] - cost
    }));

    // Register participation
    setJoinedGiveaways((prev) => [...prev, giveawayId]);

    // Increment spots taken
    setGiveaways((prev) =>
      prev.map((item) =>
        item.id === giveawayId
          ? { ...item, spotsTaken: Math.min(item.totalSpots, item.spotsTaken + 1) }
          : item
      )
    );

    return true;
  };

  // Submit prize claim
  const claimPrize = (giveawayId, claimData) => {
    setClaims((prev) => ({
      ...prev,
      [giveawayId]: {
        ...claimData,
        claimedAt: new Date().toISOString()
      }
    }));

    // Update the giveaway's winner status to CLAIMED
    setGiveaways((prev) =>
      prev.map((g) => {
        if (g.id === giveawayId) {
          return {
            ...g,
            winners: g.winners.map((w) =>
              w.userId === currentUser.id ? { ...w, claimStatus: 'CLAIMED' } : w
            )
          };
        }
        return g;
      })
    );
  };

  // Top up currency for testing purposes
  const addFunds = (currency, amount) => {
    setBalances((prev) => ({
      ...prev,
      [currency]: (prev[currency] || 0) + amount
    }));
  };

  return (
    <GiveawayContext.Provider
      value={{
        currentUser,
        balances,
        giveaways,
        joinedGiveaways,
        claims,
        hasJoined,
        getBalanceCheck,
        joinGiveaway,
        claimPrize,
        addFunds
      }}
    >
      {children}
    </GiveawayContext.Provider>
  );
};

export const useGiveaway = () => {
  const context = useContext(GiveawayContext);
  if (!context) {
    throw new Error('useGiveaway must be used within a GiveawayProvider');
  }
  return context;
};
