import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }
  const { status } = req.query;
  if (!status) {
    res.status(400).json({ error: 'Status não informado.' });
    return;
  }
  try {
    const { count } = await supabase.from('solicitacoes').select('*', { count: 'exact', head: true }).eq('status', status);
    res.json({ count: count || 0 });
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar contagem de solicitações com status ${status}.` });
  }
} 