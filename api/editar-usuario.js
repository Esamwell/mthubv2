import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'ID não informado.' });
  const { nome, email, empresa, telefone, status, user_type } = req.body;
  const { data, error } = await supabase
    .from('profiles')
    .update({ nome, email, empresa, telefone, status, user_type })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ user: data });
} 