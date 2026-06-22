import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { books, getChapterText, type Verse } from '../data/bibleData';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReaderPage() {
  const { bookId, chapter } = useParams<{ bookId: string, chapter: string }>();
  const navigate = useNavigate();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);

  const book = books.find(b => b.id === bookId);
  const chapterNum = parseInt(chapter || '1');

  useEffect(() => {
    if (bookId && chapterNum) {
      setLoading(true);
      getChapterText(bookId, chapterNum).then(data => {
        setVerses(data);
        setLoading(false);
      });
      window.scrollTo(0, 0);
    }
  }, [bookId, chapterNum]);

  if (!book) return <div>Book not found</div>;

  const navigateChapter = (dir: 1 | -1) => {
    const nextChapter = chapterNum + dir;
    if (nextChapter > 0 && nextChapter <= book.chapters) {
      navigate(`/read/${book.id}/${nextChapter}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '5rem' }}>
      <header className="glass-panel" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => navigate(`/book/${book.id}`)}
            className="animated-btn"
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600 }}>{book.name} {chapterNum}</h1>
        </div>
      </header>

      <main style={{ padding: '1.5rem', flex: 1, maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-gold)', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div className="reader-text">
            {verses.map((v) => (
              <div key={v.verse} style={{ marginBottom: '0.75em', lineHeight: '1.6' }}>
                <span className="verse-num">{v.verse}</span>
                {v.text}
              </div>
            ))}
          </div>
        )}
      </main>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '1rem 1.5rem',
        marginTop: 'auto'
      }}>
        <button 
          onClick={() => navigateChapter(-1)}
          disabled={chapterNum === 1}
          className="animated-btn"
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', color: chapterNum === 1 ? 'var(--text-muted)' : 'var(--accent-gold)', cursor: chapterNum === 1 ? 'default' : 'pointer', fontWeight: 500 
          }}
        >
          <ChevronLeft size={20} /> Previous
        </button>
        
        <button 
          onClick={() => navigateChapter(1)}
          disabled={chapterNum === book.chapters}
          className="animated-btn"
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', color: chapterNum === book.chapters ? 'var(--text-muted)' : 'var(--accent-gold)', cursor: chapterNum === book.chapters ? 'default' : 'pointer', fontWeight: 500 
          }}
        >
          Next <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
