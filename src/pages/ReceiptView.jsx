import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, FilePlus2 } from 'lucide-react';
import { getReceipt, deleteReceipt } from '../lib/receipts.js';
import { exportPDF, exportThermal, exportExcel, exportCSV, exportPNG } from '../lib/exporters.js';
import ReceiptPreview from '../components/ReceiptPreview.jsx';

export default function ReceiptView() {
  const { id } = useParams();
  const nav = useNavigate();
  const previewRef = useRef(null);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await getReceipt(id);
      setReceipt(data);
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (!receipt) return;
    window.__xquoteViewProps = {
      onPrint: () => window.print(),
      onExport: () => {
        const which = prompt('Export as: pdf / thermal / excel / csv / png', 'pdf');
        if (!which) return;
        const k = which.toLowerCase();
        if (k === 'pdf')     exportPDF(receipt);
        if (k === 'thermal') exportThermal(receipt);
        if (k === 'excel')   exportExcel(receipt);
        if (k === 'csv')     exportCSV(receipt);
        if (k === 'png')     exportPNG(previewRef.current, receipt.receipt_no);
      },
    };
    return () => { delete window.__xquoteViewProps; };
  }, [receipt]);

  const remove = async () => {
    if (!confirm(`Delete ${receipt.receipt_no}? This cannot be undone.`)) return;
    const { error } = await deleteReceipt(receipt.id);
    if (error) return alert(error.message);
    nav('/history');
  };

  if (loading) return <div style={{ padding: 30, textAlign: 'center' }} className="muted">Loading…</div>;
  if (!receipt) return <div style={{ padding: 30, textAlign: 'center' }} className="muted">Receipt not found</div>;

  return (
    <div className="page-enter" style={{ padding: 16, paddingBottom: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <button onClick={() => nav(-1)} className="neu-btn" style={{ padding: 10, borderRadius: 10 }}>
          <ArrowLeft size={16} style={{ color: '#7A8499' }} />
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={remove} className="neu-btn" style={{ padding: 10, borderRadius: 10, color: '#DC2626' }}><Trash2 size={16} /></button>
        </div>
      </div>

      <div ref={previewRef}><ReceiptPreview receipt={receipt} /></div>

      <Link to="/new" className="neu-btn"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, marginTop: 20, borderRadius: 14, color: '#2B3244', fontWeight: 700, textDecoration: 'none' }}>
        <FilePlus2 size={16} /> New receipt
      </Link>
    </div>
  );
}
