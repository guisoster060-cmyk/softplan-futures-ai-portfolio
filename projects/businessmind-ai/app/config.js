'use strict';

// Estes dois valores são públicos por desenho. Nunca adicione service_role,
// secret key ou chave de provedor de IA ao frontend.
window.BUSINESSMIND_CONFIG = Object.freeze({
  supabaseUrl: 'https://cqiuryqnsdmsjchejclo.supabase.co',
  supabasePublishableKey: 'sb_publishable_sS8suJBU8N-tkIGDbF4JRw_CyU4RU_t',
  // Ative somente depois do deploy da função e da autorização de tratamento de dados.
  hermesGenerativeEnabled: false
});
