# Migração do Sistema de Logs para API EchoDo

## Resumo das Mudanças

O sistema de logs foi migrado do Grafana Cloud Loki para a nova API do EchoDo (`https://api.echodo.chat/Log`).

## Principais Alterações

### 1. Novo Serviço de Logs (`src/services/loggingService.ts`)

- **Removido**: Dependência do `@miketako3/cloki`
- **Adicionado**: Implementação nativa para a API do EchoDo
- **Centralizado**: Campos como `system`, `module`, `userId`, `useragent` e `ip`

### 2. Estrutura da Nova API

```json
{
  "message": "Log de teste via console - local",
  "status": 200,
  "level": "info",
  "transactionId": "tx-console-test",
  "system": "EchoDo",
  "module": "web-app",
  "userId": "NA",
  "meta": {
    "ip": "127.0.0.1",
    "useragent": "Mozilla/5.0...",
    "additional_metadata": "..."
  }
}
```

### 3. Campos Centralizados

Os seguintes campos são automaticamente preenchidos pelo serviço:

- **system**: Sempre "EchoDo"
- **module**: Sempre "web-app"
- **userId**: Sempre "NA"
- **useragent**: Capturado automaticamente do navegador
- **ip**: Capturado via serviço externo (fallback para "127.0.0.1")

### 4. Mapeamento de Status

- **info**: 200
- **warn**: 400
- **error**: 500
- **debug**: 100

### 5. Interface Simplificada

A interface do logger foi simplificada, removendo o parâmetro `labels`:

```typescript
// Antes
await loggingService.info(message, metadata, labels, transactionId);

// Depois
await loggingService.info(message, metadata, transactionId);
```

## Arquivos Modificados

1. **`src/services/loggingService.ts`** - Reescrito completamente
2. **`src/lib/logger.ts`** - Removido parâmetro `labels`
3. **`src/services/backendService.ts`** - Atualizado para nova interface
4. **`src/hooks/useVoiceRecording.ts`** - Atualizado para nova interface
5. **`package.json`** - Removida dependência `@miketako3/cloki`

## Benefícios

1. **Menos repetição de código**: Campos comuns centralizados
2. **Captura automática**: IP e UserAgent capturados automaticamente
3. **Simplificação**: Interface mais limpa sem parâmetros desnecessários
4. **Padronização**: Estrutura consistente com outros sistemas EchoDo
5. **Performance**: Menos overhead de configuração

## Configuração

Não é necessária configuração adicional. O serviço usa o token de autorização hardcoded:
- **URL**: `https://api.echodo.chat/Log`
- **Token**: `WsduXaA63a1YZSvgkdWyU81Z`

## Compatibilidade

- ✅ Mantém a mesma interface pública
- ✅ Logs em console para desenvolvimento
- ✅ Tratamento de erros robusto
- ✅ Envio assíncrono para não bloquear a aplicação

## Exemplo de Uso

```typescript
import loggingService from '../services/loggingService';

// Log simples
await loggingService.info('Operação iniciada');

// Log com metadados
await loggingService.info('Dados processados', {
  recordCount: 100,
  processingTime: '2.5s'
});

// Log de erro
await loggingService.error('Falha na operação', error, {
  operation: 'dataProcessing'
}, 'tx-123456');

// Log de debug (apenas em desenvolvimento)
await loggingService.debug('Valor intermediário', { value: 42 });
``` 