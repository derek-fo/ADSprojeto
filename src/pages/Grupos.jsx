import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { getGrupos, criarGrupo, entrarNoGrupo } from "../api/grupos";
import { Plus, MessageSquare, Edit } from "lucide-react";
import lupaIcon from "../assets/icons/lupa.png";

function CardGrupo({ g, eMeu, onEntrar }) {
  return (
    <div className="bg-bg-card border border-line md:bg-bg-darker rounded-xl p-4 mb-3 flex items-center justify-between shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
      <div>
        <p className="text-white text-base font-bold mb-0.5">{g.nome}</p>
        <p className="text-text-muted text-xs">
          <strong className="text-white">{g.membros.length}</strong> membros
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="text-red hover:opacity-85 transition-opacity"
          title="Chat"
        >
          <MessageSquare size={18} />
        </button>
        {eMeu ? (
          <button
            className="text-red hover:opacity-85 transition-opacity"
            title="Editar"
          >
            <Edit size={18} />
          </button>
        ) : (
          <span
            onClick={() => onEntrar && onEntrar(g.id)}
            className="bg-red text-white text-[10px] font-bold tracking-wide px-3 py-1.5 rounded-full cursor-pointer hover:opacity-85 transition-opacity"
          >
            ENTRAR
          </span>
        )}
      </div>
    </div>
  );
}

export default function Grupos() {
  const { usuario } = useAuth();
  const [tab, setTab] = useState(0);
  const [busca, setBusca] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [novoNome, setNovoNome] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const data = await getGrupos();
      setGrupos(data);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleEntrar(grupoId) {
    try {
      await entrarNoGrupo(grupoId, usuario.usuarioId);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  async function handleCriarGrupo() {
    if (novoNome.trim() === "") return;
    try {
      await criarGrupo(novoNome, "personalizado", usuario.usuarioId);
      setNovoNome("");
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  const meusGrupos = grupos.filter(
    (g) =>
      g.membros.includes(usuario.usuarioId) &&
      g.nome.toLowerCase().includes(busca.toLowerCase()),
  );
  const outrosGrupos = grupos.filter(
    (g) =>
      !g.membros.includes(usuario.usuarioId) &&
      g.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-bg text-text-light p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto w-full flex flex-col space-y-6">
      <header className="sticky top-0 z-10 bg-bg flex items-center justify-center px-5 py-3.5">
        <div className="flex-1 flex justify-center">
          <span className="text-white font-[Oswald] text-lg font-bold tracking-[3px] uppercase">Grupos</span>
        </div>
        </header>

        <div className="flex items-center gap-2.5 bg-bg-card border border-line rounded-xl px-4 py-1">
          <img
            src={lupaIcon}
            alt="Lupa"
            className="w-4 h-4 object-contain text-text-muted brightness-0 invert opacity-40"
          />
          <input
            className="flex-1 text-white text-sm py-2 bg-transparent border-none outline-none placeholder:text-text-muted"
            placeholder="Procurar grupos"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {erro && (
          <p className="bg-red/10 border border-red text-red text-xs rounded px-3 py-2 text-center">
            {erro}
          </p>
        )}

        {carregando && (
          <p className="text-text-muted text-sm text-center">
            Carregando grupos...
          </p>
        )}

        {!carregando && (
          <>
            <div className="hidden md:grid grid-cols-2 gap-6">
              <div className="bg-bg-card border border-line p-5 rounded-xl flex flex-col justify-between min-h-[400px]">
                <div>
                  <h3 className="text-white font-[Oswald] text-lg font-bold tracking-[1px] mb-4 uppercase border-b border-line pb-2">
                    Seus Grupos
                  </h3>
                  {meusGrupos.length === 0 ? (
                    <p className="text-text-muted text-sm">
                      Você não participa de nenhum grupo.
                    </p>
                  ) : (
                    meusGrupos.map((g) => (
                      <CardGrupo key={g.id} g={g} eMeu={true} />
                    ))
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-line">
                  <input
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    placeholder="Nome do novo grupo"
                    className="flex-1 min-w-0 bg-bg-darker text-white text-sm px-3 py-2 rounded border border-line focus:outline-none focus:border-red"
                  />
                  <button
                    onClick={handleCriarGrupo}
                    className="h-[40px] px-4 bg-red text-white font-[Oswald] text-xs font-bold tracking-[1px] rounded flex items-center justify-center gap-2 shrink-0 uppercase"
                  >
                    <Plus size={16} /> Criar
                  </button>
                </div>
              </div>

              <div className="bg-bg-card border border-line p-5 rounded-xl min-h-[400px]">
                <h3 className="text-white font-[Oswald] text-lg font-bold tracking-[1px] mb-4 uppercase border-b border-line pb-2">
                  Descobrir Grupos
                </h3>
                {outrosGrupos.length === 0 ? (
                  <p className="text-text-muted text-sm">
                    Nenhum grupo novo disponível.
                  </p>
                ) : (
                  outrosGrupos.map((g) => (
                    <CardGrupo
                      key={g.id}
                      g={g}
                      eMeu={false}
                      onEntrar={handleEntrar}
                    />
                  ))
                )}
              </div>
            </div>

            {/* VERSÃO MOBILE: Sistema de Abas */}
            <div className="block md:hidden">
              <div className="flex border-b border-line mb-4">
                {["SEUS GRUPOS", "OUTROS GRUPOS"].map((t, i) => (
                  <button
                    key={t}
                    onClick={() => setTab(i)}
                    className={`flex-1 pb-2.5 font-[Oswald] text-xs font-bold tracking-[2px] border-b-2 -mb-px transition-colors
                      ${tab === i ? "text-white border-red" : "text-text-muted border-transparent"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {tab === 0 && (
                  <>
                    {meusGrupos.length === 0 ? (
                      <p className="text-text-muted text-center py-4 text-sm">
                        Nenhum grupo encontrado
                      </p>
                    ) : (
                      meusGrupos.map((g) => (
                        <CardGrupo key={g.id} g={g} eMeu={true} />
                      ))
                    )}
                  </>
                )}

                {tab === 1 &&
                  (outrosGrupos.length === 0 ? (
                    <p className="text-text-muted text-center py-4 text-sm">
                      Nenhum grupo disponível
                    </p>
                  ) : (
                    outrosGrupos.map((g) => (
                      <CardGrupo
                        key={g.id}
                        g={g}
                        eMeu={false}
                        onEntrar={handleEntrar}
                      />
                    ))
                  ))}
              </div>
              {/* Campo de Criar Grupo responsivo para Mobile (fora das abas para consistência com desktop) */}
              <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-4 p-3 bg-bg-card border border-line rounded-xl">
                <input
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Nome do novo grupo"
                  className="flex-1 min-w-0 bg-bg-darker text-white text-sm px-3 py-2.5 rounded border border-line focus:outline-none focus:border-red"
                />
                <button
                  onClick={handleCriarGrupo}
                  className="w-full sm:w-auto h-[44px] px-4 bg-red text-white font-[Oswald] text-sm font-bold tracking-[1px] rounded flex items-center justify-center gap-2 uppercase whitespace-nowrap"
                >
                  <Plus size={18} /> Criar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
