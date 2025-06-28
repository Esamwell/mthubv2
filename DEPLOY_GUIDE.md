# Guia de Deploy no Vercel - MTHub

## Pré-requisitos

1. Conta no Vercel (https://vercel.com)
2. Projeto no Supabase configurado
3. Repositório Git (GitHub, GitLab, Bitbucket)

## Passos para Deploy

### 1. Preparação do Repositório

Certifique-se de que seu código está em um repositório Git:

```bash
git add .
git commit -m "Preparando para deploy no Vercel"
git push origin main
```

### 2. Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub/GitLab/Bitbucket
3. Clique em "New Project"
4. Importe seu repositório

### 3. Configuração do Projeto

#### Framework Preset
- Selecione "Vite" como framework preset

#### Root Directory
- Deixe como `/` (raiz do projeto)

#### Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install && cd api && npm install`

### 4. Variáveis de Ambiente

Configure as seguintes variáveis no painel do Vercel:

```
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
NODE_ENV=production
```

### 5. Deploy

1. Clique em "Deploy"
2. Aguarde o build completar
3. Verifique se não há erros nos logs

## Estrutura do Deploy

- **Frontend**: Será servido como arquivos estáticos
- **API**: Será executada como serverless functions
- **Rotas**: 
  - `/api/*` → API Express
  - `/*` → Frontend React

## Troubleshooting

### Erro de Build
- Verifique se todas as dependências estão no `package.json`
- Confirme se o script `build` está funcionando localmente

### Erro de API
- Verifique se as variáveis de ambiente estão configuradas
- Confirme se o Supabase está acessível

### Erro de CORS
- A API já está configurada com CORS habilitado
- Se necessário, ajuste o `CORS_ORIGIN` nas variáveis de ambiente

## URLs de Deploy

Após o deploy, você terá:
- **URL de Produção**: `https://seu-projeto.vercel.app`
- **URL de Preview**: `https://seu-projeto-git-main.vercel.app`

## Monitoramento

- Use o painel do Vercel para monitorar logs
- Configure alertas para erros de build
- Monitore o uso das serverless functions 