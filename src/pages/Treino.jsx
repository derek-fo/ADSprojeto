import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { getTreinoPorId, marcarExercicioConcluido } from '../api/treinos';

export default function Treino() {
  const nav = useNavigate();
  const { id } = useParams();
  const [treino, setTreino] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro('');
      try {
        const data = await getTreinoPorId(id);
        setTreino(data);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  async function toggle(index) {
    const exAtual = treino.exercicios[index];
    const novoEstado = !exAtual.concluido;
    try {
      await marcarExercicioConcluido(id, index, novoEstado);
      setTreino(t => ({
        ...t,
        exercicios: t.exercicios.map((ex, i) => i === index ? { ...ex, concluido: novoEstado } : ex),
      }));
    } catch (e) {
      setErro(e.message);
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted text-sm">Carregando...</p>
      </div>
    );
  }

  if (erro || !treino) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-red text-sm">{erro || 'Treino não encontrado.'}</p>
        <button onClick={() => nav('/inicio')} className="text-text-muted text-xs underline">Voltar ao início</button>
      </div>
    );
  }

  const concluidos = treino.exercicios.filter(e => e.concluido).length;
  const pct = Math.round((concluidos / treino.exercicios.length) * 100);

  return (
    <div className="min-h-screen bg-bg flex flex-col">

      <header className="sticky top-0 z-10 bg-bg flex items-center justify-between px-5 py-3.5">
        <button onClick={() => nav(-1)} className="text-white text-2xl">‹</button>
        <span className="text-white font-[Oswald] text-base font-bold tracking-[3px]">{treino.nome.toUpperCase()}</span>
        <span className="text-text-muted text-sm">{pct}%</span>
      </header>

      <div className="px-5 mb-4">
        <div className="h-1 bg-line rounded-full">
          <div className="h-1 bg-red rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-5 pb-20">
        {treino.exercicios.map((ex, i) => {
          const isDone = ex.concluido;
          return (
            <div
              key={ex.nome + i}
              onClick={() => toggle(i)}
              className={`bg-bg-card rounded-xl p-4 mb-3 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.4)] border-l-4 transition-all hover:brightness-110
                ${isDone ? 'border-line-lt opacity-65' : 'border-red'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-semibold flex-1 ${isDone ? 'text-text-muted line-through' : 'text-white'}`}>
                  {ex.nome}
                </span>
                <span className={`text-[10px] font-bold tracking-wide px-2.5 py-0.5 rounded-full
                  ${isDone ? 'bg-bg-darker text-text-muted border border-line-lt' : 'bg-red text-white'}`}>
                  {isDone ? '✓ FEITO' : 'PENDENTE'}
                </span>
              </div>
              <div className="flex gap-6">
                {[['Peso', ex.peso], ['Reps', ex.reps], ['Séries', ex.series], ['Descanso', ex.descanso]].map(([l, v]) => (
                  <div key={l} className="flex flex-col items-center">
                    <span className="text-text-muted text-[10px]">{l}</span>
                    <span className={`text-xs font-semibold mt-0.5 ${isDone ? 'text-text-muted' : 'text-white'}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
}
