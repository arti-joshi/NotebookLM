import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Helper function to resolve paths relative to the project root
export function resolveProjectPath(...paths: string[]): string {
  return join(dirname(dirname(__dirname)), ...paths)
}

// Helper function to resolve paths relative to the current file
export function resolveFromFile(...paths: string[]): string {
  return join(__dirname, ...paths)
}