import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  console.log('Método recebido:', req.method);
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID da solicitação não informado.' });
  }

  if (req.method === 'GET') {
    try {
      const { data: solicitacao, error } = await supabase
        .from('solicitacoes')
        .select('*, cliente:cliente_id(nome), categoria:categoria_id(nome)')
        .eq('id', id)
        .single();

      if (error) {
        return res.status(404).json({ error: 'Solicitação não encontrada.' });
      }

      return res.status(200).json(solicitacao);
    } catch (err) {
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  } else if (req.method === 'PUT' || (req.method === 'POST' && req.body && req.body._method === 'PUT')) {
    const { titulo, categoria_id, prioridade, cliente_id, status, dataEntrega, descricao } = req.body;

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

      // Se o status for 'concluida', adiciona data_conclusao
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
  } else if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('solicitacoes')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ message: 'Solicitação excluída com sucesso.' });
    } catch (err) {
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
} 