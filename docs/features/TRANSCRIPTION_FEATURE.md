# Funcionalidade de Transcrição Original

## Visão Geral

Esta funcionalidade permite aos usuários visualizar o texto original transcrito a partir do áudio que foi usado para criar uma tarefa. Quando uma tarefa é criada através de entrada de voz, o texto original da transcrição é armazenado e pode ser visualizado através de um modal.

## Implementação

### 1. Atualização do Tipo Task

O tipo `Task` foi atualizado para incluir o campo `transcription`:

```typescript
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: 'baixa' | 'média' | 'alta';
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  transcription?: string; // Original transcription from voice input
}
```

### 2. Atualização do TaskService

O `TaskService` foi modificado para:

- Aceitar o parâmetro `transcription` no método `createTask`
- Armazenar a transcrição ao criar tasks a partir da resposta da API externa

```typescript
async createTask(title: string, dueDate?: Date, description?: string, priority?: 'baixa' | 'média' | 'alta', transcription?: string): Promise<Task>

async createTaskFromBackendResponse(backendTask: BackendTaskResponse): Promise<Task> {
  // ... parsing logic ...
  
  const newTask = await this.createTask(
    backendTask.task.data.title,
    dueDate,
    backendTask.task.data.description,
    'média',
    backendTask.transcription // Pass transcription directly
  );
  
  return newTask;
}
```

### 3. Componente TranscriptionModal

Foi criado um novo componente modal para exibir a transcrição:

```typescript
interface TranscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transcription: string;
  taskTitle: string;
}
```

O modal exibe:
- Título da tarefa
- Texto original da transcrição
- Botão para fechar

### 4. Atualização do TaskCard

O componente `TaskCard` foi atualizado para:

- Mostrar um ícone de informação (ℹ️) ao lado do ícone de excluir quando há transcrição
- Abrir o modal de transcrição quando o ícone é clicado
- Incluir tooltip explicativo

```typescript
{task.transcription && (
  <button
    onClick={() => setIsModalOpen(true)}
    className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1"
    aria-label="View transcription"
    title={t('task.transcription.view', 'View original transcription')}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </button>
)}
```

### 5. Traduções

Foram adicionadas traduções para a funcionalidade:

**Português (pt.json):**
```json
"transcription": {
  "title": "Transcrição Original",
  "task": "Tarefa",
  "original": "Entrada de Voz Original",
  "view": "Ver transcrição original"
}
```

**Inglês (en.json):**
```json
"transcription": {
  "title": "Original Transcription",
  "task": "Task",
  "original": "Original Voice Input",
  "view": "View original transcription"
}
```

## Fluxo de Funcionamento

1. **Criação da Tarefa**: Quando o usuário grava um áudio, a API externa retorna:
   ```json
   {
     "timestamp": "1753037747",
     "transcription": "Nova atividade para hoje, meia-noite e quarenta e cinco.",
     "task": {
       "success": true,
       "data": {
         "title": "Nova atividade",
         "description": "Nova atividade para hoje, meia-noite e quarenta e cinco",
         "due_date": "2025-07-20T23:45:00Z",
         "meta": {
           "llm_provider": "groq",
           "model_used": "llama3-8b-8192"
         }
       }
     }
   }
   ```

2. **Armazenamento**: A transcrição é salva junto com a tarefa no localStorage

3. **Exibição**: O ícone de informação aparece ao lado do ícone de excluir na tarefa

4. **Visualização**: Ao clicar no ícone, um modal é aberto mostrando:
   - O título da tarefa
   - O texto original da transcrição entre aspas

## Benefícios

- **Transparência**: Usuários podem ver exatamente o que foi transcrito
- **Debugging**: Facilita a identificação de problemas de transcrição
- **Confiança**: Usuários podem verificar se a tarefa foi criada corretamente
- **Acessibilidade**: Interface clara e intuitiva

## Arquivos Modificados

- `src/types/index.ts` - Adicionado campo transcription
- `src/services/taskService.ts` - Atualizado para salvar transcrição
- `src/hooks/useTasks.ts` - Atualizado para aceitar transcrição
- `src/components/TaskCard.tsx` - Adicionado ícone e modal
- `src/components/TranscriptionModal.tsx` - Novo componente
- `src/i18n/locales/pt.json` - Traduções em português
- `src/i18n/locales/en.json` - Traduções em inglês 