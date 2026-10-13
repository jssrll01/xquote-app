import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Receipt, DollarSign, Clock, CheckCircle2, Plus } from 'lucide-react';
import { listReceipts } from '../lib/receipts.js';

export default function Dashboard() {
  const nav = useNavigate();
  const [stats, setStats] = useState({ total: 0, revenue: 0, unpaid: 0, paid: 0 });
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await listReceipts();
      const arr = data || [];
      setStats({
        total: arr.length,
        revenue: arr.filter(r => r.status === 'paid').reduce((s, r) => s + (Number(r.total) || 0), 0),
        unpaid: arr.filter(r => r.status !== 'paid').length,
        paid:   arr.filter(r => r.status === 'paid').length,
      });
      setRecent(arr.slice(0, 3));
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: 'Total receipts', value: stats.total,    icon: Receipt,      color: '#8B5CF6' },
    { label: 'Paid',           value: stats.paid,     icon: CheckCircle2, color: '#10B981' },
    { label: 'Unpaid/pending', value: stats.unpaid,   icon: Clock,        color: '#F59E0B' },
    { label: 'Revenue (paid)', value: '₱' + stats.revenue.toLocaleString(), icon: DollarSign, color: '#3B82F6' },
  ];

  return (
    <div className="page-enter" style={{ padding: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Dashboard</h2>
      <p className="muted" style={{ fontSize: 13, marginBottom: 20 }}>Receipts overview</p>

      <button onClick={() => nav('/new')} className="neu-btn-primary"
        style={{ width: '100%', padding: 16, marginBottom: 20, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14 }}>
        <Plus size={18} /> New receipt
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="neu-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div className="neu-card" style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="muted" style={{ fontSize: 11, fontWeight: 800, letterSpacing: .3 }}>
                {label.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{loading ? '…' : value}</div>
          </div>
        ))}
      </div>

      {recent.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>Recent</div>
            <Link to="/history" className="muted" style={{ fontSize: 12, fontWeight: 700 }}>See all</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recent.map(r => (
              <Link key={r.id} to={`/receipt/${r.id}`} className="neu-card"
                style={{ padding: 14, color: 'inherit', display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{r.receipt_no}</span>
                  <span className="neu-badge" style={{ background: '#EEF1F6', color: '#6366F1' }}>
                    {r.status?.toUpperCase()}
                  </span>
                </div>
                <div className="muted" style={{ fontSize: 12 }}>
                  {r.customer_name} · {new Date(r.created_at).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
