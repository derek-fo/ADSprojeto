import { get, post, patch } from './client.js';

export async function getGrupos() {
  return get('/grupos');
}

export async function criarGrupo(nome, tipo, usuarioId) {
  return post('/grupos', { nome, tipo, membros: [usuarioId] });
}

export async function entrarNoGrupo(grupoId, usuarioId) {
  const grupo = await get(`/grupos/${grupoId}`);
  if (grupo.membros.includes(usuarioId)) return grupo;
  return patch(`/grupos/${grupoId}`, { membros: [...grupo.membros, usuarioId] });
}
