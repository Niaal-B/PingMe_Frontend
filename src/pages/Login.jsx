import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Sparkles } from 'lucide-react';
import * as Toast from "@radix-ui/react-toast";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../auth/AuthContext";

const testimonials = [
  {
    quote: "Search and find your dream job is now easier than ever. Just browse a job and apply if you need to.",
    name: "Mas Parjono",
    role: "UI Designer at Google"
  },
  {
    quote: "The platform made my job search incredibly efficient. I found my perfect role within weeks!",
    name: "Sarah Chen",
    role: "Product Manager at Microsoft"
  },
  {
    quote: "Best job portal I've used. The interface is intuitive and the opportunities are endless.",
    name: "James Wilson",
    role: "Software Engineer at Amazon"
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
        const res = await fetch("http://localhost:8000/auth/register", {
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

        <div className="bg-black/60 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-5xl h-[700px] overflow-hidden border border-teal-500/30 relative z-10">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Side - Form */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-2.5 shadow-lg shadow-emerald-500/50">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-white text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text">PingMe</h1>
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              </div>

              <div className="mb-8">
                <h2 className="text-white text-2xl font-semibold mb-1">Welcome {isLogin ? 'Back' : 'to PingMe'}</h2>
                <p className="text-gray-300 text-sm">Please enter your account details</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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

                <div>
                  <label className="text-gray-200 text-sm font-medium block mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/95 text-black placeholder-gray-500 border-2 border-transparent focus:border-emerald-500 focus:outline-none transition-all shadow-lg"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {isLogin && (
                  <div className="text-right">
                    <a href="#" className="text-emerald-300 text-sm hover:text-emerald-200 hover:underline transition-colors font-medium">
                      Forgot Password?
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3.5 rounded-xl mb-6 transition-all shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/50 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLogin ? 'Sign in' : 'Create Account'}
                </button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-black/60 text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mb-6">
                  <button type="button" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3.5 rounded-xl transition-all border border-white/20 hover:border-white/30 transform hover:scale-110 active:scale-95">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                  </button>
                  <button type="button" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3.5 rounded-xl transition-all border border-white/20 hover:border-white/30 transform hover:scale-110 active:scale-95">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.06-.02-2.08-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.92 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.51.12-3.15 0 0 1.01-.32 3.3 1.23A11.47 11.47 0 0 1 12 5.8c1.02.01 2.05.14 3.01.4 2.28-1.55 3.29-1.23 3.29-1.23.67 1.64.26 2.85.13 3.15.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.62-5.48 5.91.43.37.82 1.1.82 2.22 0 1.6-.02 2.88-.02 3.27 0 .32.21.7.83.58A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button type="button" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3.5 rounded-xl transition-all border border-white/20 hover:border-white/30 transform hover:scale-110 active:scale-95">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                </div>

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
            <div className="lg:w-1/2 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-white text-5xl font-bold mb-3 leading-tight">
                  What our<br />users say
                </h2>
                <div className="text-white/30 text-8xl mb-2 font-serif">"</div>
              </div>

              <div className="mb-8 relative z-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                  <p className="text-white text-lg mb-4 leading-relaxed font-medium">
                    {testimonial.quote}
                  </p>
                  <div className="pt-4 border-t border-white/20">
                    <p className="text-white font-bold text-lg">{testimonial.name}</p>
                    <p className="text-white/80 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex gap-3">
                  <button onClick={prevTestimonial} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl transition-all border border-white/30 hover:border-white/40 transform hover:scale-110 active:scale-95">
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button onClick={nextTestimonial} className="bg-black/30 hover:bg-black/40 backdrop-blur-sm p-3 rounded-xl transition-all border border-white/20 hover:border-white/30 transform hover:scale-110 active:scale-95">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30 shadow-xl relative">
                  <button className="absolute -top-3 -right-3 bg-white rounded-full p-2.5 shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 active:scale-95">
                    <Plus className="w-5 h-5 text-emerald-600" />
                  </button>
                  <h3 className="text-white font-bold text-base mb-2 pr-8">
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