import { AccountDoc } from 'db';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [index: string]: string;
            NODE_ENV?: 'development' | 'production' | 'test';
            PORT?: string;
            ORIGIN?: string;
            DB_URL?: string;
            JWT_SECRET?: string;
            COOKIE_SECRET?: string;
        }
    }
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface User extends AccountDoc {}
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
