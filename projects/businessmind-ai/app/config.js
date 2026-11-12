'use strict';
// Configuração pública SOMENTE desta branch de preview; produção permanece em outra branch.
// Chaves publishable são públicas; nunca colocar service_role ou segredo de IA aqui.
window.BUSINESSMIND_CONFIG = Object.freeze({
  supabaseUrl: 'https://ogypzmxnvjbomamkejkh.supabase.co',
  supabasePublishableKey: 'sb_publishable_Lq05mBXfQqm9Rt9udW2fww_wXTEL6WM',
  hermesGenerativeEnabled: true,
  hermesRecruiterEnabled: true,
  hermesRemoteDeterministicEnabled: true
});
