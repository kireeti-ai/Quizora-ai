import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Briefcase, GraduationCap, Hexagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Added for redirection
import './Auth.css';
import axios from 'axios';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [loading, setLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpMessage, setOtpMessage] = useState('');

  const navigate = useNavigate();
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      username: email,
      password: password,
      ...(!isLogin && { name, role, email }),
    };

    try {
      const endpoint = isLogin ? 'http://localhost:8080/login' : 'http://localhost:8080/register';
      const response = await axios.post(endpoint, payload);
      if (isLogin) {
        // Check if OTP is required
        if (response.data.otpRequired) {
          setOtpRequired(true);
          setOtpMessage(response.data.message || 'OTP sent to your email');
        } else {
          // Old flow compatibility - direct token
          const token = response.data;
          localStorage.setItem('token', token);
          const decodedToken = parseJwt(token);
          const userRole = decodedToken?.role;

          console.log("Logged in Role:", userRole);
          if (userRole === 'FACULTY') {
            navigate('/faculty/dashboard');
          } else {
            navigate('/student/dashboard');
          }
        }
      } else {
        alert("Registration Successful! Please login.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
      alert("Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/verify-otp', {
        email: email,
        otp: otp,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      const decodedToken = parseJwt(token);
      const userRole = decodedToken?.role;

      console.log("Logged in Role:", userRole);
      if (userRole === 'FACULTY') {
        navigate('/faculty/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-screen-container">

      {/* LEFT SIDE: Sharp Gradient & Branding */}
      <div className="left-panel">
        <div className="brand-header">
          <Hexagon size={32} className="brand-logo" strokeWidth={2.5} />
          <h1>Quizora - Ai </h1>
        </div>

        <div className="quote-container">
          <h2>"The beautiful thing about learning is that no one can take it away from you."</h2>
          <p>— B.B. King</p>
        </div>

        {/* Abstract Sharp Shapes */}
        <div className="sharp-shape shape-1"></div>
        <div className="sharp-shape shape-2"></div>
      </div>

      {/* RIGHT SIDE: Clean, Sharp Login */}
      <div className="right-panel">
        <div className="auth-box">
          <div className="auth-header">
            <h2>{otpRequired ? 'Verify OTP' : (isLogin ? 'Welcome back.' : 'Join the platform.')}</h2>
            <p className="sub-text">
              {otpRequired 
                ? otpMessage 
                : (isLogin ? 'Enter your credentials to access your account.' : 'Start your journey with us today.')}
            </p>
          </div>

          {otpRequired ? (
            <form className="auth-form" onSubmit={handleOtpSubmit}>
              <div className="input-group">
                <label>Enter OTP</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type="text"
                    placeholder="6-digit OTP"
                    className="input-field"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                <span>{loading ? 'Verifying...' : 'Verify OTP'}</span>
                {!loading && <ArrowRight size={18} />}
              </button>

              <div className="auth-footer">
                <button 
                  type="button"
                  onClick={() => {
                    setOtpRequired(false);
                    setOtp('');
                    setOtpMessage('');
                  }} 
                  className="link-btn"
                >
                  Back to login
                </button>
              </div>
            </form>
          ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="role-selector">
                <div
                  className={`role-option ${role === 'STUDENT' ? 'active' : ''}`}
                  onClick={() => setRole('STUDENT')}
                >
                  <GraduationCap size={16} />
                  <span>Student</span>
                </div>
                <div
                  className={`role-option ${role === 'FACULTY' ? 'active' : ''}`}
                  onClick={() => setRole('FACULTY')}
                >
                  <Briefcase size={16} />
                  <span>Faculty</span>
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
          )}

          {!otpRequired && (
          <div className="auth-footer">
            <span>{isLogin ? "New here?" : "Member already?"}</span>
            <button onClick={() => setIsLogin(!isLogin)} className="link-btn">
              {isLogin ? 'Create an account' : 'Log in'}
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;