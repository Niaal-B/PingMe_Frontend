import { useState } from "react";
import axios from "axios";
import "./feedback-form.css";

const FeedbackForm = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [focused, setFocused] = useState({
        name: false,
        email: false,
        message: false
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFocus = (field) => {
        setFocused({ ...focused, [field]: true });
    };

    const handleBlur = (field) => {
        setFocused({ ...focused, [field]: formData[field].trim() !== "" });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://127.0.0.1:8000/api/submit-feedback/", formData)
            .then(() => {
                setSubmitted(true);
                setFormData({ name: "", email: "", message: "" });
                setFocused({ name: false, email: false, message: false });
                setTimeout(() => setSubmitted(false), 3000);
            })
            .catch((error) => console.error("Error submitting feedback:", error));
    };

    return (
        <div className="feedback-form-container">
            <div className="form-header">
                <h2>Share Your Feedback</h2>
                <p>We'd love to hear from you!</p>
            </div>
            
            {submitted && (
                <div className="success-message">
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                    <p>Thank you for your feedback!</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className={submitted ? "hidden" : ""}>
                <div className="form-group">
                    <input 
                        type="text" 
                        id="name"
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        onFocus={() => handleFocus('name')}
                        onBlur={() => handleBlur('name')}
                        required 
                        className={focused.name ? "has-content" : ""}
                    />
                    <label htmlFor="name" className={focused.name ? "active" : ""}>Name</label>
                    <span className="focus-border"></span>
                </div>
                
                <div className="form-group">
                    <input 
                        type="email" 
                        id="email"
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        onFocus={() => handleFocus('email')}
                        onBlur={() => handleBlur('email')}
                        required 
                        className={focused.email ? "has-content" : ""}
                    />
                    <label htmlFor="email" className={focused.email ? "active" : ""}>Email</label>
                    <span className="focus-border"></span>
                </div>
                
                <div className="form-group">
                    <textarea 
                        id="message"
                        name="message" 
                        value={formData.message} 
                        onChange={handleChange} 
                        onFocus={() => handleFocus('message')}
                        onBlur={() => handleBlur('message')}
                        required 
                        className={focused.message ? "has-content" : ""}
                    ></textarea>
                    <label htmlFor="message" className={focused.message ? "active" : ""}>Your Message</label>
                    <span className="focus-border"></span>
                </div>
                
                <button type="submit" className="submit-button">
                    <span>Submit Feedback</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;
