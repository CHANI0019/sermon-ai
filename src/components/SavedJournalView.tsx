import React from 'react';
import { SavedJournalItem } from '../types';
import { Bookmark, Trash2, Copy, Check, BookOpen, HeartHandshake } from 'lucide-react';

interface SavedJournalViewProps {
  savedItems: SavedJournalItem[];
  onDeleteItem: (id: string) => void;
}

export const SavedJournalView: React.FC<SavedJournalViewProps> = ({ savedItems, onDeleteItem }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (item: SavedJournalItem) => {
    navigator.clipboard.writeText(`${item.title}\n\n${item.content}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderLeft: '4px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xs)' }}>
          <Bookmark size={24} color="var(--color-primary)" />
          <h2 className="serif-text gold-gradient-text" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            📚 Saved Journal: 나의 묵상 저널 & 설교 보관함
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          LOGOS에서 작성한 설교 구상 및 목회 상담 묵상 기록을 보관하고 복습합니다.
        </p>
      </div>

      {savedItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
          <Bookmark size={40} color="var(--color-text-muted)" style={{ marginBottom: 'var(--space-md)', opacity: 0.5 }} />
          <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>
            아직 저장된 묵상 저널이나 설교 기록이 없습니다.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', marginTop: 4 }}>
            설교 생성기나 목회 상담 대화에서 '저널에 저장' 버튼을 눌러보세요.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {savedItems.map((item) => (
            <div key={item.id} className="glass-panel animate-fade-in" style={{ padding: 'var(--space-lg)', borderLeft: item.type === 'sermon' ? '3px solid var(--color-primary)' : '3px solid var(--color-accent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                  {item.type === 'sermon' ? (
                    <span style={{ fontSize: '0.75rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <BookOpen size={12} /> 설교 구상
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', background: 'var(--color-accent-light)', color: 'var(--color-accent)', padding: '2px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <HeartHandshake size={12} /> 목회 상담
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.createdAt}</span>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                  <button onClick={() => handleCopy(item)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', minHeight: 30 }}>
                    {copiedId === item.id ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
                    {copiedId === item.id ? '복사됨' : '복사'}
                  </button>
                  <button onClick={() => onDeleteItem(item.id)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', minHeight: 30, color: 'var(--color-danger)' }}>
                    <Trash2 size={14} /> 삭제
                  </button>
                </div>
              </div>

              <h3 className="serif-text" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: 'var(--space-sm)' }}>
                {item.title}
              </h3>

              <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', whiteSpace: 'pre-line', fontSize: '0.875rem', color: 'var(--color-text-sub)', lineHeight: 1.6, maxHeight: 300, overflowY: 'auto' }}>
                {item.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
