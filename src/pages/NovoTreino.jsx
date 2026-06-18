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
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  const [nomeTreino, setNomeTreino] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState([]);

  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [repTemp, setRepTemp] = useState('');
  const [pesoTemp, setPesoTemp] = useState('');

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro('');
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  function handleAdicionarEx(nomeDoExercicio) {
    if (repTemp === '' || pesoTemp === '') {
      alert('Por favor, preencha as Repetições e o Peso antes de adicionar!');
      return;
    }
    setExerciciosSelecionados(list => [
      ...list,
      { id: Date.now(), nome: nomeDoExercicio, reps: repTemp, peso: pesoTemp, series: 1, descanso: '1min.', concluido: false },
    ]);
    setRepTemp('');
    setPesoTemp('');
  }

  async function handleSalvarTreino() {
    if (nomeTreino.trim() === '') {
      alert('Dê um nome ao seu treino antes de salvar!');
      return;
    }
    if (exerciciosSelecionados.length === 0) {
      alert('Adicione pelo menos um exercício ao treino!');
      return;
    }

    try {
      await criarTreino({
        usuarioId: usuario.usuarioId,
        nome: nomeTreino,
        tipo: 'PERSONALIZADO',
        duracao: exerciciosSelecionados.length * 10,
        exercicios: exerciciosSelecionados.map(({ nome, reps, peso, series, descanso, concluido }) => ({ nome, reps, peso, series, descanso, concluido })),
      });
      nav('/inicio');
    } catch (e) {
      setErro(e.message);
    }
  }

  const categoriasFiltradas = categorias.filter(cat =>
    filtroCategoria === '' ? true : cat.id === filtroCategoria
  );

  return (
    <div className="min-h-screen bg-bg flex flex-col">

      <header className="sticky top-0 z-10 bg-bg px-5 py-3.5 flex items-center justify-between">
        <button onClick={() => nav('/inicio')} className="text-text-muted text-xs font-semibold hover:text-white transition-colors">
          Voltar
        </button>
        <h1 className="text-white font-[Oswald] text-lg font-bold tracking-[3px] text-center">MONTE SEU TREINO</h1>
        <span className="w-10" />
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-24">

        {erro && (
          <p className="bg-red/10 border border-red text-red text-xs rounded px-3 py-2 mb-4 text-center">
            {erro}
          </p>
        )}

        <div className="mb-5">
          <label className="block text-text-muted text-xs mb-1.5">Nome do Treino</label>
          <input
            type="text"
            placeholder="Ex: Costas / Pernas / Full-Body"
            value={nomeTreino}
            onChange={e => setNomeTreino(e.target.value)}
            className="w-full bg-bg-card text-white text-sm p-2.5 rounded border border-line focus:outline-none focus:border-red transition-colors"
          />
        </div>

        {carregando && <p className="text-text-muted text-sm">Carregando categorias...</p>}

        {!carregando && (
          <>
            <div className="mb-6">
              <p className="text-text-muted text-xs font-semibold mb-2">Tipo de exercício</p>
              <div className="flex flex-wrap gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-text-light hover:text-white transition-colors">
                  <input type="radio" name="filtro" checked={filtroCategoria === ''} onChange={() => setFiltroCategoria('')} className="accent-red" />
                  Todas
                </label>
                {categorias.map(c => (
                  <label key={c.id} className="flex items-center gap-1.5 cursor-pointer text-text-light hover:text-white transition-colors">
                    <input
                      type="radio"
                      name="filtro"
                      checked={filtroCategoria === c.id}
                      onChange={() => setFiltroCategoria(c.id)}
                      className="accent-red"
                    />
                    {c.nome}
                  </label>
                ))}
              </div>
            </div>

            {exerciciosSelecionados.length > 0 && (
              <div className="mb-6">
                <p className="text-red text-xs font-bold uppercase tracking-wide mb-2">Exercícios no Treino</p>
                <div className="flex flex-col gap-2">
                  {exerciciosSelecionados.map(ex => (
                    <div key={ex.id} className="bg-bg-card border border-line p-3 rounded-lg flex justify-between items-center text-sm">
                      <div>
                        <p className="text-white font-semibold">{ex.nome}</p>
                        <p className="text-text-muted text-xs">{ex.reps} repetições · {ex.peso} kg</p>
                      </div>
                      <button
                        onClick={() => setExerciciosSelecionados(list => list.filter(i => i.id !== ex.id))}
                        className="text-xs text-red font-semibold hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-text-muted text-xs font-semibold uppercase mb-2">Categorias</p>
            <div className="flex flex-col gap-2.5">
              {categoriasFiltradas.map(cat => (
                <div key={cat.id} className="bg-bg-card border border-line rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-base">{cat.nome}</p>
                    <p className="text-text-muted text-xs">{cat.qtd} exercícios</p>
                  </div>
                  <button
                    onClick={() => setCategoriaAtiva(cat)}
                    className="bg-red hover:opacity-85 text-white font-semibold py-1.5 px-4 rounded text-xs uppercase tracking-wide transition-opacity"
                  >
                    Ver
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleSalvarTreino}
              className="w-full bg-red hover:opacity-85 text-white font-[Oswald] font-bold py-3 rounded uppercase text-sm tracking-[3px] transition-opacity mt-6"
            >
              Salvar Treino Completo
            </button>
          </>
        )}
      </main>

      {categoriaAtiva && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]">
          <div className="bg-bg-card border border-line p-5 rounded-xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-line pb-3 mb-4">
              <div>
                <h3 className="text-white font-[Oswald] text-lg font-bold uppercase tracking-wide">Escolha os Exercícios</h3>
                <p className="text-xs text-text-muted">
                  Categoria: <span className="text-red font-semibold">{categoriaAtiva.nome}</span>
                </p>
              </div>
              <button
                onClick={() => setCategoriaAtiva(null)}
                className="text-xs bg-bg-darker border border-line px-2.5 py-1 rounded text-text-muted hover:text-white transition-colors font-semibold uppercase"
              >
                Fechar
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {categoriaAtiva.exercicios.map((nomeEx, i) => (
                <div key={i} className="bg-bg-darker border border-line p-3.5 rounded-lg space-y-2.5">
                  <p className="text-white font-semibold text-sm">{nomeEx}</p>
                  <div className="flex items-end gap-2 text-xs">
                    <div className="w-1/3">
                      <label className="text-text-muted block mb-1">Repetições</label>
                      <input
                        type="text"
                        placeholder="8-12"
                        value={repTemp}
                        onChange={e => setRepTemp(e.target.value)}
                        className="w-full bg-bg-card border border-line p-1.5 rounded text-white text-center focus:outline-none focus:border-red transition-colors"
                      />
                    </div>
                    <div className="w-1/3">
                      <label className="text-text-muted block mb-1">Peso (kg) / Tempo</label>
                      <input
                        type="text"
                        placeholder="20 ou 1min."
                        value={pesoTemp}
                        onChange={e => setPesoTemp(e.target.value)}
                        className="w-full bg-bg-card border border-line p-1.5 rounded text-white text-center focus:outline-none focus:border-red transition-colors"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAdicionarEx(nomeEx)}
                      className="w-1/3 bg-red hover:opacity-85 text-white font-semibold py-1.5 rounded uppercase tracking-wide transition-opacity"
                    >
                      Adicionar
                    </button>
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
