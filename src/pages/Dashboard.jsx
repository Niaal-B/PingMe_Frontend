import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboard.css"; // Import the CSS file we just created

const Dashboard = () => {
    const [qaData, setQaData] = useState([]);
    const [feedbackData, setFeedbackData] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [newAnswer, setNewAnswer] = useState("");
    const [editId, setEditId] = useState(null);
    const [editQuestion, setEditQuestion] = useState("");
    const [editAnswer, setEditAnswer] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showSidebar, setShowSidebar] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            
            if (!token) {
                console.error("No token found, redirecting to login...");
                navigate("/login");
                return;
            }

            try {
                await axios.get("http://127.0.0.1:8000/api/admin-dashboard/qa/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                fetchQA();
                fetchFeedback();
            } catch (error) {
                console.error("Authentication failed:", error.response?.data || error.message);
                localStorage.removeItem("accessToken");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const fetchQA = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/admin-dashboard/qa/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQaData(response.data);
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to fetch Q&A.");
        }
    };

    const fetchFeedback = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/admin-dashboard/feedback/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFeedbackData(response.data);
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to fetch Feedback.");
        }
    };

    const handleAddQA = async () => {
        if (!newQuestion || !newAnswer) {
            setError("Both question and answer are required.");
            return;
        }

        const token = localStorage.getItem("accessToken");
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/admin-dashboard/qa/",
                { question: newQuestion, answer: newAnswer },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setQaData([...qaData, response.data]);
            setNewQuestion("");
            setNewAnswer("");
            setError("");
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to add Q&A.");
        }
    };

    const handleEditQA = async (id) => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/admin-dashboard/qa/${id}/`,
                { question: editQuestion, answer: editAnswer },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setQaData(qaData.map((qa) => (qa.id === id ? response.data : qa)));
            setEditId(null);
            setEditQuestion("");
            setEditAnswer("");
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to update Q&A.");
        }
    };

    const handleDeleteQA = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Q&A?")) return;
        
        const token = localStorage.getItem("accessToken");
        try {
            await axios.delete(`http://127.0.0.1:8000/api/admin-dashboard/qa/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setQaData(qaData.filter((qa) => qa.id !== id));
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to delete Q&A.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    };

    if (loading) return (
        <div className="loading">
            <div className="spinner"></div>
        </div>
    );

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className={`sidebar ${showSidebar ? 'show' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">College<span>Admin</span></div>
                </div>
                
                <ul className="sidebar-nav">
                    <li className="nav-item">
                        <a href="#dashboard" className="nav-link active">
                            <i className="fa fa-dashboard"></i>Dashboard
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#qa" className="nav-link">
                            <i className="fa fa-comments"></i>Q&A Management
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#feedback" className="nav-link">
                            <i className="fa fa-comment"></i>User Feedback
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#settings" className="nav-link">
                            <i className="fa fa-cog"></i>Settings
                        </a>
                    </li>
                </ul>
                
                <button onClick={handleLogout} className="logout-btn">
                    <i className="fa fa-sign-out"></i> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="dashboard-header">
                    <h1 className="dashboard-title">Chatbot Admin Dashboard</h1>
                    
                    <div className="user-menu">
                        <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => setShowSidebar(!showSidebar)}
                        >
                            <i className={`fa fa-${showSidebar ? 'times' : 'bars'}`}></i>
                        </button>
                        <div className="user-avatar">A</div>
                    </div>
                </header>

                {/* Stats Overview */}
                <div className="widget-container">
                    <div className="widget">
                        <div className="widget-header">
                            <h3 className="widget-title">Total Q&A Entries</h3>
                            <i className="fa fa-question-circle"></i>
                        </div>
                        <div className="widget-value">{qaData.length}</div>
                        <div className="widget-footer">Updated just now</div>
                    </div>
                    
                    <div className="widget">
                        <div className="widget-header">
                            <h3 className="widget-title">Total Feedback</h3>
                            <i className="fa fa-comment"></i>
                        </div>
                        <div className="widget-value">{feedbackData.length}</div>
                        <div className="widget-footer">Updated just now</div>
                    </div>
                </div>

                {/* Error Messages */}
                {error && (
                    <div className="error-message">
                        <i className="fa fa-exclamation-circle"></i>
                        {error}
                    </div>
                )}

                {/* Q&A Management */}
                <div className="card" id="qa">
                    <div className="card-header">
                        <h2 className="card-title">
                            <i className="fa fa-comments"></i> Q&A Management
                        </h2>
                    </div>
                    <div className="card-body">
                        {/* Add New Q&A Form */}
                        <div className="form-section">
                            <h3 className="form-title">
                                <i className="fa fa-plus-circle"></i> Add New Q&A
                            </h3>
                            <div className="form-group">
                                <label className="form-label">Question</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder=""
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Answer</label>
                                <textarea
                                    className="form-control textarea-control"
                                    placeholder=""
                                    value={newAnswer}
                                    onChange={(e) => setNewAnswer(e.target.value)}
                                ></textarea>
                            </div>
                            <button onClick={handleAddQA} className="btn btn-primary">
                                <i className="fa fa-plus"></i> Add Q&A
                            </button>
                        </div>

                        {/* Q&A List */}
                        <h3 className="form-title">
                            <i className="fa fa-list"></i> Q&A List
                        </h3>
                        <ul className="qa-list">
                            {qaData.map((qa) => (
                                <li key={qa.id} className="qa-item">
                                    {editId === qa.id ? (
                                        <div className="edit-form">
                                            <div className="form-controls">
                                                <div className="form-group">
                                                    <label className="form-label">Question</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editQuestion}
                                                        onChange={(e) => setEditQuestion(e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Answer</label>
                                                    <textarea
                                                        className="form-control textarea-control"
                                                        value={editAnswer}
                                                        onChange={(e) => setEditAnswer(e.target.value)}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="edit-buttons">
                                                <button onClick={() => handleEditQA(qa.id)} className="btn btn-success btn-sm">
                                                    <i className="fa fa-save"></i> Save
                                                </button>
                                                <button onClick={() => setEditId(null)} className="btn btn-secondary btn-sm">
                                                    <i className="fa fa-times"></i> Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="question">
                                                <i className="fa fa-question-circle"></i> {qa.question}
                                            </div>
                                            <div className="answer">
                                                <i className="fa fa-info-circle"></i> {qa.answer}
                                            </div>
                                            <div className="qa-actions">
                                                <button 
                                                    onClick={() => {
                                                        setEditId(qa.id);
                                                        setEditQuestion(qa.question);
                                                        setEditAnswer(qa.answer);
                                                    }} 
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    <i className="fa fa-edit"></i> Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteQA(qa.id)} 
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    <i className="fa fa-trash"></i> Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                            {qaData.length === 0 && (
                                <div className="qa-item">No Q&A entries found. Add your first one!</div>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Feedback List */}
                <div className="card" id="feedback">
                    <div className="card-header">
                        <h2 className="card-title">
                            <i className="fa fa-comment"></i> User Feedback
                        </h2>
                    </div>
                    <div className="card-body">
                        <ul className="feedback-list">
                            {feedbackData.map((feedback) => (
                                <li key={feedback.id} className="feedback-item">
                                    <div className="feedback-header">
                                        <div className="feedback-user">
                                            <i className="fa fa-user"></i> {feedback.name}
                                        </div>
                                        <div className="feedback-date">
                                            {new Date().toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="feedback-message">
                                        {feedback.message}
                                    </div>
                                </li>
                            ))}
                            {feedbackData.length === 0 && (
                                <div className="feedback-item">No feedback entries yet.</div>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <footer className="dashboard-footer">
                    <p>&copy; {new Date().getFullYear()} College Chatbot Admin. All rights reserved.</p>
                </footer>
            </main>
        </div>
    );
};

export default Dashboard;