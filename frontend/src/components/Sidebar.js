import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/Sidebar.css';
import VideocamIcon from '@mui/icons-material/Videocam';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SettingsIcon from '@mui/icons-material/Settings';

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
              <li>          
                <Link to="/dashboard">
                  <DashboardIcon className='icon'/>
                  <span className="linkText">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/schedule-meeting">
                  <EditCalendarIcon className='icon'/>
                  <span className="linkText">Schedule Meeting</span>
                </Link>
              </li>
              <li>
                <Link to="/manage-meetings">
                  <CalendarMonthIcon className='icon'/>
                  <span className="linkText">Manage Meetings</span>
                  </Link></li>
              <li>
                <Link className='linkText' to="/video-call">
                    <VideocamIcon className='icon'/>
                    <span className="linkText">Video Call</span>
                </Link>
              </li>
              <li>
                <Link to="/recordings">
                  <VideoLibraryIcon className='icon'/>
                  <span className="linkText">Recordings</span>
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <SettingsIcon className='icon'/>
                  <span className="linkText">Settings</span>
                </Link>
              </li>
              <button className="logout-button" onClick={handleLogout}>
              <span className="linkText">Logout</span>
              </button>
            </ul>
          </div>
        </div>)}
    </nav>
    
  )
}

export default Sidebar