import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data: solicitacoes, error } = await supabase
        .from('solicitacoes')
        .select('*, cliente:cliente_id(nome), categoria:categoria_id(nome)');
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(solicitacoes);
    } catch (err) {
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  } else if (req.method === 'POST') {
    const { titulo, categoria_id, prioridade, cliente_id, status, dataEntrega, descricao } = req.body;
    try {
      const { data, error } = await supabase
        .from('solicitacoes')
        .insert({
          titulo,
          categoria_id,
          prioridade,
          cliente_id,
          status,
          data_prazo: dataEntrega || null,
          descricao,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
} 