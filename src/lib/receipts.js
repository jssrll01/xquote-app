import { supabase } from './supabase.js';

/**
 * Generate the next receipt number: XM-YYYYMMDD-0001
 * Uses the settings table counter (xquote_last_receipt_no).
 */
export async function nextReceiptNo() {
  // read current counter
  const { data: s } = await supabase
    .from('settings')
    .select('*')
    .eq('key', 'xquote_last_receipt_no')
    .maybeSingle();

  const current = Number(s?.value || 0) + 1;
  const date = new Date();
  const ymd = date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');

  // Bump counter (fire and forget; will be confirmed on insert unique constraint anyway)
  await supabase.from('settings').upsert(
    { key: 'xquote_last_receipt_no', value: String(current) },
    { onConflict: 'key' }
  );

  return `XM-${ymd}-${String(current).padStart(4, '0')}`;
}

export async function saveReceipt(row) {
  const { data, error } = await supabase
    .from('xquote_receipts')
    .insert({ ...row, updated_at: new Date().toISOString() })
    .select()
    .single();
  return { data, error };
}

export async function listReceipts() {
  const { data, error } = await supabase
    .from('xquote_receipts')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data || [], error };
}

export async function getReceipt(id) {
  const { data, error } = await supabase
    .from('xquote_receipts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  return { data, error };
}

export async function deleteReceipt(id) {
  const { error } = await supabase.from('xquote_receipts').delete().eq('id', id);
  return { error };
}

/**
 * Compute totals from a draft.
 * items: [{ name, quantity, price }]
 * discountType: 'percent' | 'fixed'
 */
export function computeTotals({ items, taxRate, discountType, discountValue, currency }) {
  const subtotal = items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0);
  const taxAmount = subtotal * (Number(taxRate) || 0) / 100;

  let discountAmount = 0;
  if (discountType === 'percent') {
    discountAmount = (subtotal + taxAmount) * (Number(discountValue) || 0) / 100;
  } else {
    discountAmount = Number(discountValue) || 0;
  }

  const total = Math.max(0, subtotal + taxAmount - discountAmount);
  return { subtotal, taxAmount, discountAmount, total };
}
