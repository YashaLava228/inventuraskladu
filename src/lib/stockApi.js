import { supabase } from './supabase';

function db() {
  if (!supabase) throw new Error('Supabase is not configured');
  return supabase;
}

export async function loadProducts() {
  const { data, error } = await db().from('products').select('*').order('name');
  if (error) throw error;
  return data.map(row => ({
    id: row.id, name: row.name, barcode: row.barcode,
    category: row.category, weight: row.weight,
    unit: row.unit, quantity: row.quantity,
    minLimit: row.min_limit
  }));
}

export async function adjustStock(productId, delta) {
  if (!Number.isSafeInteger(delta) || delta === 0) {
    throw new Error('Quantity change must be a nonzero integer');
  }
  const { data, error } = await db().rpc('adjust_stock', {
    p_product_id: productId,
    p_delta: delta
  });
  if (error) throw error;
  return data?.[0];
}

// Pass the quantity the person saw when they entered a new number.
// If another worker changed it, the database rejects the stale overwrite.
export async function setStockQuantity(productId, newQuantity, expectedQuantity) {
  if (![newQuantity, expectedQuantity].every(Number.isSafeInteger) || newQuantity < 0) {
    throw new Error('Quantity must be a nonnegative integer');
  }
  const { data, error } = await db().rpc('set_stock_quantity', {
    p_product_id: productId,
    p_new_quantity: newQuantity,
    p_expected_quantity: expectedQuantity
  });
  if (error) throw error;
  return data?.[0];
}

export async function signIn(email, password) {
  const { data, error } = await db().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}
