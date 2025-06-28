import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }
  const { userId, senhaAtual, novaSenha } = req.body;

  // Busca o usuário pelo ID para obter o hash da senha atual
  const { data: user, error: errorUser } = await supabase
    .from('profiles')
    .select('senha_hash')
    .eq('id', userId)
    .single();

  if (errorUser) {
    return res.status(400).json({ error: 'Erro ao buscar usuário.' });
  }
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  // Compara a senha atual fornecida com o hash salvo
  const isMatch = await bcrypt.compare(senhaAtual, user.senha_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Senha atual incorreta.' });
  }

  // Gera novo hash para a nova senha
  const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

  // Atualiza a senha_hash no banco
  const { data: updateData, error: updateError } = await supabase
    .from('profiles')
    .update({ senha_hash: novaSenhaHash })
    .eq('id', userId)
    .select();

  if (updateError) {
    return res.status(400).json({ error: updateError.message });
  }

  if (!updateData || updateData.length === 0) {
    return res.status(400).json({ error: 'Nenhum registro foi atualizado. Verifique o ID do usuário.' });
  }

  return res.status(200).json({ message: 'Senha alterada com sucesso!' });
} 