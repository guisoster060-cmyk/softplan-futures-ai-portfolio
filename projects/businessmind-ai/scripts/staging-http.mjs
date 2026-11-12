export async function fetchWithoutRedirect(url, options, fetchImpl = fetch) {
  const response = await fetchImpl(url, { ...options, redirect: 'error' });
  if (response.redirected || (response.status >= 300 && response.status < 400)) {
    throw Error('Redirecionamento HTTP bloqueado no teste staging.');
  }
  return response;
}
