import { get } from './client.js';

export async function getMidias(usuarioId, tipo) {
  return get(`/midias?usuarioId=${usuarioId}&tipo=${tipo}`);
}
