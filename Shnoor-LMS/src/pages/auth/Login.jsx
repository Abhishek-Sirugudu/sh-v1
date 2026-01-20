import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../auth/firebase';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import brandLogo from '../../assets/just_logo.jpeg';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'instructor') navigate('/instructor/dashboard');
        else navigate('/student/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          email: user.email,
          displayName: user.displayName,
          role: 'student',
          accountStatus: 'active',
          createdAt: new Date().toISOString()
        });
        navigate('/student/dashboard');
      } else {
        const role = docSnap.data().role;
        navigate(`/${role}/dashboard`);
      }
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 bg-[#0F172A] p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 z-0"></div>
          <div className="relative z-10">
            <img src={brandLogo} alt="Logo" className="w-12 h-12 rounded-lg mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">Master Your Skills with SHNOOR</h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Join thousands of learners and instructors on the most advanced learning management platform.
            </p>
          </div>
          <div className="relative z-10 text-slate-500 text-sm">
            © 2026 SHNOOR International.
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500 mb-8">Please enter your details to access your workspace.</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all flex justify-center items-center gap-3 cursor-pointer"
            >
              Google
            </button>

            <div className="mt-8 text-center text-sm text-slate-500">
              Don't have an account? <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">Create an account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;