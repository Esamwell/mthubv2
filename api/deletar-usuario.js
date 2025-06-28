import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'ID não informado.' });
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ success: true });
} 