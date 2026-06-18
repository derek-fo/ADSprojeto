import { patch, del } from './client.js';

export async function atualizarUsuario(id, dados) {
  return patch(`/usuarios/${id}`, dados);
}

export async function excluirUsuario(id) {
  return del(`/usuarios/${id}`);
}
