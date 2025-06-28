import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Listar usuários
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, email, user_type');
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ usuarios: data });
    } catch (err) {
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  } else if (req.method === 'POST') {
    // Cadastrar usuário
    const { nome, email, empresa, telefone, senha, user_type } = req.body;
    // Verifica se já existe usuário com esse email
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    if (existing) return res.status(400).json({ error: 'Email já cadastrado.' });
    // Gera hash da senha
    const senha_hash = await bcrypt.hash(senha, 10);
    // Gera um UUID para o novo usuário
    const newUserId = uuidv4();
    // Insere no profiles
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: newUserId,
        nome,
        email,
        empresa,
        telefone,
        senha_hash,
        user_type: user_type || 'cliente'
      })
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ user: data });
  } else if (req.method === 'PUT') {
    // Editar usuário
    const { id, nome, email, empresa, telefone, status, user_type } = req.body;
    if (!id) return res.status(400).json({ error: 'ID não informado.' });
    const { data, error } = await supabase
      .from('profiles')
      .update({ nome, email, empresa, telefone, status, user_type })
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ user: data });
  } else if (req.method === 'DELETE') {
    // Excluir usuário
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID não informado.' });
    const { error, data } = await supabase.from('profiles').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message, details: error });
    return res.status(200).json({ success: true, data });
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
} 