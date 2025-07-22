# Configuração de Variáveis de Ambiente

## Grafana Cloud Loki

Para usar o sistema de logs externo com Grafana Cloud, você precisa configurar as seguintes variáveis de ambiente:

### Variáveis Obrigatórias

1. **VITE_LOKI_LOG_TOKEN**: Token de autenticação do Grafana Cloud Loki
   - Obtenha este token no painel do Grafana Cloud
   - Formato: `glc_eyJvIjoi...`

### Variáveis Opcionais

2. **VITE_LOKI_HOST**: Host do Loki (padrão: `logs-prod-018.grafana.net`)
3. **VITE_LOKI_USER**: ID do usuário (padrão: `1282354`)

## Como Configurar

### 1. Criar arquivo .env

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Grafana Cloud Loki Configuration
VITE_LOKI_LOG_TOKEN=seu_token_aqui

# Opcional: Override configurações padrão
# VITE_LOKI_HOST=logs-prod-018.grafana.net
# VITE_LOKI_USER=1282354
```

### 2. Obter Token do Grafana Cloud

1. Acesse o [Grafana Cloud](https://grafana.com/auth/sign-in)
2. Vá para "My Account" > "Access Policies"
3. Crie uma nova política de acesso ou use uma existente
4. Copie o token gerado

### 3. Testar a Configuração

Após configurar as variáveis de ambiente:

1. Execute `npm run dev`
2. Abra o console do navegador
3. Verifique se aparece a mensagem: "Grafana Cloud Logger initialized successfully"

## Fallback

Se o token não estiver configurado, o sistema automaticamente usará apenas logs no console (modo de desenvolvimento).

## Segurança

⚠️ **Importante**: 
- Nunca commite o arquivo `.env` no repositório
- O arquivo `.env` já está no `.gitignore`
- Use apenas tokens com permissões mínimas necessárias 