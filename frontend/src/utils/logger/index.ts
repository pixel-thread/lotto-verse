import http from '../http';

type ErrorType = 'ERROR' | 'INFO' | 'WARN' | 'LOG';

const sendLogToServer = async <T>(type: ErrorType, data: T) => {
  const logEntry = {
    type,
    content: typeof data === 'string' ? data : JSON.stringify(data),
    timestamp: new Date().toISOString(),
  };

  try {
    await http.post('/logs', logEntry); // send object; HTTP client converts to JSON
  } catch (error) {
    console.error('Failed to send logs to server', error);
  }
};

const formatData = (type: ErrorType, ...args: any[]): string => {
  const timestamp = new Date().toISOString();
  let content: string;
  if (args.length === 1) {
    content = typeof args[0] === 'string' ? args[0] : JSON.stringify(args[0], null, 3);
  } else {
    const [message, data] = args;
    content =
      typeof message === 'string'
        ? `${message} ${data ? JSON.stringify(data, null, 3) : ''}`
        : JSON.stringify(message, null, 3);
  }
  return `[${timestamp}] [${type}]: ${content}`;
};

const logMethod = async (type: ErrorType, ...args: any[]): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    console.log(formatData(type, ...args));
  }
  if (process.env.NODE_ENV === 'production' && type !== 'LOG') {
    try {
      // Compose content combining string message and optional object argument
      let content: string;
      if (args.length === 1) {
        content = typeof args[0] === 'string' ? args[0] : JSON.stringify(args[0]);
      } else {
        const [message, data] = args;
        content =
          typeof message === 'string'
            ? `${message} ${data ? JSON.stringify(data) : ''}`
            : JSON.stringify(message);
      }
      await sendLogToServer(type, content);
    } catch {
      console.error(`Failed to send ${type.toLowerCase()} logs to server`);
    }
  }
};

export const logger = {
  error: (...args: any[]) => logMethod('ERROR', ...args),
  info: (...args: any[]) => logMethod('INFO', ...args),
  warn: (...args: any[]) => logMethod('WARN', ...args),
  log: (...args: any[]) => logMethod('LOG', ...args),
};
