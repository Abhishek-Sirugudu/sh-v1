import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../auth/firebase';
import { Mail, Lock, User, Briefcase, GraduationCap, Loader2 } from 'lucide-react';
import brandLogo from '../../assets/just_logo.jpeg';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: formData.email,
        displayName: formData.name,
        role: role,
        accountStatus: role === 'student' ? 'active' : 'pending',
        createdAt: new Date().toISOString(),
        photoURL: '',
        xp: 0
      });

      setLoading(false);
      
      if (role === 'student') {
        navigate('/student/dashboard');
      } else {
        alert("Account created! Please wait for admin approval.");
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase:', '').trim());
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12">
        <div className="text-center mb-8">
          <img src={brandLogo} alt="Logo" className="w-12 h-12 rounded-lg mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900">Create your account</h2>
          <p className="text-slate-500 mt-2">
            {step === 1 ? 'First, tell us who you are.' : `Join as a ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelect('student')}
              className="w-full p-4 flex items-center gap-4 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group text-left cursor-pointer"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">I am a Student</h3>
                <p className="text-sm text-slate-500">Access courses, take exams, and earn certificates.</p>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('instructor')}
              className="w-full p-4 flex items-center gap-4 bg-white border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group text-left cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">I am an Instructor</h3>
                <p className="text-sm text-slate-500">Create content, manage students, and grade exams.</p>
              </div>
            </button>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already have an account? <Link to="/login" className="font-bold text-slate-900 hover:underline">Sign in</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                    placeholder="••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                    placeholder="••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 flex justify-center items-center gap-2 mt-6 cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
            </button>

            <div className="text-center mt-6">
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-sm text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                ← Back to role selection
              </button>
            </div>
          </form>
        )}
      </div>
      
      <div className="absolute bottom-6 text-slate-400 text-xs">
        © 2026 SHNOOR International.
      </div>
    </div>
  );
};

export default Register;