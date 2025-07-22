# Sistema de Logs com Grafana Cloud

## ✅ Implementação Realizada

### 1. **Arquitetura Componentizada** (`src/services/loggingService.ts`)

#### **Interface ILogger**
```typescript
export interface ILogger {
  info(message: string, metadata?: Record<string, any>, labels?: Record<string, string>): Promise<void>;
  error(message: string, error?: Error, metadata?: Record<string, any>, labels?: Record<string, string>): Promise<void>;
  warn(message: string, metadata?: Record<string, any>, labels?: Record<string, string>): Promise<void>;
  debug(message: string, metadata?: Record<string, any>, labels?: Record<string, string>): Promise<void>;
}
```

#### **Implementações Disponíveis**
- **GrafanaLogger**: Envia logs para Grafana Cloud Loki
- **ConsoleLogger**: Fallback para console (quando token não configurado)

#### **Factory Pattern**
```typescript
function createLogger(): ILogger {
  const lokiToken = import.meta.env.VITE_LOKI_LOG_TOKEN;
  
  if (lokiToken) {
    return new GrafanaLogger();
  } else {
    return new ConsoleLogger();
  }
}
```

### 2. **Integração com Sistema Existente** (`src/lib/logger.ts`)

#### **Modificações Realizadas**
- ✅ Mantida compatibilidade com sistema existente
- ✅ Logs locais continuam funcionando (localStorage)
- ✅ Adicionado envio assíncrono para Grafana Cloud
- ✅ Labels estruturados para melhor organização

#### **Estrutura de Labels**
```typescript
const labels = {
  event: logEntry.event,
  level: logEntry.level.toLowerCase(),
  app: 'echodo'
};
```

### 3. **Atualização de Serviços**

#### **BackendService** (`src/services/backendService.ts`)
- ✅ Substituídos todos os `console.log` por `loggingService.info`
- ✅ Substituídos todos os `console.error` por `loggingService.error`
- ✅ Adicionados labels específicos: `{ service: 'backend', operation: 'processAudioToTask' }`
- ✅ Logs detalhados em cada etapa do processamento

#### **TaskService** (`src/services/taskService.ts`)
- ✅ Atualizadas chamadas de log para serem assíncronas
- ✅ Mantida funcionalidade sem bloqueio usando `.catch(console.error)`

#### **useVoiceRecording** (`src/hooks/useVoiceRecording.ts`)
- ✅ Atualizadas chamadas de log para serem assíncronas
- ✅ Adicionados logs detalhados de erro com contexto

### 4. **Configuração de Ambiente**

#### **Variáveis de Ambiente**
- `VITE_LOKI_LOG_TOKEN`: Token obrigatório para Grafana Cloud
- `VITE_LOKI_HOST`: Host do Loki (opcional, padrão: logs-prod-018.grafana.net)
- `VITE_LOKI_USER`: ID do usuário (opcional, padrão: 1282354)

#### **Fallback Automático**
- Se token não configurado → usa apenas console
- Se Grafana Cloud indisponível → continua funcionando com console
- Logs de erro de envio não quebram a aplicação

## 🎯 Benefícios da Implementação

### **Para Desenvolvedores:**
- **Logs Centralizados**: Todos os logs em um local (Grafana Cloud)
- **Busca Avançada**: Filtros por labels, níveis, eventos
- **Alertas**: Possibilidade de configurar alertas baseados em logs
- **Histórico**: Retenção de logs por período configurável

### **Para Operações:**
- **Monitoramento**: Visibilidade completa da aplicação
- **Debugging**: Logs estruturados com contexto
- **Performance**: Envio assíncrono não impacta latência
- **Escalabilidade**: Sistema preparado para crescimento

### **Para Usuários:**
- **Confiabilidade**: Sistema robusto com fallbacks
- **Performance**: Logs não impactam experiência do usuário
- **Transparência**: Melhor debugging de problemas

## 🔧 Como Usar

### **1. Configurar Variáveis de Ambiente**
```env
VITE_LOKI_LOG_TOKEN=seu_token_aqui
```

### **2. Usar o Sistema de Logs**
```typescript
import loggingService from '../services/loggingService';

// Log simples
await loggingService.info('Operação iniciada');

// Log com metadata
await loggingService.info('Dados processados', {
  recordCount: 100,
  processingTime: 1500
}, { service: 'dataProcessor' });

// Log de erro
await loggingService.error('Falha na operação', error, {
  context: 'user input'
}, { service: 'validation' });
```

### **3. Usar Funções de Conveniência**
```typescript
import { log } from '../lib/logger';

await log.taskCreated('task_123', 'Nova tarefa');
await log.voiceRecognitionFailed('Erro de rede');
```

## 📊 Estrutura dos Logs no Grafana Cloud

### **Labels Padrão**
- `app`: 'echodo'
- `level`: 'info' | 'error' | 'warn' | 'debug'
- `event`: Tipo do evento (ex: 'TASK_CREATED', 'VOICE_RECOGNITION_FAILED')
- `service`: Serviço específico (ex: 'backend', 'voiceRecording')
- `operation`: Operação específica (ex: 'processAudioToTask')

### **Metadata Estruturado**
```json
{
  "message": "BackendService: Starting audio processing",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "audioBlobSize": 1024000,
  "audioBlobType": "audio/webm",
  "service": "backend",
  "operation": "processAudioToTask"
}
```

## 🛡️ Tratamento de Erros

### **Estratégias Implementadas**
1. **Envio Assíncrono**: Logs não bloqueiam operações principais
2. **Fallback Automático**: Se Grafana indisponível, usa console
3. **Error Handling**: Erros de envio não quebram aplicação
4. **Timeout Protection**: Evita travamentos por problemas de rede

### **Exemplo de Robustez**
```typescript
// Se Grafana Cloud estiver fora, o log ainda funciona
await loggingService.error('Erro crítico', error).catch(() => {
  // Log ainda aparece no console
  console.error('Erro crítico:', error);
});
```

## 🔄 Migração Futura

### **Facilidade de Troca**
Para trocar o sistema de logs, basta:
1. Implementar nova classe que implementa `ILogger`
2. Atualizar o factory em `loggingService.ts`
3. **Zero mudanças** no resto da aplicação

### **Exemplos de Alternativas**
- **Sentry**: Para error tracking
- **LogRocket**: Para session replay
- **Datadog**: Para observabilidade completa
- **Custom API**: Para logs próprios

## 📈 Métricas e Monitoramento

### **Logs de Sucesso**
- ✅ Criação de tarefas
- ✅ Reconhecimento de voz
- ✅ Processamento de áudio
- ✅ Operações de storage

### **Logs de Erro**
- ❌ Falhas de API
- ❌ Erros de storage
- ❌ Timeouts de rede
- ❌ Parsing de datas
- ❌ Reconhecimento de voz

### **Logs de Performance**
- ⏱️ Tempo de processamento
- 📊 Tamanho de arquivos
- 🔄 Status de operações
- 📈 Métricas de uso 