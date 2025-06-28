const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Cadastro de usuário
app.post('/cadastrar-usuario', async (req, res) => {
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
});

// Login de cliente
app.post('/login-cliente', async (req, res) => {
  const { email, senha } = req.body;
  const { data: user, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  console.log('Tentando login:', email, 'Encontrado:', !!user, 'Erro:', error);

  if (!user) return res.status(400).json({ error: 'Usuário não encontrado.' });

  const ok = await bcrypt.compare(senha, user.senha_hash);
  if (!ok) return res.status(401).json({ error: 'Senha incorreta.' });

  // Aqui você pode gerar um JWT próprio, se desejar
  return res.status(200).json({ user });
});

// Deletar usuário
app.delete('/deletar-usuario/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ success: true });
});

// Editar usuário
app.put('/editar-usuario/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, empresa, telefone, status, user_type } = req.body;
  const { data, error } = await supabase
    .from('profiles')
    .update({ nome, email, empresa, telefone, status, user_type })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ user: data });
});

// Alterar senha do usuário
app.post('/alterar-senha', async (req, res) => {
  const { userId, senhaAtual, novaSenha } = req.body;

  console.log('Backend: Recebido pedido de alteração de senha para userId:', userId);

  // Busca o usuário pelo ID para obter o hash da senha atual
  const { data: user, error: errorUser } = await supabase
    .from('profiles')
    .select('senha_hash')
    .eq('id', userId)
    .single();

  if (errorUser) {
    console.error('Backend: Erro ao buscar usuário para alteração de senha:', errorUser);
    return res.status(400).json({ error: 'Erro ao buscar usuário.' });
  }
  if (!user) {
    console.warn('Backend: Usuário não encontrado para alteração de senha (userId):', userId);
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  // Compara a senha atual fornecida com o hash salvo
  const isMatch = await bcrypt.compare(senhaAtual, user.senha_hash);
  if (!isMatch) {
    console.warn('Backend: Senha atual incorreta para userId:', userId);
    return res.status(401).json({ error: 'Senha atual incorreta.' });
  }

  // Gera novo hash para a nova senha
  const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
  console.log('Backend: Gerado novo hash para userId:', userId);

  // Atualiza a senha_hash no banco
  const { data: updateData, error: updateError } = await supabase
    .from('profiles')
    .update({ senha_hash: novaSenhaHash })
    .eq('id', userId)
    .select();

  if (updateError) {
    console.error('Backend: Erro ao atualizar senha no Supabase:', updateError);
    return res.status(400).json({ error: updateError.message });
  }

  if (!updateData || updateData.length === 0) {
    console.warn('Backend: Atualização de senha não afetou nenhum registro para userId:', userId);
    return res.status(400).json({ error: 'Nenhum registro foi atualizado. Verifique o ID do usuário.' });
  }

  console.log('Backend: Senha alterada com sucesso para userId:', userId);
  return res.status(200).json({ message: 'Senha alterada com sucesso!' });
});

// Buscar todas as solicitações
app.get('/solicitacoes', async (req, res) => {
  console.log('Backend: Recebido pedido para buscar solicitações.');
  try {
    const { data: solicitacoes, error } = await supabase
      .from('solicitacoes')
      .select('*, cliente:cliente_id(nome), categoria:categoria_id(nome)'); // Adiciona joins para cliente e categoria

    console.log('Backend: Dados do Supabase (solicitacoes):', solicitacoes);
    console.log('Backend: Erro do Supabase (solicitacoes):', error);

    if (error) {
      console.error('Backend: Erro ao buscar solicitações do Supabase:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Backend: Solicitacões buscadas com sucesso.', solicitacoes.length, 'itens.');
    return res.status(200).json(solicitacoes);
  } catch (err) {
    console.error('Backend: Erro inesperado ao buscar solicitações:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Obter contagem de clientes
app.get('/counts/clientes', async (req, res) => {
  try {
    const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'cliente');
    res.json({ count: count || 0 });
  } catch (error) {
    console.error('Erro ao buscar contagem de clientes:', error);
    res.status(500).json({ error: 'Erro ao buscar contagem de clientes.' });
  }
});

// Obter contagem de solicitações por status
app.get('/counts/solicitacoes/:status', async (req, res) => {
  const { status } = req.params;
  try {
    const { count } = await supabase.from('solicitacoes').select('*', { count: 'exact', head: true }).eq('status', status);
    res.json({ count: count || 0 });
  } catch (error) {
    console.error(`Erro ao buscar contagem de solicitações com status ${status}:`, error);
    res.status(500).json({ error: `Erro ao buscar contagem de solicitações com status ${status}.` });
  }
});

// Criar nova solicitação
app.post('/solicitacoes', async (req, res) => {
  const { titulo, categoria_id, prioridade, cliente_id, status, dataEntrega, descricao } = req.body;
  console.log('Backend: Recebido pedido para criar solicitação:', req.body);

  try {
    const { data, error } = await supabase
      .from('solicitacoes')
      .insert({
        titulo,
        categoria_id,
        prioridade,
        cliente_id,
        status,
        "data_prazo": dataEntrega || null,
        descricao,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Backend: Erro ao inserir solicitação no Supabase:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Backend: Solicitação criada com sucesso:', data);
    return res.status(201).json(data);
  } catch (err) {
    console.error('Backend: Erro inesperado ao criar solicitação:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Buscar últimas solicitações adicionadas
app.get('/solicitacoes/recentes', async (req, res) => {
  console.log('Backend: Recebido pedido para buscar solicitações recentes.');
  try {
    const { data: solicitacoes, error } = await supabase
      .from('solicitacoes')
      .select('*, cliente:cliente_id(nome), categoria:categoria_id(nome)')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Backend: Erro ao buscar solicitações recentes do Supabase:', error);
      // Log detalhado do erro do Supabase
      console.error('Backend: Detalhes do erro do Supabase:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Backend: Solicitacões recentes buscadas com sucesso.', solicitacoes.length, 'itens.');
    return res.status(200).json(solicitacoes);
  } catch (err) {
    console.error('Backend: Erro inesperado ao buscar solicitações recentes:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Buscar uma única solicitação pelo ID
app.get('/solicitacoes/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Backend: Recebido pedido para buscar solicitação com ID: ${id}`);

  try {
    const { data: solicitacao, error } = await supabase
      .from('solicitacoes')
      .select('*, cliente:cliente_id(nome), categoria:categoria_id(nome)')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Backend: Erro ao buscar solicitação ${id} do Supabase:`, error);
      if (error.code === 'PGRST116') { // No rows found
        return res.status(404).json({ error: 'Solicitação não encontrada.' });
      }
      return res.status(500).json({ error: error.message });
    }

    if (!solicitacao) {
      console.warn(`Backend: Solicitação com ID ${id} não encontrada.`);
      return res.status(404).json({ error: 'Solicitação não encontrada.' });
    }

    console.log(`Backend: Solicitação ${id} buscada com sucesso.`, solicitacao);
    return res.status(200).json(solicitacao);
  } catch (err) {
    console.error(`Backend: Erro inesperado ao buscar solicitação ${id}:`, err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Buscar solicitações para o calendário por mês e ano
app.get('/solicitacoes-calendario', async (req, res) => {
  const { month, year } = req.query;
  console.log(`Backend: Recebido pedido para buscar solicitações para calendário. Mês: ${month}, Ano: ${year}`);

  if (!month || !year) {
    return res.status(400).json({ error: 'Mês e ano são obrigatórios.' });
  }

  try {
    // Converte month para número (0-indexed para JavaScript Date)
    const startOfMonth = new Date(Number(year), Number(month) - 1, 1);
    const endOfMonth = new Date(Number(year), Number(month), 0);

    const { data: solicitacoes, error } = await supabase
      .from('solicitacoes')
      .select('*, cliente:cliente_id(nome), categoria:categoria_id(nome)')
      .gte('data_prazo', startOfMonth.toISOString())
      .lte('data_prazo', endOfMonth.toISOString())
      .order('data_prazo', { ascending: true });

    if (error) {
      console.error('Backend: Erro ao buscar solicitações para calendário do Supabase:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Backend: Solicitacões para calendário buscadas com sucesso.', solicitacoes.length, 'itens.');
    return res.status(200).json(solicitacoes);
  } catch (err) {
    console.error('Backend: Erro inesperado ao buscar solicitações para calendário:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Atualizar solicitação
app.put('/solicitacoes/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, categoria_id, prioridade, status, cliente_id, dataEntrega, descricao } = req.body;
  console.log(`Backend: Recebido pedido para atualizar solicitação com ID: ${id}`);
  console.log('Backend: Dados recebidos para atualização:', req.body);

  try {
    const { data, error } = await supabase
      .from('solicitacoes')
      .update({
        titulo,
        categoria_id,
        prioridade,
        status,
        cliente_id,
        data_prazo: dataEntrega || null, // data_prazo pode ser nulo
        descricao,
        updated_at: new Date().toISOString(), // Atualizar timestamp
      })
      .eq('id', id);

    if (error) {
      console.error(`Backend: Erro ao atualizar solicitação ${id} no Supabase:`, error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`Backend: Solicitação ${id} atualizada com sucesso.`, data);
    return res.status(200).json({ message: 'Solicitação atualizada com sucesso.', data });
  } catch (err) {
    console.error(`Backend: Erro inesperado ao atualizar solicitação ${id}:`, err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Deletar uma solicitação
app.delete('/solicitacoes/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Backend: Recebido pedido para deletar solicitação com ID: ${id}`);

  try {
    const { error } = await supabase
      .from('solicitacoes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Backend: Erro ao deletar solicitação ${id} no Supabase:`, error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`Backend: Solicitação ${id} deletada com sucesso.`);
    return res.status(204).send(); // 204 No Content para deleção bem-sucedida
  } catch (err) {
    console.error(`Backend: Erro inesperado ao deletar solicitação ${id}:`, err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));

module.exports = app; 