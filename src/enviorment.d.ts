export {};

declare module 'socket.io' {
    interface Socket {
      user: User;
    }
}
declare global {
  type User = {
    role: string;
    id: number;
    username: string;
  };
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT: string;
      IO_PORT: string;
      JWT_SECRET: string;
    }
  }

  namespace Express {
    export interface Request {
      currentUser: User;
    }
  }
}
