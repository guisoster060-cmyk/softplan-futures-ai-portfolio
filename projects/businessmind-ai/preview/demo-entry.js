document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('demo-enter');
  button?.addEventListener('click', () => window.supabase.createClient().auth.signInWithPassword());
  document.getElementById('demo-reset')?.addEventListener('click', () => {
    if (window.confirm('Restaurar os dados fictícios desta demonstração neste navegador?')) window.BusinessMindDemo.reset();
  });
});
