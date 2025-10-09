import express, { Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { PostgresChatService } from '../services/postgresChatService';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const chatService = new PostgresChatService(prisma);

/**
 * Generate chat response using PostgreSQL documentation
 */
router.post('/chat', auth, asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    messages: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string()
    }))
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request format' });
  }

  try {
    const response = await chatService.generateResponse(parsed.data.messages);
    res.json({ response });
  } catch (error) {
    console.error('Chat generation error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}));

export default router;