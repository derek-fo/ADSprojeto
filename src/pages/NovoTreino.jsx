import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { getCategorias } from '../api/categorias';
import { criarTreino } from '../api/treinos';

export default function NovoTreino() {
  const nav = useNavigate();
  const { usuario } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [nomeTreino, setNomeTreino] = useState('');
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [repTemp, setRepTemp] = useState('');
  const [seriesTemp, setSeriesTemp] = useState('');
  const [pesoTemp, setPesoTemp] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (e) { console.error(e); }
    }
    carregar();
  }, []);

  function handleAdicionarEx(nomeDoExercicio) {
    if (!repTemp || !pesoTemp || !seriesTemp) return alert('Preencha todas as informações!');
    setExerciciosSelecionados([...exerciciosSelecionados, { 
      id: Date.now(), nome: nomeDoExercicio, reps: repTemp, peso: pesoTemp, series: seriesTemp, descanso: '1min.', concluido: false 
    }]);
    setRepTemp(''); setPesoTemp(''); setSeriesTemp('');
  }

  async function handleSalvarTreino() {
    if (!nomeTreino) return alert('Dê um nome ao treino!');
    try {
      await criarTreino({
        usuarioId: usuario.usuarioId,
        nome: nomeTreino,
        tipo: 'PERSONALIZADO',
        duracao: exerciciosSelecionados.length * 10,
        exercicios: exerciciosSelecionados
      });
      nav('/treinos');
    } catch (e) { alert(e.message); }
  }

  return (
    <div className="min-h-screen bg-bg text-text-light p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        
        <header className="flex items-center justify-between border-b border-line pb-4">
          <button onClick={() => nav(-1)} className="text-text-muted text-xs hover:text-white uppercase font-bold">← Voltar</button>
          <h1 className="text-white font-[Oswald] text-xl font-bold uppercase tracking-[3px]">Monte seu treino</h1>
          <div className="w-10" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-bg-card p-5 rounded-xl border border-line">
              <label className="block text-text-muted text-[10px] font-bold uppercase mb-2">Nome do Treino</label>
              <input
                type="text"
                placeholder="Ex: Treino de Costas Pesado"
                value={nomeTreino}
                onChange={e => setNomeTreino(e.target.value)}
                className="w-full bg-bg-darker text-white p-3 rounded border border-line focus:border-red outline-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-white font-[Oswald] text-sm font-bold uppercase tracking-wider">Categorias</h3>
              <div className="grid grid-cols-1 gap-2">
                {categorias.map(cat => (
                  <div key={cat.id} className="bg-bg-card border border-line rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold">{cat.nome}</p>
                      <p className="text-[10px] text-text-muted uppercase">{cat.qtd} exercícios</p>
                    </div>
                    <button onClick={() => setCategoriaAtiva(cat)} className="bg-red text-white text-[10px] font-bold px-4 py-2 rounded-lg uppercase">Ver</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-red font-[Oswald] text-sm font-bold uppercase tracking-wider">Exercícios Selecionados ({exerciciosSelecionados.length})</h3>
             <div className="bg-bg-card border border-line rounded-xl p-4 min-h-[200px] space-y-3">
                {exerciciosSelecionados.length === 0 && <p className="text-text-muted text-center text-xs py-10">Nenhum exercício adicionado ainda.</p>}
                {exerciciosSelecionados.map(ex => (
                  <div key={ex.id} className="bg-bg-darker p-3 rounded-lg flex justify-between items-center border border-line">
                    <div>
                      <p className="text-white text-sm font-bold">{ex.nome}</p>
                      <p className="text-[10px] text-text-muted">{ex.reps} Reps / {ex.peso}</p>
                    </div>
                    <button onClick={() => setExerciciosSelecionados(list => list.filter(i => i.id !== ex.id))} className="text-red font-bold text-[10px]">REMOVER</button>
                  </div>
                ))}
             </div>
             <button onClick={handleSalvarTreino} className="w-full bg-red text-white font-[Oswald] py-4 rounded-xl font-bold tracking-[2px] hover:opacity-90 transition-opacity uppercase">
                Salvar Treino Completo
             </button>
          </div>
        </div>
      </div>

      {categoriaAtiva && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-bg-card border border-line p-6 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-4 border-b border-line pb-2">
                <h3 className="text-white font-[Oswald] font-bold uppercase">{categoriaAtiva.nome}</h3>
                <button onClick={() => setCategoriaAtiva(null)} className="text-text-muted">Fechar</button>
             </div>
             <div className="space-y-4">
                {categoriaAtiva.exercicios.map((ex, i) => (
                  <div key={i} className="bg-bg-darker p-3 rounded-xl border border-line">
                    <p className="text-white text-sm font-bold mb-3">{ex}</p>
                    <div className="flex gap-2">
                       <input placeholder="Séries" value={seriesTemp} onChange={e=>setSeriesTemp(e.target.value)} className="w-1/3 bg-bg p-2 rounded text-xs border border-line" />
                       <input placeholder="Reps" value={repTemp} onChange={e=>setRepTemp(e.target.value)} className="w-1/3 bg-bg p-2 rounded text-xs border border-line" />
                       <input placeholder="Kg/min." value={pesoTemp} onChange={e=>setPesoTemp(e.target.value)} className="w-1/3 bg-bg p-2 rounded text-xs border border-line" />
                       <button onClick={() => handleAdicionarEx(ex)} className="w-1/3 bg-red text-white text-[10px] font-bold rounded">Adicionar</button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}