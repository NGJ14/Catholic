import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Book, Compass, Settings as SettingsIcon } from 'lucide-react';
import BooksPage from './pages/BooksPage';
import ChaptersPage from './pages/ChaptersPage';
import ReaderPage from './pages/ReaderPage';
import SettingsPage from './pages/SettingsPage';
import { useEffect } from 'react';

// Bottom Navigation Bar
const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <Book size={24} />, label: 'Read' },
    { path: '/explore', icon: <Compass size={24} />, label: 'Explore' },
    { path: '/settings', icon: <SettingsIcon size={24} />, label: 'Settings' }
  ];

  return (
    <div className="glass-panel" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'var(--nav-height)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 50
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path === '/' && location.pathname.startsWith('/read'));
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="animated-btn"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            {item.icon}
            <span style={{ fontSize: '0.65rem', fontWeight: 500 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// Main App component
function App() {
  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('bible-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <Router>
      <div className="content-area">
        <Routes>
          <Route path="/" element={<BooksPage />} />
          <Route path="/book/:bookId" element={<ChaptersPage />} />
          <Route path="/read/:bookId/:chapter" element={<ReaderPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Explore is a placeholder for future features */}
          <Route path="/explore" element={<div style={{padding: '2rem', textAlign:'center'}}><h2>Explore</h2><p style={{color:'var(--text-muted)'}}>Daily verses and plans coming soon.</p></div>} />
        </Routes>
      </div>
      <BottomNav />
    </Router>
  );
}

export default App;
