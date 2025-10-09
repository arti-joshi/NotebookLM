import fs from 'fs'
import path from 'path'
import winston from 'winston'

const logsDir = path.resolve(process.cwd(), 'logs')
try {
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true })
} catch {}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logsDir, 'progress-tracking.log') }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
})

export function logInteraction(data: {
  userId: string
  query: string
  topicsMapped: string[]
  confidence: number
  timestamp: Date
}) {
  logger.info('Interaction recorded', data)
}

export function logMasteryUpdate(data: {
  userId: string
  topicId: string
  oldLevel: number
  newLevel: number
  oldStatus: string
  newStatus: string
}) {
  logger.info('Mastery updated', data)
}

export function logError(context: string, error: any) {
  logger.error(`Progress tracking error in ${context}`, { error: error?.message, stack: error?.stack })
}


