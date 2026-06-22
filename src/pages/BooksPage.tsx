import { useNavigate } from 'react-router-dom';
import { books } from '../data/bibleData';
import { Search } from 'lucide-react';

export default function BooksPage() {
  const navigate = useNavigate();

  const otBooks = books.filter(b => b.testament === 'OT');
  const ntBooks = books.filter(b => b.testament === 'NT');

  const BookList = ({ title, list }: { title: string, list: typeof books }) => (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>{title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
        {list.map(book => (
          <button
            key={book.id}
            onClick={() => navigate(`/book/${book.id}`)}
            className="animated-btn glass-panel"
            style={{
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <span style={{ fontWeight: 500 }}>{book.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{book.chapters} Chapters</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '1rem 1rem 5rem 1rem' }}>
      <header style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Bible</h1>
        <p style={{ color: 'var(--text-secondary)' }}>NRSV Catholic Edition</p>
      </header>

      <div className="glass-panel" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        gap: '10px'
      }}>
        <Search size={20} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search books..." 
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            outline: 'none',
            width: '100%',
            fontSize: '1rem'
          }}
        />
      </div>

      <BookList title="Old Testament" list={otBooks} />
      <BookList title="New Testament" list={ntBooks} />
    </div>
  );
}
