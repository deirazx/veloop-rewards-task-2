import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, CheckCircle2, AlertCircle, ShieldCheck, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGiveaway } from '../../context/GiveawayContext';

export default function PhysicalClaimModal({ giveaway, isOpen, onClose }) {
  const { currentUser, claimPrize } = useGiveaway();

  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: '',
    city: '',
    state: '',
    pinCode: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !giveaway) return null;

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(formData.phone.trim())) {
      errs.phone = 'Enter a valid phone number';
    }
    if (!formData.address.trim()) errs.address = 'Full street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.pinCode.trim()) {
      errs.pinCode = 'Postal PIN code is required';
    } else if (!/^[0-9]{6}$/.test(formData.pinCode.trim())) {
      errs.pinCode = 'Enter a valid 6-digit Indian PIN code';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await claimPrize(giveaway.id, {
        type: 'PHYSICAL',
        prize: giveaway.title,
        shipping: formData
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });

      setIsSuccess(true);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to submit physical claim.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-deep-card border border-slate-700/80 shadow-2xl p-6 md:p-8"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-reward-gold/20 border border-reward-gold/40 flex items-center justify-center text-reward-gold shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-reward-gold">
                Winner Verification Portal
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Claim Physical Prize
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-sm">
                {giveaway.title}
              </p>
            </div>
          </div>

          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-bold text-white">Shipping Dispatch Order Placed!</h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Your dispatch details have been cryptographically locked and queued for premium insured delivery. Tracking number will be emailed to <span className="text-purple-300">{currentUser?.email}</span>.
              </p>
              <div className="p-4 rounded-xl bg-obsidian/70 border border-slate-800 text-left text-xs space-y-1.5 text-slate-300">
                <div><strong>Recipient:</strong> {formData.fullName} ({formData.phone})</div>
                <div><strong>Destination:</strong> {formData.address}, {formData.city}, {formData.state} - {formData.pinCode}</div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-semibold bg-accent-purple hover:bg-purple-600 text-white transition shadow-lg shadow-purple-950/50"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Requires official residential address for secure hand-to-hand OTP delivery.</span>
              </div>

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Alex Mercer"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-obsidian border ${errors.fullName ? 'border-red-500' : 'border-slate-700'} text-white text-sm focus:outline-none focus:border-accent-purple`}
                  />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone Number (for Courier OTP) *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-obsidian border ${errors.phone ? 'border-red-500' : 'border-slate-700'} text-white text-sm focus:outline-none focus:border-accent-purple`}
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Residential / Office Address *
                </label>
                <textarea
                  rows="2"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Flat / House No., Building Name, Street & Landmark"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-obsidian border ${errors.address ? 'border-red-500' : 'border-slate-700'} text-white text-sm focus:outline-none focus:border-accent-purple resize-none`}
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>

              {/* City, State, PIN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-obsidian border ${errors.city ? 'border-red-500' : 'border-slate-700'} text-white text-sm focus:outline-none focus:border-accent-purple`}
                  />
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Maharashtra"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-obsidian border ${errors.state ? 'border-red-500' : 'border-slate-700'} text-white text-sm focus:outline-none focus:border-accent-purple`}
                  />
                  {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    PIN Code (6 digits) *
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="400001"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-obsidian border ${errors.pinCode ? 'border-red-500' : 'border-slate-700'} text-white text-sm focus:outline-none focus:border-accent-purple`}
                  />
                  {errors.pinCode && <p className="text-red-400 text-xs mt-1">{errors.pinCode}</p>}
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-reward-gold to-amber-600 hover:from-amber-600 hover:to-reward-gold transition shadow-lg shadow-amber-950/50 disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming Dispatch...' : 'Lock Shipping Address'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
