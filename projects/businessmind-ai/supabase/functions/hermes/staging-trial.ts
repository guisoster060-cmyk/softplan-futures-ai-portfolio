// Exclusivo do Supabase staging. Não usar como entrypoint em produção.
import { createHermesHandler } from './index.ts';
Deno.serve(createHermesHandler(false));
