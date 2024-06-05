import './assets/styles/App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ManageMeetingsPage from './pages/ManageMeetingsPage';
import MeetingSchedulePage from './pages/MeetingSchedulePage';
import SignUp from './pages/Signup';
import "@fontsource/roboto";
import VideoCall from './pages/VideoCall';
import RecordingPage from './pages/RecordingPage';
import SettingsPage from './pages/SettingsPage';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import withRole from './components/withRole';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  const commonProps = { authenticated, userRole };

  return (
    <div className="App">
      <header className="App-header">
        <div>
         <Router>
            <Sidebar authenticated={authenticated} setAuthenticated={setAuthenticated} userRole={userRole} />
              <Routes>
                <Route path="/" element={<Login setAuthenticated={setAuthenticated} setUserRole={setUserRole} />} />
                <Route 
                  path="/dashboard" 
                  element={authenticated ? <Dashboard /> : <Navigate to="/" />} 
                />
                <Route 
                  path="/schedule-meeting" 
                  element={withRole(MeetingSchedulePage, ['worker', 'admin'])(commonProps)} 
                />
                <Route 
                  path="/manage-meetings" 
                  element={withRole(ManageMeetingsPage, ['worker', 'admin'])(commonProps)} 
                />
                <Route 
                  path="/video-call" 
                  element={authenticated ? <VideoCall /> : <Navigate to="/" />} 
                />
                <Route 
                  path="/recordings" 
                  element={withRole(RecordingPage, ['worker', 'admin'])(commonProps)} 
                />
                <Route 
                  path="/settings" 
                  element={authenticated ? <SettingsPage /> : <Navigate to="/" />} 
                />
                <Route 
                  path="/unauthorized" 
                  element={<div>Unauthorized Access</div>} 
                />
              </Routes>
          </Router>
        </div>
      </header>
    </div>
  );
}

export default App;
