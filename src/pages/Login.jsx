import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center p-4">
        <div className="bg-black rounded-3xl shadow-2xl w-full max-w-4xl h-[650px] overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Form */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              <div className="mb-8">
                <h1 className="text-white text-2xl font-bold">PingMe</h1>
              </div>

              <div className="mb-8">
                <h2 className="text-white text-xl mb-2">Please Enter your Account details</h2>
              </div>

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-6">
                    <label className="text-white text-sm block mb-2">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white text-black"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                )}

                <div className="mb-6">
                  <label className="text-white text-sm block mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white text-black"
                    placeholder="Johndoe@gmail.com"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="text-white text-sm block mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white text-black"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {isLogin && (
                  <div className="text-right mb-6">
                    <a href="#" className="text-white text-sm hover:underline">
                      Forgot Password
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg mb-6 transition-colors"
                >
                  {isLogin ? 'Sign in' : 'Sign up'}
                </button>

                <div className="flex justify-center gap-4 mb-6">
                  <button type="button" className="bg-white hover:bg-gray-100 p-3 rounded-full transition-colors">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                  </button>
                  <button type="button" className="bg-white hover:bg-gray-100 p-3 rounded-full transition-colors">
                                    <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.06-.02-2.08-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.92 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.51.12-3.15 0 0 1.01-.32 3.3 1.23A11.47 11.47 0 0 1 12 5.8c1.02.01 2.05.14 3.01.4 2.28-1.55 3.29-1.23 3.29-1.23.67 1.64.26 2.85.13 3.15.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.62-5.48 5.91.43.37.82 1.1.82 2.22 0 1.6-.02 2.88-.02 3.27 0 .32.21.7.83.58A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  </button>
                  <button type="button" className="bg-white hover:bg-gray-100 p-3 rounded-full transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
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
                    className="text-white text-sm hover:underline"
                  >
                    {isLogin ? 'Create an account' : 'Already have an account? Sign in'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side - Testimonials */}
            <div className="lg:w-1/2 bg-emerald-500 p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <h2 className="text-white text-4xl font-bold mb-2">
                  What our<br />users say
                </h2>
                <div className="text-white text-6xl mb-1">"</div>
              </div>

              <div className="mb-2">
                <p className="text-white text-lg mb-2 leading-relaxed">
                  {testimonial.quote}
                </p>
                <p className="text-white font-semibold text-lg">{testimonial.name}</p>
                <p className="text-white text-sm opacity-90">{testimonial.role}</p>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-3">
                  <button onClick={prevTestimonial} className="bg-white hover:bg-gray-100 p-3 rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5 text-black" />
                  </button>
                  <button onClick={nextTestimonial} className="bg-gray-900 hover:bg-gray-800 p-3 rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 relative h-[190px]">
                <button className="absolute -top-4 right-6 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow">
                  <Plus className="w-6 h-6 text-black" />
                </button>
                <h3 className="text-black font-semibold text-lg mb-3">
                  Connect instantly with friends on PingMe
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Experience seamless messaging and real-time chat with everyone.
                </p>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-pink-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white"></div>
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
          text-white
          ${toast.type === "error" ? "bg-gradient-to-r from-red-600 to-red-500" : "bg-gradient-to-r from-emerald-500 to-green-500"}
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
