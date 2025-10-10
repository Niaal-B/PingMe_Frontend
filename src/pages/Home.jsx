import { useState, useEffect, useRef } from "react";
import Chatbot from "../components/Chatbot";
import FeedbackForm from "../components/FeedbackForm";
import { ChevronDown, Book, GraduationCap, Users, Calendar, MessageCircle, Award, Globe, Star, Briefcase, ChevronRight, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "./home-styles.css";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const statsRef = useRef(null);
  
  // Hero slider content
  const heroSlides = [
    {
      image: "https://www.thejusengg.com/uploads/banner/main/01.jpg",
      title: "Excellence in Education",
      subtitle: "Empowering minds, shaping futures, and building tomorrow's leaders",
      cta: "Apply Now",
      secondaryCta: "Explore Programs"
    },
    {
      image: "https://www.thejusengg.com/assets/images/bg-cprp.jpg",
      title: "World-Class Research",
      subtitle: "Pushing the boundaries of knowledge and innovation",
      cta: "Research Initiatives",
      secondaryCta: "Meet Our Faculty"
    },
    {
      image: "https://www.thejusengg.com/uploads/banner/main/CG1.jpg",
      title: "Vibrant Campus Life",
      subtitle: "Discover a community where ideas flourish and friendships last a lifetime",
      cta: "Student Activities",
      secondaryCta: "Take a Tour"
    }
  ];

  // Featured programs
  const featuredPrograms = [
    {
      title: "Civil Engineering",
      image: "https://imgs.search.brave.com/h82mIEk6fCJdTPXvS5TLE4RcmybMRmnDwnfgI7lHHKY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5Lzg1Lzk1LzA1/LzM2MF9GXzk4NTk1/MDUwMV9aMVpIcjdr/NzFrcG9NQldNb3pi/Y0RYQVg4NkZoTVp1/VS5qcGc",
      description: "Civil engineering is a professional engineering discipline that deals with the design, construction, and maintenance of the physical and naturally built environment",
      level: "Bachelor's & Master's Programs"
    },
    {
      title: "Computer Science And Engineering",
      image: "https://imgs.search.brave.com/2AowIzsnQaIcP0vr93_z2Oil7kDBhLGXVLuBqeKOsUI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzEyLzQwLzM0Lzcy/LzM2MF9GXzEyNDAz/NDcyNTZfV3lqSWNk/MlVHNG9saVZ3T0VI/Z0F2VHRSRkNzRWtk/NVIuanBn",
      description: "Computer engineers are responsible for creating the hardware and software systems that make computers and other digital devices function.",
      level: "Bachelor's & Master's Programs"
    },
    {
      title: "Electrical and Electronics Engineering",
      image: "https://imgs.search.brave.com/YZF11ON8bfQ_lKu4_0GADlADIpbRhNhJm43yw74vbhU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/ZGlmZmVyZW5jZXMt/YmV0d2Vlbi1lbGVj/dHJpY2FsLWVuZ2lu/ZWVyaW5nLWFuZC1l/bGVjdHJvbmljLXYw/LWlzcDVhaXJ0cjZs/ZDEuanBlZz93aWR0/aD02NDAmY3JvcD1z/bWFydCZhdXRvPXdl/YnAmcz00ODUxOWZk/ZmE4NDRkNDg5NWY5/MTFhMzJkMWQ3Y2Fj/MDJjNDU1ZDk4",
      description: "Address critical environmental challenges through interdisciplinary study.",
      level: "Bachelor's & Master's Programs"
    },
    {
      title: "Mechanical Engineering",
      image: "https://imgs.search.brave.com/Sa7U-Gj29Vzf6qUMoYslSvuL8ymihvk6SuQR2tDaDlw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI4/MzcwMjUzOS9waG90/by9tZWNoYW5pY2Fs/LWVuZ2luZWVyaW5n/LXByb2plY3QuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPU1p/VEFjaFBvbEY0UG1z/QXlWdHRjbmZyaEpX/bDBvbWFTTy1BOXNH/NU9Cb009",
      description: " Mechanical engineering is the study of physical machines that may involve force and movement.",
      level: "Bachelor's Program"
    }
  ];

  const featuredEvents = [
    { 
      title: "APJAKTU E ZONE VOLLEYBALL CHAMPIONSHIP 2024-25 WINNER", 
      date: "April 10, 2025", 
      category: "Campus Event",
      image: "https://www.thejusengg.com/uploads/reviews/main/Volleyball_Cup_News.jpg",
      description: "Thejus Engineering College is the winner of APJAKTU E ZONE VOLLEYBALL CHAMPIONSHIP 2024-25",
      location: "Student Center, Main Campus"
    },
    { 
      title: "Introduction to Embedded Computing - Phase I Training", 
      date: "March 25, 2025", 
      category: "Career Development",
      image: "https://www.thejusengg.com/uploads/reviews/main/Introduction_to_Embedded_Computing_-_Phase_I_Training_-_02.jpg",
      description: "Connect with over 50 employers from various industries looking to hire our talented students and alumni for internships and full-time positions.",
      location: "Williams Hall, East Wing"
    },
    { 
      title: "Robotics Workshop in association with IEDC and IIC for GDES and KHSS", 
      date: "April 15, 2025", 
      category: "Networking",
      image: "https://www.thejusengg.com/uploads/reviews/main/WhatsApp_Image_2023-12-08_at_4.16_.29_PM_.jpeg",
      description: "Meet successful alumni from various fields and build valuable connections that can help shape your professional journey.",
      location: "Grand Alumni Center"
    },
    { 
      title: "Research Symposium", 
      date: "April 22, 2025", 
      category: "Academic",
      image: "https://www.thejusengg.com/uploads/reviews/main/Gate.jpg",
      description: "Gate Awareness Program was organized by the department for 5th semester students on 5th November 2019.",
      location: "Science Complex, Rooms 100-120"
    }
  ];

  const newsItems = [
    { 
      title: "New Research Grant Awarded", 
      date: "March 14, 2025",
      image: "/api/placeholder/400/250",
      excerpt: "Our Chemistry Department has received a $2.5 million grant to develop sustainable materials for clean energy applications."
    },
    { 
      title: "Campus Renovation Project", 
      date: "March 12, 2025",
      image: "/api/placeholder/400/250",
      excerpt: "The historic Wilson Hall renovation has been completed, featuring state-of-the-art classrooms and collaborative spaces."
    },
    { 
      title: "Student Team Wins Competition", 
      date: "March 8, 2025",
      image: "/api/placeholder/400/250",
      excerpt: "Our robotics team took first place at the National Engineering Challenge with their innovative disaster response robot."
    },
    { 
      title: "New International Partnership", 
      date: "March 5, 2025",
      image: "/api/placeholder/400/250",
      excerpt: "We've established a new exchange program with the University of Tokyo, expanding our global education opportunities."
    }
  ];

  const testimonials = [
    {
      name: "Emily Johnson",
      role: "Class of 2024, Computer Science",
      quote: "The professors here truly care about your success. They've helped me secure internships and develop skills that made me stand out to employers.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Marcus Chen",
      role: "Class of 2023, Business Administration",
      quote: "The hands-on learning experiences and networking opportunities completely transformed my career trajectory. I received three job offers before graduation!",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Dr. Sarah Williams",
      role: "Alumni, Now Research Scientist at NASA",
      quote: "The foundation I received here prepared me for challenges I never imagined I could tackle. The mentorship was invaluable to my career.",
      image: "/api/placeholder/150/150"
    }
  ];

  const campusFeatures = [
    {
      title: "Modern Facilities",
      description: "State-of-the-art classrooms, laboratories, and collaborative spaces designed for optimal learning experiences.",
      icon: <Award size={32} />
    },
    {
      title: "Beautiful Campus",
      description: "300 acres of stunning landscapes, historic architecture, and contemporary design create an inspiring environment.",
      icon: <MapPin size={32} />
    },
    {
      title: "Global Community",
      description: "Students and faculty from over 80 countries bring diverse perspectives to our vibrant campus.",
      icon: <Globe size={32} />
    },
    {
      title: "Career Success",
      description: "95% of our graduates secure employment or continue to advanced studies within six months of graduation.",
      icon: <Briefcase size={32} />
    }
  ];

  // Stats counter
  const collegeStats = [
    { value: 15000, label: "Students" },
    { value: 1200, label: "Faculty Members" },
    { value: 120, label: "Academic Programs" },
    { value: 250, label: "Partner Universities" }
  ];
  
  // Auto advance hero slider
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentSlide, heroSlides.length]);

  // Simulate content loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 600);
  }, []);

  // Intersection observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStatsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  return (
    <div className="college-website">
      {/* Enhanced Hero Section with Slider */}
      <div className={`hero-section ${isLoaded ? 'loaded' : ''}`}>
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <div 
              key={index} 
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <div className="hero-buttons">
                  <button className="btn btn-primary">{slide.cta}</button>
                  <button className="btn btn-secondary">{slide.secondaryCta}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="slider-dots">
          {heroSlides.map((_, index) => (
            <button 
              key={index} 
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
        <div className="scroll-indicator">
          <ChevronDown size={40} />
        </div>
      </div>

      {/* Announcement Banner */}
      <div className="announcement-banner">
        <div className="announcement-content">
          <span className="announcement-label">Important Date</span>
          <p className="announcement-text">Fall 2025 Application Deadline: May 1st, 2025</p>
          <button className="announcement-button">Apply Now</button>
        </div>
      </div>

      {/* Quick Links Section with Enhanced Animation */}
      <div className="quick-links-section">
        <div className="section-header">
          <h2 className="section-title">Explore Our College</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">Discover what makes our institution special</p>
        </div>
        <div className="quick-links-container">
          {[
            { icon: <Book size={32} />, title: "Academics", desc: "Explore our programs and courses" },
            { icon: <GraduationCap size={32} />, title: "Admissions", desc: "Application process and requirements" },
            { icon: <Users size={32} />, title: "Student Life", desc: "Campus activities and resources" },
            { icon: <Calendar size={32} />, title: "Events", desc: "Upcoming campus events and news" }
          ].map((item, index) => (
            <div 
              key={index} 
              className={`quick-link-card ${isLoaded ? 'loaded' : ''}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="quick-link-icon">{item.icon}</div>
              <h3 className="quick-link-title">{item.title}</h3>
              <p className="quick-link-desc">{item.desc}</p>
              <button className="quick-link-button">
                Learn More <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Programs Section */}
      <div className="featured-programs-section">
        <div className="section-header">
          <h2 className="section-title">Featured Academic Programs</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">Discover our most popular degree programs</p>
        </div>
        <div className="programs-grid">
          {featuredPrograms.map((program, index) => (
            <div 
              key={index}
              className="program-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="program-image">
                <img src={program.image} alt={program.title} />
                <div className="program-overlay">
                  <span className="program-level">{program.level}</span>
                </div>
              </div>
              <div className="program-content">
                <h3 className="program-title">{program.title}</h3>
                <p className="program-description">{program.description}</p>
                <a href="#" className="program-link">
                  Explore Curriculum <ChevronRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="see-all-programs">
          <a href="#" className="btn btn-outline">View All Programs</a>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className="stats-section" ref={statsRef}>
        <div className="stats-overlay"></div>
        <div className="stats-container">
          <div className="section-header light">
            <h2 className="section-title">College By The Numbers</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Our impact in education and research</p>
          </div>
          <div className="stats-grid">
            {collegeStats.map((stat, index) => (
              <div 
                key={index} 
                className="stat-card"
              >
                <div className="stat-value">
                  {isStatsVisible ? (
                    <span className="counter">{stat.value.toLocaleString()}</span>
                  ) : (
                    <span>0</span>
                  )}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campus Features Section */}
      <div className="campus-features-section">
        <div className="section-header">
          <h2 className="section-title">What Sets Us Apart</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">Experience the difference of our unique campus environment</p>
        </div>
        <div className="features-container">
          {campusFeatures.map((feature, index) => (
            <div 
              key={index}
              className="feature-card"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced News & Events Section */}
      <div className="news-events-section">
        {/* <div className="section-header">
          <h2 className="section-title">News & Events</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">Stay updated with the latest happenings on campus</p>
        </div> */}
        <div className="news-events-container">
          <div className="news-events-tabs">
            <button className="tab-button active">Featured Events</button>
            <button className="tab-button">College News</button>
          </div>
          <div className="news-events-content">
            {/* Events */}
            <div className="events-grid">
              {featuredEvents.map((event, index) => (
                <div 
                  key={index} 
                  className={`event-card ${activeSection === `event-${index}` ? 'active' : ''}`}
                  onMouseEnter={() => setActiveSection(`event-${index}`)}
                  onMouseLeave={() => setActiveSection(null)}
                >
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                    <div className="event-date-badge">
                      <div className="event-month">{event.date.split(" ")[0]}</div>
                      <div className="event-day">{event.date.split(" ")[1].replace(",", "")}</div>
                    </div>
                  </div>
                  <div className="event-content">
                    <span className="event-category">{event.category}</span>
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-details">
                      <p className="event-description">{event.description}</p>
                      <div className="event-location">
                        <MapPin size={16} />
                        <span>{event.location}</span>
                      </div>
                      <a href="#" className="event-link">
                        Details & Registration
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="view-all-button">
              View All Events <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <FeedbackForm/>
      
      {/* News Highlights */}
      {/* <div className="news-highlights-section">
        <div className="section-header">
          <h2 className="section-title">Latest News</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">Stories from across our campus</p>
        </div>
        <div className="news-grid">
          {newsItems.map((news, index) => (
            <div 
              key={index} 
              className={`news-card ${activeSection === `news-${index}` ? 'active' : ''}`}
              onMouseEnter={() => setActiveSection(`news-${index}`)}
              onMouseLeave={() => setActiveSection(null)}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="news-image">
                <img src={news.image} alt={news.title} />
                <div className="news-date-badge">{news.date}</div>
              </div>
              <div className="news-content">
                <h3 className="news-title">{news.title}</h3>
                <p className="news-excerpt">{news.excerpt}</p>
                <a href="#" className="news-link">
                  Read Full Story <ChevronRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="news-cta">
          <a href="#" className="btn btn-outline">View All News</a>
        </div>
      </div> */}

      {/* Testimonials Section */}
      {/* <div className="testimonials-section">
        <div className="testimonials-overlay"></div>
        <div className="testimonials-container">
          <div className="section-header light">
            <h2 className="section-title">Student & Alumni Voices</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Hear from those who've experienced our college</p>
          </div>
          <div className="testimonials-slider">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`testimonial-card ${index === 1 ? 'active' : ''}`}
              >
                <div className="testimonial-quote-mark">"</div>
                <p className="testimonial-text">{testimonial.quote}</p>
                <div className="testimonial-author">
                  <div className="testimonial-author-image">
                    <img src={testimonial.image} alt={testimonial.name} />
                  </div>
                  <div className="testimonial-author-info">
                    <div className="testimonial-author-name">{testimonial.name}</div>
                    <div className="testimonial-author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button key={index} className={`testimonial-dot ${index === 1 ? 'active' : ''}`}></button>
            ))}
          </div>
        </div>
      </div> */}



      {/* Enhanced Connect Section */}
      {/* <div className="connect-section">
        <div className="section-header">
          <h2 className="section-title">Connect With Us</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">We'd love to hear from you</p>
        </div>
        <div className="connect-container">
          <div className="connect-card">
            <div className="connect-card-content">
              <h3 className="connect-card-title">Have Questions?</h3>
              <p className="connect-card-description">
                Our admissions team is here to help you navigate the application process and answer any questions you might have.
              </p>
              <div className="connect-contact-info">
                <div className="connect-contact-item">
                  <Phone size={20} />
                  <span>(123) 456-7890</span>
                </div>
                <div className="connect-contact-item">
                  <Mail size={20} />
                  <span>admissions@college.edu</span>
                </div>
              </div>
              <button className="btn btn-primary">Schedule a Call</button>
            </div>
          </div>
          <div className="feedback-form-container">
            <FeedbackForm />
          </div>
        </div>
      </div> */}

      {/* Instagram Feed Section */}
      {/* <div className="instagram-section">
        <div className="section-header">
          <h2 className="section-title">Campus Life</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">Follow us on Instagram @OurCollege</p>
        </div>
        <div className="instagram-grid">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="instagram-item">
              <img src={`/api/placeholder/300/300?text=Campus${index+1}`} alt={`Campus life ${index + 1}`} />
              <div className="instagram-overlay">
                <Instagram size={24} />
              </div>
            </div>
          ))}
        </div>
        <a href="#" className="instagram-link">View More Photos</a>
      </div> */}

      {/* Enhanced Footer */}
      <footer className="footer">
        {/* <div className="footer-top">
          <div className="footer-logo">
            <img src="/api/placeholder/200/80?text=CollegeLogo" alt="College logo" />
            <p className="footer-tagline">Empowering minds since 1875</p>
          </div>
          <div className="footer-newsletter">
            <h3 className="footer-newsletter-title">Subscribe to Our Newsletter</h3>
            <div className="footer-form">
              <input type="email" placeholder="Your email address" className="footer-input" />
              <button className="footer-button">Subscribe</button>
            </div>
          </div>
        </div> */}
        <div className="footer-container">
          <div className="footer-columns">
            <div className="footer-column">
              <h3 className="footer-title">About Us</h3>
              <ul className="footer-links">
                <li><a href="#">Mission & Vision</a></li>
                <li><a href="#">Leadership</a></li>
                <li><a href="#">History</a></li>
                <li><a href="#">Diversity & Inclusion</a></li>
                <li><a href="#">Campus Map</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Academics</h3>
              <ul className="footer-links">
                <li><a href="#">Undergraduate Programs</a></li>
                <li><a href="#">Graduate Programs</a></li>
                <li><a href="#">Departments</a></li>
                <li><a href="#">Faculty Directory</a></li>
                <li><a href="#">Research Centers</a></li>
                <li><a href="#">Academic Calendar</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Student Life</h3>
              <ul className="footer-links">
                <li><a href="#">Housing & Dining</a></li>
                <li><a href="#">Clubs & Activities</a></li>
                <li><a href="#">Athletics & Recreation</a></li>
                <li><a href="#">Health & Wellness</a></li>
                <li><a href="#">Support Services</a></li>
                <li><a href="#">Campus Safety</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Resources</h3>
              <ul className="footer-links">
                <li><a href="#">Library</a></li>
                <li><a href="#">Technology Services</a></li>
                <li><a href="#">Career Center</a></li>
                <li><a href="#">Alumni Association</a></li>
                <li><a href="#">Giving</a></li>
                <li><a href="#">Parents & Families</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Contact</h3>
              <ul className="footer-contact">
                <li><MapPin size={16} /> 123 College Street</li>
                <li>City, State 12345</li>
                <li><Phone size={16} /> (123) 456-7890</li>
                <li><Mail size={16} /> info@college.edu</li>
              </ul>
              <div className="social-links">
                <a href="#" className="social-link"><Facebook size={20} /></a>
                <a href="#" className="social-link"><Twitter size={20} /></a>
                <a href="#" className="social-link"><Instagram size={20} /></a>
                <a href="#" className="social-link"><Linkedin size={20} /></a>
                <a href="#" className="social-link"><Youtube size={20} /></a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-container">
            <p>&copy; 2025 College Name. All rights reserved.</p>
            <ul className="footer-legal">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Use</a></li>
              <li><a href="#">Accessibility</a></li>
              <li><a href="#">Emergency Info</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Enhanced Chatbot floating button */}
      <div className="chatbot-container">
        <Chatbot />
      </div>
      
      {/* Back to top button */}
      <button className="back-to-top">
        <ChevronDown size={24} />
      </button>
    </div>
  );
};

export default Home;