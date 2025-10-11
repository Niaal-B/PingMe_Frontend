import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

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
  const [isLogin, setIsLogin] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      const loginData = {
        email: formData.email,
        password: formData.password
      };
      console.log('Login Data:', loginData);
      alert('Login submitted! Check console for data.');
    } else {
      const signupData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      console.log('Signup Data:', signupData);
      alert('Sign up submitted! Check console for data.');
    }
  };

  const testimonial = testimonials[currentTestimonial];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center p-4">
<div className="bg-black rounded-3xl shadow-2xl w-full max-w-4xl h-[610px] overflow-hidden">
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
                <button
                  type="button"
                  className="bg-white hover:bg-gray-100 p-3 rounded-full transition-colors"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  className="bg-white hover:bg-gray-100 p-3 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  className="bg-white hover:bg-gray-100 p-3 rounded-full transition-colors"
                >
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
                <button
                  onClick={prevTestimonial}
                  className="bg-white hover:bg-gray-100 p-3 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-black" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="bg-gray-900 hover:bg-gray-800 p-3 rounded-lg transition-colors"
                >
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
  );
};

export default AuthPages;
