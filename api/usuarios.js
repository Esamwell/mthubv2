import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nome, email, user_type');
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ usuarios: data });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
} 