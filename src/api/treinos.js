import { get, post, patch } from './client.js';

export async function getTreinos(usuarioId) {
  return get(`/treinos?usuarioId=${usuarioId}`);
}

export async function getTreinoHoje(usuarioId) {
  const treinos = await get(`/treinos?usuarioId=${usuarioId}&tipo=HOJE`);
  return treinos[0] || null;
}

export async function getProximosTreinos(usuarioId) {
  const treinos = await get(`/treinos?usuarioId=${usuarioId}`);
  return treinos.filter(t => t.tipo !== 'HOJE');
}

export async function getTreinoPorId(id) {
  return get(`/treinos/${id}`);
}

export async function criarTreino(treino) {
  return post('/treinos', treino);
}

export async function marcarExercicioConcluido(treinoId, exercicioIndex, concluido) {
  const treino = await get(`/treinos/${treinoId}`);
  const exercicios = treino.exercicios.map((ex, i) =>
    i === exercicioIndex ? { ...ex, concluido } : ex
  );
  return patch(`/treinos/${treinoId}`, { exercicios });
}
