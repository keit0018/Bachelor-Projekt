import './assets/styles/App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ManageMeetingsPage from './pages/ManageMeetingsPage';
import MeetingSchedulePage from './pages/MeetingSchedulePage';
import "@fontsource/roboto";
import VideoCallPage from './pages/VideoCallPage';
import RecordingPage from './pages/RecordingPage';
import SettingsPage from './pages/SettingsPage';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import withRole from './components/withRole';

//application
function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [communicationUserId,setCommunicationUserId] = useState('');

  const commonProps = { authenticated, userRole, communicationUserId };

  return (
    <div className="App">
      <header className="App-header">
        <div>
         <Router>
            <Sidebar authenticated={authenticated} setAuthenticated={setAuthenticated} userRole={userRole} />
              <Routes>
                <Route path="/" element={<Login setAuthenticated={setAuthenticated} 
                                                setUserRole={setUserRole} 
                                                setCommunicationUserId={setCommunicationUserId} />} />
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
                  path="/video-call/:meetingId" 
                  element={authenticated ? <VideoCallPage  /> : <Navigate to="/" />} 
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
