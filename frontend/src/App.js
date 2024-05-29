
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
import { useState } from 'react';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <div>
         <Router>
            <Sidebar authenticated={authenticated} setAuthenticated={setAuthenticated} />
              <Routes>
                <Route path="/" element={<Login setAuthenticated={setAuthenticated} />} />
                <Route 
                  path="/dashboard" 
                  element={authenticated ? <Dashboard /> : <Navigate to="/" />} 
                />
                <Route path="/schedule-meeting" 
                element={authenticated ? <MeetingSchedulePage /> : <Navigate to="/" />} />
                <Route path="/manage-meetings" 
                element={authenticated ? <ManageMeetingsPage /> : <Navigate to="/" />} />
                <Route path="/video-call" element={authenticated ? <VideoCall /> : <Navigate to="/" />} />
                <Route path="/recordings" element={authenticated ? <RecordingPage /> : <Navigate to="/" />} />
                <Route path="/settings" element={authenticated ? <SettingsPage /> : <Navigate to="/" />} />
              </Routes>
          </Router>
        </div>

      </header>
    </div>
  );
}

export default App;
