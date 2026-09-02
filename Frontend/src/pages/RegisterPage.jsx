import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Gift, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useGiveaway } from '../context/GiveawayContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser } = useGiveaway();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerUser(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-deep-card border border-slate-800 p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-purple via-reward-gold to-accent-purple" />

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-reward-gold border border-amber-500/30">
            <Gift className="w-3.5 h-3.5" />
            <span>Welcome Grant: 5,500 Credits</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-3 tracking-tight">
            Create VELOOP Account
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            New members instantly receive starting balances: 1,000 VES • 1,500 SVES • 3,000 Tokens.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Legal Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alex Mercer"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian border border-slate-700 text-white text-sm focus:outline-none focus:border-accent-purple transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian border border-slate-700 text-white text-sm focus:outline-none focus:border-accent-purple transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian border border-slate-700 text-white text-sm focus:outline-none focus:border-accent-purple transition"
              />
            </div>
          </div>

          <div className="p-3 bg-obsidian/70 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-reward-gold" />
              <span>Instant Wallet Provisioning:</span>
            </div>
            <div className="flex justify-between font-mono text-xs">
              <span className="text-purple-300">1,000 VES</span>
              <span className="text-amber-300">1,500 SVES</span>
              <span className="text-blue-300">3,000 Tokens</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-accent-purple to-purple-600 hover:from-purple-600 hover:to-accent-purple transition shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Provisioning Wallet...</span>
              </>
            ) : (
              <>
                <span>Create Account &amp; Claim Balances</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-accent-purple font-bold hover:underline">
            Log In to Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
