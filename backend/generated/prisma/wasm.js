
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  role: 'role',
  isVerified: 'isVerified',
  failedLogins: 'failedLogins',
  lockedUntil: 'lockedUntil',
  verificationToken: 'verificationToken',
  verificationExpires: 'verificationExpires',
  resetToken: 'resetToken',
  resetTokenExpires: 'resetTokenExpires',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RefreshTokenScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  token: 'token',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.NoteScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  document: 'document',
  page: 'page',
  content: 'content',
  createdAt: 'createdAt'
};

exports.Prisma.ProgressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  document: 'document',
  pagesRead: 'pagesRead',
  minutes: 'minutes',
  date: 'date'
};

exports.Prisma.DocumentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  filename: 'filename',
  originalName: 'originalName',
  contentHash: 'contentHash',
  fileSize: 'fileSize',
  mimeType: 'mimeType',
  status: 'status',
  isSystemDocument: 'isSystemDocument',
  totalChunks: 'totalChunks',
  processedChunks: 'processedChunks',
  processingError: 'processingError',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmbeddingScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  documentId: 'documentId',
  source: 'source',
  chunk: 'chunk',
  embedding: 'embedding',
  documentType: 'documentType',
  chunkIndex: 'chunkIndex',
  totalChunks: 'totalChunks',
  section: 'section',
  startLine: 'startLine',
  endLine: 'endLine',
  chunkingConfig: 'chunkingConfig',
  sectionLevel: 'sectionLevel',
  pageStart: 'pageStart',
  pageEnd: 'pageEnd',
  hasTable: 'hasTable',
  hasImage: 'hasImage',
  wordCount: 'wordCount',
  createdAt: 'createdAt'
};

exports.Prisma.RetrievalLogScalarFieldEnum = {
  id: 'id',
  query: 'query',
  results: 'results',
  metrics: 'metrics',
  createdAt: 'createdAt'
};

exports.Prisma.TopicScalarFieldEnum = {
  id: 'id',
  level: 'level',
  name: 'name',
  slug: 'slug',
  parentId: 'parentId',
  chapterNum: 'chapterNum',
  keywords: 'keywords',
  aliases: 'aliases',
  expectedQuestions: 'expectedQuestions',
  createdAt: 'createdAt'
};

exports.Prisma.TopicInteractionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  topicId: 'topicId',
  query: 'query',
  mappingConfidence: 'mappingConfidence',
  ragConfidence: 'ragConfidence',
  ragTopScore: 'ragTopScore',
  citedSections: 'citedSections',
  answerLength: 'answerLength',
  citationCount: 'citationCount',
  timeSpentMs: 'timeSpentMs',
  hadFollowUp: 'hadFollowUp',
  createdAt: 'createdAt'
};

exports.Prisma.TopicMasteryScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  topicId: 'topicId',
  masteryLevel: 'masteryLevel',
  status: 'status',
  questionsAsked: 'questionsAsked',
  coverageScore: 'coverageScore',
  depthScore: 'depthScore',
  confidenceScore: 'confidenceScore',
  diversityScore: 'diversityScore',
  retentionScore: 'retentionScore',
  subtopicsExplored: 'subtopicsExplored',
  firstInteraction: 'firstInteraction',
  lastInteraction: 'lastInteraction',
  completedAt: 'completedAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Role = exports.$Enums.Role = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

exports.DocumentStatus = exports.$Enums.DocumentStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

exports.MasteryStatus = exports.$Enums.MasteryStatus = {
  NOT_STARTED: 'NOT_STARTED',
  BEGINNER: 'BEGINNER',
  LEARNING: 'LEARNING',
  PROFICIENT: 'PROFICIENT',
  MASTERED: 'MASTERED'
};

exports.Prisma.ModelName = {
  User: 'User',
  RefreshToken: 'RefreshToken',
  Note: 'Note',
  Progress: 'Progress',
  Document: 'Document',
  Embedding: 'Embedding',
  RetrievalLog: 'RetrievalLog',
  Topic: 'Topic',
  TopicInteraction: 'TopicInteraction',
  TopicMastery: 'TopicMastery'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
