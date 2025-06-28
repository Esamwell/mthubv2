import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }
  const { id } = req.body;
  console.log('ID recebido para exclusão:', id);
  if (!id) return res.status(400).json({ error: 'ID não informado.' });
  const { error, data } = await supabase.from('profiles').delete().eq('id', id);
  console.log('Resultado da exclusão:', { error, data });
  if (error) return res.status(400).json({ error: error.message, details: error });
  return res.status(200).json({ success: true, data });
} 