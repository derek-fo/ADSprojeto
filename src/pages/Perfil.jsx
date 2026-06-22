import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { getMidias } from '../api/midias';

import configIcon from '../assets/icons/config.svg';

export default function Perfil() {
  const nav = useNavigate();
  const { usuario } = useAuth();
  const [tab, setTab] = useState(0);
  const [midias, setMidias] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro('');
      try {
        const tipo = tab === 0 ? 'foto' : 'video';
        const data = await getMidias(usuario.usuarioId, tipo);
        setMidias(data);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [tab, usuario.usuarioId]);

  return (
    <div className="min-h-screen bg-bg flex flex-col">

      <header className="sticky top-0 z-10 bg-bg flex items-center justify-between px-5 py-3.5">
        <span className="text-white font-[Oswald] text-lg font-bold tracking-[3px]">PERFIL</span>
        <button onClick={() => nav('/config')} className="text-2xl">
          <img src={configIcon} alt="Configurações" />
        </button>
      </header>

      <div className="h-24 bg-bg-card" />

      <div className="flex justify-center -mt-11 mb-2.5">
        <div className="w-[88px] h-[88px] rounded-full bg-bg-card border-[3px] border-bg flex items-center justify-center text-4xl">
          👤
        </div>
      </div>

      <h2 className="text-white font-[Oswald] text-[22px] font-bold tracking-[4px] text-center mb-5">
        {usuario.nome?.toUpperCase()}
      </h2>

      <div className="flex border-b border-line px-5 mb-4">
        {['FOTOS', 'VÍDEOS'].map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`flex-1 pb-2.5 font-[Oswald] text-xs font-bold tracking-[2px] border-b-2 -mb-px flex items-center justify-center gap-1 transition-colors
              ${tab === i ? 'text-white border-red' : 'text-text-muted border-transparent'}`}
          >
            {i === 0 ? '🖼' : '🎬'} {t}
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

        {!carregando && midias.length === 0 && (
          <p className="text-text-muted text-center mt-8">Nenhuma mídia ainda.</p>
        )}

        {!carregando && midias.length > 0 && (
          <div className="grid grid-cols-2 gap-2.5">
            {midias.map(m => (
              <img
                key={m.id}
                src={m.url}
                alt=""
                className="bg-bg-card rounded-xl aspect-square object-cover"
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
