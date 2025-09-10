import { describe, it, expect } from '@jest/globals'

// Test utility functions
describe('Utility Functions', () => {
  describe('cosineSimilarity', () => {
    it('should calculate cosine similarity correctly', () => {
      const cosineSimilarity = (a: number[], b: number[]): number => {
        const minLen = Math.min(a.length, b.length)
        let dot = 0
        let normA = 0
        let normB = 0

        for (let i = 0; i < minLen; i++) {
          const aVal = a[i]
          const bVal = b[i]
          if (aVal !== undefined && bVal !== undefined) {
            dot += aVal * bVal
            normA += aVal * aVal
            normB += bVal * bVal
          }
        }

        if (normA === 0 || normB === 0) return 0
        return dot / (Math.sqrt(normA) * Math.sqrt(normB))
      }

      expect(cosineSimilarity([1, 0, 0], [1, 0, 0])).toBe(1)
      expect(cosineSimilarity([1, 0, 0], [0, 1, 0])).toBe(0)
      expect(cosineSimilarity([0, 0, 0], [1, 1, 1])).toBe(0)
    })
  })

  describe('chunkText', () => {
    it('should chunk text correctly', () => {
      const chunkText = (text: string, chunkSize = 1000, overlap = 200): string[] => {
        const clean = text.replace(/\s+/g, ' ').trim()
        const chunks: string[] = []
        let i = 0

        while (i < clean.length) {
          const end = Math.min(i + chunkSize, clean.length)
          chunks.push(clean.slice(i, end))
          i += chunkSize - overlap
        }

        return chunks
      }

      const text = 'a'.repeat(1500)
      const chunks = chunkText(text, 1000, 200)
      expect(chunks.length).toBe(2)
      expect(chunks[0]?.length).toBe(1000)
    })
  })

  describe('parseRefreshCookie', () => {
    it('should return cookie value or null', () => {
      const parseRefreshCookie = (cookieVal?: string) => {
        return cookieVal || null
      }

      expect(parseRefreshCookie('test-token')).toBe('test-token')
      expect(parseRefreshCookie(undefined)).toBe(null)
      expect(parseRefreshCookie('')).toBe(null)
    })
  })

  describe('withTimeout', () => {
    it('should resolve promise within timeout', async () => {
      const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
        return new Promise<T>((resolve, reject) => {
          let settled = false
          const timeout = setTimeout(() => {
            if (!settled) {
              settled = true
              reject(new Error('timeout'))
            }
          }, ms)

          promise.then(value => {
            if (!settled) {
              settled = true
              clearTimeout(timeout)
              resolve(value)
            }
          }).catch(error => {
            if (!settled) {
              settled = true
              clearTimeout(timeout)
              reject(error)
            }
          })
        })
      }

      const fastPromise = Promise.resolve('success')
      await expect(withTimeout(fastPromise, 1000)).resolves.toBe('success')
    })

    it('should reject on timeout', async () => {
      const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
        return new Promise<T>((resolve, reject) => {
          let settled = false
          const timeout = setTimeout(() => {
            if (!settled) {
              settled = true
              reject(new Error('timeout'))
            }
          }, ms)

          promise.then(value => {
            if (!settled) {
              settled = true
              clearTimeout(timeout)
              resolve(value)
            }
          }).catch(error => {
            if (!settled) {
              settled = true
              clearTimeout(timeout)
              reject(error)
            }
          })
        })
      }

      const slowPromise = new Promise(resolve => setTimeout(resolve, 200))
      await expect(withTimeout(slowPromise, 100)).rejects.toThrow('timeout')
    })
  })
})