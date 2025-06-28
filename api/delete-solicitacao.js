import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID da solicitação não informado.' });
  }

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
} 