import { get, post } from './client.js';

const SESSION_KEY = 'ads_session';

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveSession(usuario) {
  const session = { usuarioId: usuario.id, nome: usuario.nome, email: usuario.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function login(email, senha) {
  const usuarios = await get(`/usuarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`);
  if (usuarios.length === 0) {
    throw new Error('E-mail ou senha incorretos');
  }
  return saveSession(usuarios[0]);
}

export async function cadastro(dados) {
  const existentes = await get(`/usuarios?email=${encodeURIComponent(dados.email)}`);
  if (existentes.length > 0) {
    throw new Error('E-mail já cadastrado');
  }
  const novoUsuario = await post('/usuarios', dados);
  return saveSession(novoUsuario);
}
