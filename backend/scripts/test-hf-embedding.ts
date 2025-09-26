import { embedTextHF } from '../src/services/hfEmbeddingService';

(async () => {
  const vec = await embedTextHF("How to create a database in PostgreSQL?");
  console.log("HF embedding length:", vec.length);
  console.log("First 10 values:", vec.slice(0, 10));
})();
