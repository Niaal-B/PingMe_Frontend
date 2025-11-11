import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Sparkles, Eye, EyeOff } from 'lucide-react';
import * as Toast from "@radix-ui/react-toast";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../auth/AuthContext";

const testimonials = [
  {
    quote: "PingMe has transformed how our team communicates. Real-time messaging makes collaboration effortless.",
    name: "Alex Martinez",
    role: "Team Lead at TechCorp"
  },
  {
    quote: "The best chat app I've used! Creating rooms is so easy, and the interface is clean and intuitive. Love it!",
    name: "Emma Thompson",
    role: "Developer at StartupHub"
  },
  {
    quote: "Seamless real-time communication with friends and colleagues. PingMe makes staying connected feel effortless.",
    name: "David Kim",
    role: "Product Designer at CreativeStudio"
  }
];

const AuthPages = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonial = testimonials[testimonialIndex];
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (message, type = "success") => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast({ ...toast, open: false }), 3000);
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate("/dashboard");
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.detail || "Registration failed");
        }
  
        showToast("Account created successfully");
        setIsLogin(true);
        setFormData({ username: '', email: '', password: '' });
      }
    } catch (err) {
      console.error("Auth error:", err);
      showToast(err.message || "Something went wrong", "error");
    }
  };

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="bg-black/60 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl h-auto min-h-[460px] overflow-hidden border border-teal-500/30 relative z-10">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Side - Form */}
            <div className="lg:w-1/2 p-5 lg:p-7 flex flex-col justify-center">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-2.5 shadow-lg shadow-emerald-500/50">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-white text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text">PingMe</h1>
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              </div>

              <div className="mb-6">
                <h2 className="text-white text-xl font-semibold mb-1">Welcome {isLogin ? 'Back' : 'to PingMe'}</h2>
                <p className="text-gray-300 text-sm">Please enter your account details</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="text-gray-200 text-sm font-medium block mb-2">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/95 text-black placeholder-gray-500 border-2 border-transparent focus:border-emerald-500 focus:outline-none transition-all shadow-lg"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="text-gray-200 text-sm font-medium block mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/95 text-black placeholder-gray-500 border-2 border-transparent focus:border-emerald-500 focus:outline-none transition-all shadow-lg"
                    placeholder="Johndoe@gmail.com"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="text-gray-200 text-sm font-medium block mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-white/95 text-black placeholder-gray-500 border-2 border-transparent focus:border-emerald-500 focus:outline-none transition-all shadow-lg"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl mb-5 transition-all shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/50 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLogin ? 'Sign in' : 'Create Account'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setFormData({ username: '', email: '', password: '' });
                    }}
                    className="text-emerald-300 text-sm hover:text-emerald-200 hover:underline transition-colors font-medium"
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side - Testimonials */}
            <div className="lg:w-1/2 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-5 lg:p-7 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -mr-28 -mt-28 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-teal-400/20 rounded-full -ml-28 -mb-28 blur-3xl"></div>
              
              <div className="relative z-10 mb-4">
                <h2 className="text-white text-3xl font-bold leading-tight">
                  What our<br />users say
                </h2>
                <div className="text-white/30 text-6xl mb-2 font-serif">"</div>
              </div>

              <div className="mb-5 relative z-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-xl">
                  <p className="text-white text-base mb-3 leading-relaxed font-medium">
                    {testimonial.quote}
                  </p>
                  <div className="pt-4 border-t border-white/20">
                    <p className="text-white font-bold text-base">{testimonial.name}</p>
                    <p className="text-white/80 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex gap-2.5">
                  <button onClick={prevTestimonial} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2.5 rounded-xl transition-all border border-white/30 hover:border-white/40 transform hover:scale-110 active:scale-95">
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button onClick={nextTestimonial} className="bg-black/30 hover:bg-black/40 backdrop-blur-sm p-2.5 rounded-xl transition-all border border-white/20 hover:border-white/30 transform hover:scale-110 active:scale-95">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-xl relative">
                  <button className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 active:scale-95">
                    <Plus className="w-5 h-5 text-emerald-600" />
                  </button>
                  <h3 className="text-white font-bold text-sm mb-2 pr-6">
                    Connect instantly with friends
                  </h3>
                  <p className="text-white/90 text-xs mb-3">
                    Experience seamless messaging and real-time chat.
                  </p>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white shadow-md"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white shadow-md"></div>
                    <div className="w-8 h-8 rounded-full bg-pink-400 border-2 border-white shadow-md"></div>
                    <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white shadow-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast.Root
        open={toast.open}
        onOpenChange={(open) => setToast({ ...toast, open })}
        className={`
          flex items-center space-x-4
          max-w-sm w-full p-4 rounded-xl shadow-2xl
          text-white backdrop-blur-xl
          ${toast.type === "error" ? "bg-gradient-to-r from-red-600/90 to-red-500/90 border border-red-400/50" : "bg-gradient-to-r from-emerald-500/90 to-teal-500/90 border border-emerald-400/50"}
          animate-slide-in-fade
        `}
      >
        <div>
          {toast.type === "error" ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <Toast.Title className="font-semibold text-sm">
            {toast.type === "error" ? "Oops!" : "Success!"}
          </Toast.Title>
          <Toast.Description className="text-sm opacity-90">
            {toast.message}
          </Toast.Description>
        </div>
        <Toast.Close className="text-white opacity-70 hover:opacity-100 transition-opacity">
          ✕
        </Toast.Close>
      </Toast.Root>
    </>
  );
};

export default AuthPages;