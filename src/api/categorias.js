import { get } from './client.js';

export async function getCategorias() {
  return get('/categorias');
}
