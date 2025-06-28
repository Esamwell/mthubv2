import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }
  try {
    const { data: solicitacoes, error } = await supabase
      .from('solicitacoes')
      .select('*, cliente:cliente_id(nome), categoria:categoria_id(nome)')
      .order('created_at', { ascending: false })
      .limit(5);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(solicitacoes);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
} 