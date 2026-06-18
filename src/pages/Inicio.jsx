import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { getTreinoHoje, getProximosTreinos } from '../api/treinos';

function CardStats({ item }) {
  return (
    <div className="flex justify-between mt-3">
      {[['Duração', item.duracao + ' min.'], ['Séries', item.exercicios.reduce((s, e) => s + Number(e.series || 0), 0)], ['Exercícios', item.exercicios.length]].map(([l, v]) => (
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
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro('');
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
    <div className="min-h-screen bg-bg flex flex-col">

      <header className="sticky top-0 z-10 bg-bg flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center text-base">👤</div>
          <span className="text-white font-[Oswald] text-lg font-bold tracking-[3px]">INÍCIO</span>
        </div>
        <span className="text-2xl cursor-pointer">🔔</span>
      </header>

      <div className="flex border-b border-line px-5 mb-4">
        {['MUSCULAÇÃO', 'FUNCIONAL'].map((t, i) => (
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
        <p className="text-text-muted text-sm mb-3.5">
          Bem vindo, <strong className="text-white">{usuario.nome?.toUpperCase()}</strong>
        </p>

        {erro && (
          <p className="bg-red/10 border border-red text-red text-xs rounded px-3 py-2 mb-4 text-center">
            {erro}
          </p>
        )}

        {carregando && <p className="text-text-muted text-sm">Carregando...</p>}

        {!carregando && treinoHoje && (
          <div
            onClick={() => nav(`/treino/${treinoHoje.id}`)}
            className="bg-bg-card rounded-xl p-4 mb-3.5 border-l-4 border-red shadow-[0_4px_16px_rgba(0,0,0,0.4)] cursor-pointer hover:brightness-110 transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-text-muted text-xs">Treino de hoje</span>
              <span className="bg-red text-white text-[10px] font-bold tracking-[1px] px-2.5 py-0.5 rounded-full">{treinoHoje.tipo}</span>
            </div>
            <h3 className="text-white text-xl font-bold mb-3">{treinoHoje.nome}</h3>
            <CardStats item={treinoHoje} />
          </div>
        )}

        {!carregando && !treinoHoje && (
          <p className="text-text-muted text-sm mb-3.5">Nenhum treino marcado para hoje.</p>
        )}

        {proximos.map(item => (
          <div
            key={item.id}
            onClick={() => nav(`/treino/${item.id}`)}
            className="bg-bg-card rounded-xl p-4 mb-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.4)] cursor-pointer hover:brightness-110 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-text-muted text-[11px] tracking-wide">próximo treino</span>
              <span className="border border-red text-red text-[10px] font-bold tracking-[1px] px-2.5 py-0.5 rounded-full">{item.tipo}</span>
            </div>
            <h4 className="text-white text-base font-bold mb-2.5">{item.nome}</h4>
            <CardStats item={item} />
          </div>
        ))}

        <div className="flex gap-2.5 mt-2">
          <button
            onClick={() => nav('/novo-treino')}
            className="flex-1 h-[50px] bg-red text-white font-[Oswald] text-xs font-bold tracking-[2px] rounded flex items-center justify-center gap-1.5 hover:opacity-85 transition-opacity"
          >
            ➕ NOVO TREINO
          </button>
          <button className="flex-1 h-[50px] border border-red text-red font-[Oswald] text-xs font-bold tracking-[2px] rounded flex items-center justify-center gap-1.5 hover:bg-red/10 transition-colors">
            📈 VER PROGRESSO
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
