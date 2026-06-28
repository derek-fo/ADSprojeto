import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { getTreinoHoje, getProximosTreinos } from "../api/treinos";
import { Plus, TrendingUp, CheckCircle } from "lucide-react";
import notificationIcon from "../assets/icons/notificationicon.png";

function CardStats({ item }) {
  return (
    <div className="flex justify-between mt-3">
      {[
        ["Duração", item.duracao + " min."],
        [
          "Séries",
          item.exercicios.reduce((s, e) => s + Number(e.series || 0), 0),
        ],
        ["Exercícios", item.exercicios.length],
      ].map(([l, v]) => (
        <div key={l} className="flex flex-col items-center">
          <span className="text-text-muted text-[10px]">{l}</span>
          <span className="text-white text-xs font-semibold mt-0.5">{v}</span>
        </div>
      ))}
    </div>
  );
}

export default function Inicio() {
  const nav = useNavigate();
  const { usuario } = useAuth();
  const [tab, setTab] = useState(0);
  const [treinoHoje, setTreinoHoje] = useState(null);
  const [proximos, setProximos] = useState([]);
  const [concluidos, setConcluidos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const [hoje, prox] = await Promise.all([
          getTreinoHoje(usuario.usuarioId),
          getProximosTreinos(usuario.usuarioId),
        ]);
        setTreinoHoje(hoje);
        setProximos(prox);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [usuario.usuarioId]);

  return (
    <div className="min-h-screen bg-bg text-text-light p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        <header className="flex items-center justify-between border-b border-line pb-4 relative">
          <span className="text-white font-[Oswald] text-2xl font-bold tracking-[3px] uppercase">
            Início
          </span>
          <img
            src={notificationIcon}
            className="w-5 h-5 object-contain cursor-pointer brightness-0 invert opacity-40 hover:opacity-100 transition-opacity"
            alt="Notificações"
          />
        </header>

        <div className="flex border-b border-line px-5 mb-4">
          {["MUSCULAÇÃO", "FUNCIONAL"].map((t, i) => (
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

        <p className="text-text-muted text-sm">
          Bem vindo,{" "}
          <strong className="text-white">{usuario.nome?.toUpperCase()}</strong>
        </p>

        {erro && (
          <p className="bg-red/10 border border-red text-red text-xs rounded px-3 py-2 text-center">
            {erro}
          </p>
        )}

        {carregando && (
          <p className="text-text-muted text-sm text-center">
            Carregando seus dados diários...
          </p>
        )}

        {!carregando && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="space-y-3">
              <h3 className="text-red font-[Oswald] text-sm font-bold uppercase tracking-wider">
                Treino Recomendado
              </h3>
              {treinoHoje ? (
                <div
                  onClick={() => nav(`/treino/${treinoHoje.id}`)}
                  className="bg-bg-card border-l-4 border-red rounded-xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.4)] cursor-pointer hover:brightness-110 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-text-muted text-[11px] uppercase font-semibold">
                      Focar hoje
                    </span>
                    <span className="bg-red text-white text-[10px] font-bold tracking-[1px] px-2 py-0.5 rounded-full">
                      {treinoHoje.tipo}
                    </span>
                  </div>
                  <h4 className="text-white text-lg font-bold mb-2">
                    {treinoHoje.nome}
                  </h4>
                  <CardStats item={treinoHoje} />
                </div>
              ) : (
                <div className="bg-bg-card border border-line p-4 rounded-xl text-center text-text-muted text-sm">
                  Nenhum treino específico agendado para hoje. Escolha um na
                  lista lateral ou crie um novo!
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-white font-[Oswald] text-sm font-bold uppercase tracking-wider opacity-60">
                Próximos Treinos
              </h3>
              {proximos.length === 0 ? (
                <p className="text-text-muted text-sm">
                  Sem próximos treinos na fila.
                </p>
              ) : (
                proximos.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => nav(`/treino/${item.id}`)}
                    className="bg-bg-card border border-line rounded-xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.4)] cursor-pointer hover:brightness-110 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-text-muted text-[10px] uppercase font-medium">
                        Cronograma
                      </span>
                      <span className="border border-red text-red text-[10px] font-bold tracking-[1px] px-2 py-0.5 rounded-full">
                        {item.tipo}
                      </span>
                    </div>
                    <h4 className="text-white text-base font-bold mb-1">
                      {item.nome}
                    </h4>
                    <CardStats item={item} />
                  </div>
                ))
              )}
            </div>

            {/* COLUNA 3: Histórico de Concluídos */}
            <div className="space-y-3">
              <h3 className="text-white font-[Oswald] text-sm font-bold uppercase tracking-wider opacity-60">
                Concluídos Recentemente
              </h3>
              {concluidos.length === 0 ? (
                <p className="text-text-muted text-sm">
                  Nenhum treino finalizado esta semana.
                </p>
              ) : (
                concluidos.map((item) => (
                  <div
                    key={item.id}
                    className="bg-bg-card border border-line opacity-60 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-text-muted text-sm font-bold line-through">
                        {item.nome}
                      </h4>
                      <p className="text-[10px] text-text-muted">
                        Concluído em: {item.concluidoEm}
                      </p>
                    </div>
                    <CheckCircle className="text-text-muted" size={20} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2.5 mt-2">
          <button
            onClick={() => nav("/novo-treino")}
            className="flex-1 h-[50px] bg-red text-white font-[Oswald] text-xs font-bold tracking-[2px] rounded flex items-center justify-center gap-1.5 hover:opacity-85 transition-opacity uppercase"
          >
            <Plus size={20} /> Novo treino
          </button>
          <button className="flex-1 h-[50px] border border-red text-red font-[Oswald] text-xs uppercase font-bold tracking-[2px] rounded flex items-center justify-center gap-1.5 hover:bg-red/10 transition-colors *:">
            <TrendingUp size={20} /> Ver progresso
          </button>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
