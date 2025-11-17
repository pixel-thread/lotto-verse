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

const formatData = <T>(type: ErrorType, data: T): string => {
  const timestamp = new Date().toISOString();
  const content = typeof data === 'string' ? data : JSON.stringify(data, null, 3); // 2 -  indentation, null - no spaces
  return `[${timestamp}] [${type.toUpperCase()}]: ${content}`;
};

export const logger = {
  error: async <T>(data: T): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      console.log(formatData('ERROR', data));
    }

    if (process.env.NODE_ENV === 'production') {
      try {
        await sendLogToServer('ERROR', data);
      } catch (error) {
        console.error('Failed to send error logs to server');
      }
    }
  },

  info: async <T>(data: T): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      console.log(formatData('INFO', data));
    }

    if (process.env.NODE_ENV === 'production') {
      try {
        await sendLogToServer('INFO', data);
      } catch (error) {
        console.error('Failed to send info logs to server');
      }
    }
  },

  warn: async <T>(data: T): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      console.log(formatData('INFO', data));
    }

    if (process.env.NODE_ENV === 'production') {
      try {
        await sendLogToServer('INFO', data);
      } catch (error) {
        console.error('Failed to send info logs to server');
      }
    }
  },

  log: async <T>(data: T): Promise<void> => {
    if (process.env.NODE_ENV === 'development') {
      console.log(formatData('LOG', data));
    }
    if (process.env.NODE_ENV === 'production') {
      try {
        await sendLogToServer('LOG', data);
      } catch (error) {
        console.error('Failed to send info logs to server');
      }
    }
  },
};
