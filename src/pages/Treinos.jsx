import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { getProximosTreinos } from "../api/treinos"; // Utilize o endpoint que lista todos do usuário
import { Plus, Dumbbell } from "lucide-react";

export default function Treinos() {
  const nav = useNavigate();
  const { usuario } = useAuth();
  const [listaTreinos, setListaTreinos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarTodosOsTreinos() {
      setCarregando(true);
      setErro("");
      try {
        const data = await getProximosTreinos(usuario.usuarioId);
        setListaTreinos(data);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    }
    buscarTodosOsTreinos();
  }, [usuario.usuarioId]);

  return (
   <div className="min-h-screen bg-bg text-text-light p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        
        <header className="flex items-center justify-between border-b border-line pb-4 relative">
          <span className="text-white font-[Oswald] text-2xl font-bold tracking-[3px] uppercase">Seus treinos</span>
          <button
            onClick={() => nav("/novo-treino")}
            className="h-[26px] px-4 bg-red text-white font-[Oswald] text-xs font-bold tracking-[1px] rounded flex items-center justify-center gap-1.5 hover:opacity-85 transition-opacity uppercase self-start sm:self-auto"
          >
            <Plus size={16} /> Novo Treino
          </button>
        </header>

        {erro && (
          <p className="bg-red/10 border border-red text-red text-xs rounded px-3 py-2 text-center">
            {erro}
          </p>
        )}

        {carregando && (
          <p className="text-text-muted text-sm text-center">
            Carregando sua biblioteca de treinos...
          </p>
        )}

        {!carregando && listaTreinos.length === 0 && (
          <div className="bg-bg-card border border-line rounded-xl p-8 text-center space-y-3">
            <Dumbbell
              className="mx-auto text-text-muted opacity-40"
              size={40}
            />
            <p className="text-text-muted text-sm max-w-sm mx-auto">
              Nenhum treino cadastrado até o momento. Comece criando uma rotina
              personalizada de musculação ou funcional.
            </p>
          </div>
        )}

        {!carregando && listaTreinos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {listaTreinos.map((treino) => (
              <div
                key={treino.id}
                onClick={() => nav(`/treino/${treino.id}`)}
                className="bg-bg-card border border-line rounded-xl p-5 flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.4)] cursor-pointer hover:border-red transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold tracking-[1px] border border-red text-red px-2 py-0.5 rounded-full uppercase">
                      {treino.tipo}
                    </span>
                    <span className="text-[11px] text-text-muted group-hover:text-white transition-colors">
                      Ver Ficha →
                    </span>
                  </div>
                  <h3 className="text-white text-lg font-bold mb-4 line-clamp-1 group-hover:text-red transition-colors">
                    {treino.nome}
                  </h3>
                </div>

                <div className="flex justify-between items-center border-t border-line/60 pt-3 text-xs text-text-muted">
                  <span>⏱ {treino.duracao} min</span>
                  <span>💪 {treino.exercicios?.length || 0} Exs</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
