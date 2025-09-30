require('dotenv/config')
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'CommonJS',
    moduleResolution: 'node'
  }
})
require('./test-prompt-quality.ts')
