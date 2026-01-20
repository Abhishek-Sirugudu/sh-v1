import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../auth/firebase';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import brandLogo from '../../assets/just_logo.jpeg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg("Unable to send reset link. Please check the email address.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-600 mb-4">
              <Mail size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>
          </div>

          {status === 'success' ? (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col items-center">
                <CheckCircle className="text-green-600 mb-3" size={40} />
                <h3 className="font-bold text-green-800 text-lg">Email Sent!</h3>
                <p className="text-sm text-green-700 mt-1">
                  Check your inbox for the reset instructions.
                </p>
              </div>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md"
              >
                <ArrowLeft size={18} className="mr-2" /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              {status === 'error' && (
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center text-left">
                  <span className="mr-2">⚠️</span> {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  {/* FIXED: Added text-slate-900 to ensure text is black */}
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              {/* FIXED: Explicit button styling (Dark background, White text) */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer"
              >
                {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
              </button>

              <div className="text-center mt-6">
                <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                  <ArrowLeft size={16} className="mr-2" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-6 flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
        <img src={brandLogo} alt="Logo" className="w-5 h-5 rounded" />
        <span className="text-xs font-bold text-slate-500 tracking-wider">SHNOOR International</span>
      </div>
    </div>
  );
};

export default ForgotPassword;