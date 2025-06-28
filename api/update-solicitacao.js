import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { id, titulo, categoria_id, prioridade, cliente_id, status, dataEntrega, descricao } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID da solicitação não informado.' });
  }

  try {
    const updateData = {
      titulo,
      categoria_id,
      prioridade,
      cliente_id,
      status,
      data_prazo: dataEntrega || null,
      descricao,
      updated_at: new Date().toISOString(),
    };

    if (status === 'concluida') {
      updateData.data_conclusao = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('solicitacoes')
      .update(updateData)
      .eq('id', id)
      .select('*, cliente:cliente_id(nome), categoria:categoria_id(nome)')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
} 