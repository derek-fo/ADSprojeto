import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const ATIVIDADES = [
  { id: 'corrida',  label: 'Iniciar Corrida', emoji: '🏃‍♂️', cor: 'border-red' },
  { id: 'treino',    label: 'Treino',           emoji: '💪', cor: 'border-red' },
  { id: 'pedalada', label: 'Pedalada',         emoji: '🚴‍♂️', cor: 'border-red' },
  { id: 'natacao',  label: 'Natação',          emoji: '🏊‍♂️', cor: 'border-red' },
  { id: 'trilha',   label: 'Trilha',           emoji: '🥾', cor: 'border-red' },
  { id: 'outro',    label: 'Outro',            emoji: '🔄', cor: 'border-line-lt' },
];

export default function Comecar() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-bg text-text-light p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        
        <header className="border-b border-line pb-4">
          <h1 className="text-white font-[Oswald] text-2xl font-bold tracking-[3px] text-center md:text-left uppercase">
            Começar Atividade
          </h1>
          <p className="text-xs text-text-muted mt-1 text-center md:text-left">
            Selecione a modalidade que vai praticar agora e acompanhe sua evolução em tempo real.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ATIVIDADES.map((atv) => (
            <div
              key={atv.id}
              onClick={() => atv.id === 'treino' ? nav('/treinos') : alert(`Iniciando monitoramento de ${atv.label}...`)}
              className={`bg-bg-card rounded-xl p-5 flex items-center justify-between cursor-pointer border-l-4 ${atv.cor} shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:brightness-125 hover:scale-[1.01] transition-all`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{atv.emoji}</span>
                <div>
                  <h3 className="text-white font-[Oswald] text-lg font-bold uppercase tracking-wide">
                    {atv.label}
                  </h3>
                  <p className="text-[11px] text-text-muted uppercase tracking-wider">
                    Clique para iniciar
                  </p>
                </div>
              </div>
              <span className="text-text-muted font-bold text-xl">›</span>
            </div>
          ))}
        </div>

      </div>
      <BottomNav />
    </div>
  );
}