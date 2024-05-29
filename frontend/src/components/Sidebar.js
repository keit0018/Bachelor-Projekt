import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/Sidebar.css'

const Sidebar = ({ authenticated, setAuthenticated }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    setAuthenticated(false);
    navigate('/');
  };

  return (
    <nav>
      {authenticated && ( <div className="sidebar">
          <div className="sidebar-content">
            <h2>Menu</h2>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/schedule-meeting">Schedule Meeting</Link></li>
              <li><Link to="/manage-meetings">Manage Meetings</Link></li>
              <li><Link to="/video-call">Video Call</Link></li>
              <li><Link to="/recordings">Recordings</Link></li>
              <li><Link to="/settings">Settings</Link></li>
              <button onClick={handleLogout}>Logout</button>
            </ul>
          </div>
        </div>)}
    </nav>
    
  )
}

export default Sidebar