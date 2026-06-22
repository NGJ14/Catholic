import { useState } from 'react';
import { Moon, Sun, BookOpen, Database } from 'lucide-react';

export default function SettingsPage() {
  const [theme, setTheme] = useState(localStorage.getItem('bible-theme') || 'dark');

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('bible-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div style={{ padding: '1rem 1rem 5rem 1rem' }}>
      <header style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Settings</h1>
      </header>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Appearance</h2>
        <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <button 
            onClick={() => updateTheme('dark')}
            className="animated-btn"
            style={{ 
              width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'none', border: 'none', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Moon size={20} color={theme === 'dark' ? 'var(--accent-gold)' : 'var(--text-muted)'} />
              <span style={{ fontSize: '1.1rem' }}>Dark Mode</span>
            </div>
            {theme === 'dark' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-gold)' }} />}
          </button>
          
          <button 
            onClick={() => updateTheme('light')}
            className="animated-btn"
            style={{ 
              width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'none', border: 'none', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sun size={20} color={theme === 'light' ? 'var(--accent-gold)' : 'var(--text-muted)'} />
              <span style={{ fontSize: '1.1rem' }}>Light Mode</span>
            </div>
            {theme === 'light' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-gold)' }} />}
          </button>

          <button 
            onClick={() => updateTheme('sepia')}
            className="animated-btn"
            style={{ 
              width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BookOpen size={20} color={theme === 'sepia' ? 'var(--accent-gold)' : 'var(--text-muted)'} />
              <span style={{ fontSize: '1.1rem' }}>Sepia</span>
            </div>
            {theme === 'sepia' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-gold)' }} />}
          </button>
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Data Source</h2>
        <div className="glass-panel" style={{ borderRadius: '16px', padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <Database size={24} color="var(--accent-gold)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>NRSV Bible Text</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem', fontSize: '0.95rem' }}>
            The New Revised Standard Version (NRSV) Catholic Edition text has been successfully imported from your PDF and is fully integrated into the app. You can now read the entire Bible completely offline!
          </p>
        </div>
      </section>
    </div>
  );
}
