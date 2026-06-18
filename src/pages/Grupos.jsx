import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { getGrupos, criarGrupo, entrarNoGrupo } from '../api/grupos';

export default function Grupos() {
  const { usuario } = useAuth();
  const [tab, setTab] = useState(0);
  const [busca, setBusca] = useState('');
  const [grupos, setGrupos] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [novoNome, setNovoNome] = useState('');

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      const data = await getGrupos();
      setGrupos(data);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function handleEntrar(grupoId) {
    try {
      await entrarNoGrupo(grupoId, usuario.usuarioId);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  async function handleCriarGrupo() {
    if (novoNome.trim() === '') return;
    try {
      await criarGrupo(novoNome, 'personalizado', usuario.usuarioId);
      setNovoNome('');
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  const tipo  = tab === 0 ? 'meu' : 'outro';
  const lista = grupos
    .filter(g => (tipo === 'meu' ? g.membros.includes(usuario.usuarioId) : !g.membros.includes(usuario.usuarioId)))
    .filter(g => g.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="min-h-screen bg-bg flex flex-col">

      <header className="sticky top-0 z-10 bg-bg px-5 py-3.5">
        <h1 className="text-white font-[Oswald] text-lg font-bold tracking-[3px] text-center">GRUPOS</h1>
      </header>

      <div className="flex items-center gap-2.5 px-5 pt-1">
        <span className="text-text-muted">🔍</span>
        <input
          className="flex-1 text-white text-sm py-2 bg-transparent border-none outline-none placeholder:text-text-muted"
          placeholder="Procurar"
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>
      <div className="h-px bg-line mx-5 mb-3" />

      <div className="flex border-b border-line px-5 mb-4">
        {['SEUS GRUPOS', 'OUTROS GRUPOS'].map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`flex-1 pb-2.5 font-[Oswald] text-xs font-bold tracking-[2px] border-b-2 -mb-px transition-colors
              ${tab === i ? 'text-white border-red' : 'text-text-muted border-transparent'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto px-5 pb-20">
        {erro && (
          <p className="bg-red/10 border border-red text-red text-xs rounded px-3 py-2 mb-4 text-center">
            {erro}
          </p>
        )}

        {carregando && <p className="text-text-muted text-sm">Carregando...</p>}

        {!carregando && lista.length === 0 && (
          <p className="text-text-muted text-center mt-8">Nenhum grupo encontrado</p>
        )}

        {!carregando && lista.map(g => (
          <div key={g.id} className="bg-bg-card rounded-xl p-4 mb-3 flex items-center justify-between shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            <div>
              <p className="text-white text-lg font-bold mb-1">{g.nome}</p>
              <p className="text-text-muted text-sm">
                <strong className="text-white">{g.membros.length}</strong> membros
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button className="text-xl" title="Chat">💬</button>
              {tab === 0
                ? <button className="text-xl" title="Editar">✏️</button>
                : (
                  <span
                    onClick={() => handleEntrar(g.id)}
                    className="bg-red text-white text-[10px] font-bold tracking-wide px-3 py-1 rounded-full cursor-pointer hover:opacity-85"
                  >
                    ENTRAR
                  </span>
                )}
            </div>
          </div>
        ))}

        {tab === 0 && (
          <div className="flex gap-2 mt-2">
            <input
              value={novoNome}
              onChange={e => setNovoNome(e.target.value)}
              placeholder="Nome do novo grupo"
              className="flex-1 bg-bg-card text-white text-sm px-3 rounded border border-line focus:outline-none focus:border-red transition-colors"
            />
            <button
              onClick={handleCriarGrupo}
              className="h-[44px] px-4 bg-red text-white font-[Oswald] text-sm font-bold tracking-[2px] rounded flex items-center justify-center gap-2 hover:opacity-85 transition-opacity"
            >
              ➕ CRIAR
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
