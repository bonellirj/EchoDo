// Interface para abstrair o logger
export interface ILogger {
  info(message: string, metadata?: Record<string, any>, transactionId?: string): Promise<void>;
  error(message: string, error?: Error, metadata?: Record<string, any>, transactionId?: string): Promise<void>;
  warn(message: string, metadata?: Record<string, any>, transactionId?: string): Promise<void>;
  debug(message: string, metadata?: Record<string, any>, transactionId?: string): Promise<void>;
}



// Implementação do logger com a nova API do EchoDo
class EchoDoLogger implements ILogger {
  private readonly apiUrl = 'https://api.echodo.chat/Log';
  private readonly authToken = 'WsduXaA63a1YZSvgkdWyU81Z';
  private userAgent: string | null = null;
  private userIP: string | null = null;

  constructor() {
    this.initializeUserInfo();
  }

  private async initializeUserInfo(): Promise<void> {
    // Capturar User Agent
    this.userAgent = navigator.userAgent;

    // Tentar capturar IP do usuário (pode não funcionar em todos os casos)
    try {
      // Usar um serviço público para obter o IP
      const response = await fetch('https://api.ipify.org?format=json');
      if (response.ok) {
        const data = await response.json();
        this.userIP = data.ip;
      } else {
        this.userIP = '127.0.0.1'; // Fallback
      }
    } catch (error) {
      console.warn('Could not fetch user IP, using fallback:', error);
      this.userIP = '127.0.0.1'; // Fallback
    }
  }

  private async sendLog(
    level: 'info' | 'error' | 'warn' | 'debug',
    message: string,
    error?: Error,
    metadata?: Record<string, any>,
    transactionId?: string
  ): Promise<void> {
    try {
      // Sempre log no console para desenvolvimento
      if (import.meta.env.DEV) {
        const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
        console[consoleMethod](`[${level.toUpperCase()}] ${message}`, { metadata, error, transactionId });
      }

      // Preparar dados para a API
      const logData = {
        message,
        status: this.getStatusFromLevel(level),
        level,
        transactionId: transactionId || undefined,
        system: 'EchoDo',
        module: 'web-app',
        userId: 'NA',
        meta: {
          ip: this.userIP || '127.0.0.1',
          useragent: this.userAgent || 'Unknown',
          ...metadata
        }
      };

      // Remover transactionId se for undefined para não enviar campo vazio
      if (!logData.transactionId) {
        delete logData.transactionId;
      }

      // Enviar para a API de forma assíncrona
      fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': this.authToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
      }).then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to send log to EchoDo API:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText
          });
        }
      }).catch((sendError) => {
        console.error('Error sending log to EchoDo API:', sendError);
      });

    } catch (error) {
      console.error('Error in logging service:', error);
    }
  }

  private getStatusFromLevel(level: string): number {
    switch (level) {
      case 'error':
        return 500;
      case 'warn':
        return 400;
      case 'debug':
        return 100;
      case 'info':
      default:
        return 200;
    }
  }

  async info(message: string, metadata?: Record<string, any>, transactionId?: string): Promise<void> {
    await this.sendLog('info', message, undefined, metadata, transactionId);
  }

  async error(message: string, error?: Error, metadata?: Record<string, any>, transactionId?: string): Promise<void> {
    await this.sendLog('error', message, error, metadata, transactionId);
  }

  async warn(message: string, metadata?: Record<string, any>, transactionId?: string): Promise<void> {
    await this.sendLog('warn', message, undefined, metadata, transactionId);
  }

  async debug(message: string, metadata?: Record<string, any>, transactionId?: string): Promise<void> {
    if (import.meta.env.DEV) {
      await this.sendLog('debug', message, undefined, metadata, transactionId);
    }
  }
}



// Factory para criar o logger apropriado
function createLogger(): ILogger {
  return new EchoDoLogger();
}

// Instância singleton do logger
const loggingService = createLogger();

export default loggingService; 