import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Trash2, PlusCircle } from 'lucide-react';
import { listReceipts, deleteReceipt } from '../lib/receipts.js';

export default function History() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await listReceipts();
    setRows(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id, no) => {
    if (!confirm(`Delete receipt ${no}? Cannot be undone.`)) return;
    const { error } = await deleteReceipt(id);
    if (error) return alert(error.message);
    load();
  };

  const filtered = rows.filter(r => {
    if (!q.trim()) return true;
    const t = q.trim().toLowerCase();
    return [r.receipt_no, r.customer_name, r.customer_email, r.status]
      .filter(Boolean).join(' ').toLowerCase().includes(t);
  });

  return (
    <div className="page-enter" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>History</h2>
        <Link to="/new" className="neu-btn-primary"
          style={{ padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, borderRadius: 12 }}>
          <PlusCircle size={14} /> New
        </Link>
      </div>
      <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
        {loading ? 'Loading…' : (rows.length + ' receipt' + (rows.length === 1 ? '' : 's'))}
      </p>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: 15, color: '#97A0B5' }} />
        <input type="text" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search receipt no, customer…"
          className="neu-input" style={{ paddingLeft: 40 }} />
      </div>

      {!loading && !filtered.length && (
        <div className="neu-card" style={{ padding: 30, textAlign: 'center' }}>
          <FileText size={30} style={{ color: '#97A0B5', marginBottom: 8 }} />
          <div className="muted" style={{ fontSize: 13 }}>No receipts yet</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(r => (
          <div key={r.id} className="neu-card" style={{ padding: 14 }}>
            <Link to={`/receipt/${r.id}`} style={{ color: 'inherit', display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13.5, fontWeight: 800 }}>{r.receipt_no}</span>
                <span className="neu-badge" style={{ background: '#EEF1F6', color: '#6366F1' }}>
                  {r.status?.toUpperCase()}
                </span>
              </div>
              <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
                {r.customer_name} · {r.customer_email}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span className="muted">{new Date(r.created_at).toLocaleString()}</span>
                <span style={{ fontWeight: 800 }}>
                  {r.currency === 'USD' ? '$' : '₱'}{Number(r.total).toLocaleString()}
                </span>
              </div>
            </Link>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <Link to={`/receipt/${r.id}`} className="neu-btn"
                style={{ flex: 1, padding: 10, textAlign: 'center', fontSize: 12.5, textDecoration: 'none', color: '#2B3244' }}>
                Open
              </Link>
              <button onClick={() => remove(r.id, r.receipt_no)} className="neu-btn"
                style={{ padding: '10px 14px', color: '#DC2626' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
