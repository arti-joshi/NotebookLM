declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    GOOGLE_API_KEY: string
    PINECONE_API_KEY: string
    PINECONE_INDEX: string
    JWT_SECRET: string
    PORT?: string
  }
}

