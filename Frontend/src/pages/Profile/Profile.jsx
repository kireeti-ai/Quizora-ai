import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, QrCode, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchQrCode();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      alert('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchQrCode = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/user/qr-code', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQrCode(response.data.qrCode);
    } catch (error) {
      console.error('Failed to fetch QR code:', error);
    }
  };

  const handleBack = () => {
    const role = profile?.role;
    if (role === 'FACULTY') {
      navigate('/faculty/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <h1>{profile?.name || 'User'}</h1>
          <span className="role-badge">{profile?.role || 'STUDENT'}</span>
        </div>

        <div className="profile-info">
          <div className="info-section">
            <h2>Personal Information</h2>
            
            <div className="info-item">
              <div className="info-icon">
                <User size={20} />
              </div>
              <div className="info-content">
                <label>Full Name</label>
                <p>{profile?.name || 'N/A'}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <Mail size={20} />
              </div>
              <div className="info-content">
                <label>Email Address</label>
                <p>{profile?.email || profile?.username || 'N/A'}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <Shield size={20} />
              </div>
              <div className="info-content">
                <label>User ID</label>
                <p>{profile?.id || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="qr-section">
            <h2>
              <QrCode size={24} />
              Your QR Code
            </h2>
            <p className="qr-description">
              This QR code contains your unique user ID for verification purposes.
            </p>
            {qrCode ? (
              <div className="qr-code-wrapper">
                <img
                  src={`data:image/png;base64,${qrCode}`}
                  alt="User QR Code"
                  className="qr-code-image"
                />
              </div>
            ) : (
              <div className="qr-code-placeholder">
                <QrCode size={48} />
                <p>QR Code not available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
