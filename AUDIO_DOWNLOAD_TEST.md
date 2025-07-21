# Teste de Download de Áudio - TEMPORÁRIO

## ⚠️ AVISO
Esta funcionalidade é **TEMPORÁRIA** e será removida após os testes de qualidade de áudio.

## Como Usar

### 1. Gravar Áudio
1. Clique no botão azul de gravação
2. Fale sua tarefa (até 10 segundos)
3. Clique no botão vermelho para parar ou aguarde o tempo limite

### 2. Download do Áudio
1. Após a gravação, o download acontece automaticamente
2. O arquivo será salvo como `recording_YYYY-MM-DD-HH-MM-SS.webm`
3. Não é necessário clicar em nenhum botão adicional

### 3. Especificações do Áudio
- **Formato**: WebM com codec Opus
- **Qualidade**: Alta qualidade para reconhecimento de voz
- **Duração**: Máximo 10 segundos
- **Taxa de amostragem**: Automática baseada no dispositivo

## Informações Técnicas

### Formato WebM
- **Codec**: Opus (otimizado para voz)
- **Container**: WebM
- **Compatibilidade**: Suportado pela maioria dos navegadores modernos

### Qualidade de Gravação
- **Taxa de bits**: Variável (depende do dispositivo)
- **Canais**: Mono (otimizado para reconhecimento de voz)
- **Latência**: Baixa (ideal para aplicações em tempo real)

## Como Avaliar a Qualidade

### 1. Reprodução
- Use um player que suporte WebM (VLC, Chrome, Firefox)
- Verifique se o áudio está claro e sem distorções

### 2. Análise Técnica
- **Clareza**: A voz deve estar clara e compreensível
- **Volume**: Nível adequado sem clipping
- **Ruído**: Mínimo de ruído de fundo
- **Latência**: Sem atrasos significativos

### 3. Testes de Reconhecimento
- Teste com diferentes serviços de STT (Speech-to-Text)
- Verifique a precisão do reconhecimento
- Compare com outros formatos de áudio

## Remoção da Funcionalidade

Após os testes, esta funcionalidade será removida:

1. **Remover arquivo**: `AUDIO_DOWNLOAD_TEST.md`
2. **Remover ícone**: `DownloadIcon` do `Icons.tsx` (se não estiver sendo usado)
3. **Remover useEffect**: Auto-download do `VoiceButton.tsx`
4. **Limpar hook**: Remover `audioBlob` do `useVoiceRecording.ts`
5. **Limpar store**: Remover `audioBlob` do `voiceRecordingStore.ts`

## Comandos para Remoção

```bash
# Remover arquivo de documentação
rm AUDIO_DOWNLOAD_TEST.md

# Remover ícone (manualmente do Icons.tsx se não estiver sendo usado)
# Remover useEffect de auto-download (manualmente do VoiceButton.tsx)
# Limpar hook e store (manualmente)
```

## Notas Importantes

- ✅ **Funcionalidade temporária** para testes
- ✅ **Não afeta** o fluxo normal de criação de tarefas
- ✅ **Compatível** com todos os navegadores suportados
- ✅ **Seguro** - arquivos são baixados localmente
- ⚠️ **Será removida** após os testes

## Suporte

Se houver problemas com o download:
1. Verifique se o navegador suporta WebM
2. Verifique as permissões de download
3. Teste em um navegador diferente
4. Verifique o console para erros 