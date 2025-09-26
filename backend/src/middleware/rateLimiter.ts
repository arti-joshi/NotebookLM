import rateLimit from 'express-rate-limit';

// Rate limit middleware configurations
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per window
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  message: 'Too many requests from this IP, please try again after a minute',
  standardHeaders: true,
  legacyHeaders: false,
});

// Special rate limiter for AI endpoints
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 AI requests per minute
  message: 'Rate limit exceeded for AI requests. Please try again after a minute.',
  standardHeaders: true,
  legacyHeaders: false,
});