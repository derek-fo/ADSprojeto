import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { Dumbbell, Bike, Waves, Mountain, MoreHorizontal } from "lucide-react";
import runningIcon from "../assets/icons/runningicon.svg";

const ATIVIDADES = [
  {
    id: "corrida",
    label: "Iniciar Corrida",
    icon: () => <img src={runningIcon} alt="Corrida" className="w-6 h-6 brightness-0 invert" />,
    cor: "border-red",
  },
  { id: "treinos", label: "Treinos Salvos", icon: Dumbbell, cor: "border-red" },
  { id: "pedalada", label: "Pedalada", icon: Bike, cor: "border-red" },
  { id: "natacao", label: "Natação", icon: Waves, cor: "border-red" },
  { id: "trilha", label: "Trilha", icon: Mountain, cor: "border-red" },
  { id: "outro", label: "Outro", icon: MoreHorizontal, cor: "border-line-lt" },
];

export default function Comecar() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-bg text-text-light p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto w-full flex flex-col space-y-6">
        <header className="border-b border-line pb-4 text-center md:text-left">
          <h1 className="text-white font-[Oswald] text-2xl font-bold tracking-[3px] uppercase">
            Começar Atividade
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Selecione a modalidade que você vai praticar agora.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ATIVIDADES.map((atv) => {
            const Icone = atv.icon;

            return (
              <div
                key={atv.id}
                onClick={() => nav(`/${atv.id}`)}
                className={`bg-bg-card rounded-xl p-5 flex items-center justify-between cursor-pointer border-l-4 ${atv.cor} shadow-lg hover:brightness-125 transition-all active:scale-[0.99]`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl flex items-center justify-center">
                    <Icone size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-[Oswald] text-lg font-bold uppercase tracking-wide">
                      {atv.label}
                    </h3>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">
                      Clique para iniciar
                    </p>
                  </div>
                </div>
                <span className="text-text-muted text-xl font-bold">›</span>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
