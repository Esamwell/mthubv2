import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }
  try {
    const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'cliente');
    res.json({ count: count || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar contagem de clientes.' });
  }
} 