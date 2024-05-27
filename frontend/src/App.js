
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

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <VideoCall/>
        </div>

      </header>
    </div>
  );
}

export default App;
