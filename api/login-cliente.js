import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }
  const { email, senha } = req.body;
  const { data: user, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (!user) return res.status(400).json({ error: 'Usuário não encontrado.' });

  const ok = await bcrypt.compare(senha, user.senha_hash);
  if (!ok) return res.status(401).json({ error: 'Senha incorreta.' });

  return res.status(200).json({ user });
} 