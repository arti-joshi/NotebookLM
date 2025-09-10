import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) {
            callback(null, true);
            return;
        }

        // Allow localhost in development
        if (origin.match(/^https?:\/\/localhost(:\d+)?$/) || 
            origin.match(/^https?:\/\/127\.0\.0\.1(:\d+)?$/)) {
            callback(null, true);
            return;
        }

        // Allow specific production origin if set
        const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
        if (origin === allowedOrigin) {
            callback(null, true);
            return;
        }

        // Reject all other origins
        callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie']
};
