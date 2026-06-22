import { useParams, useNavigate } from 'react-router-dom';
import { books } from '../data/bibleData';
import { ArrowLeft } from 'lucide-react';

export default function ChaptersPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return <div style={{ padding: '2rem' }}>Book not found</div>;
  }

  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

  return (
    <div style={{ padding: '1rem 1rem 5rem 1rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', marginTop: '1rem', gap: '1rem' }}>
        <button 
          onClick={() => navigate('/')}
          className="animated-btn"
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '8px' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{book.name}</h1>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', 
        gap: '12px' 
      }}>
        {chapters.map(chapter => (
          <button
            key={chapter}
            onClick={() => navigate(`/read/${book.id}/${chapter}`)}
            className="animated-btn glass-panel"
            style={{
              aspectRatio: '1',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '1.2rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {chapter}
          </button>
        ))}
      </div>
    </div>
  );
}
