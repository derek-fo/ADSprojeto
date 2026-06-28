import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { getMidias } from "../api/midias";

import configIcon from "../assets/icons/config.svg";

export default function Perfil() {
  const nav = useNavigate();
  const { usuario } = useAuth();
  const [tab, setTab] = useState(0);
  const [midias, setMidias] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const tipo = tab === 0 ? "foto" : "video";
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
    <div className="min-h-screen bg-bg text-text-light p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        <header className="flex items-center justify-between border-b border-line pb-4">
          <span className="text-white font-[Oswald] text-2xl font-bold tracking-[3px] uppercase">
            Meu Perfil
          </span>
          <button
            onClick={() => nav("/config")}
            className="hover:rotate-90 transition-transform duration-300"
          >
            <img src={configIcon} alt="Configurações" className="w-6 h-6" />
          </button>
        </header>

        <div className="bg-bg-card border border-line rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 w-full h-24" />

          <div className="relative z-10">
            <div className="w-24 h-24 rounded-full bg-bg-darker border-4 border-bg flex items-center justify-center text-4xl shadow-xl mb-4">
              👤
            </div>
            <h2 className="text-white font-[Oswald] text-2xl font-bold tracking-[4px] uppercase">
              {usuario.nome}
            </h2>
            <p className="text-text-muted text-xs uppercase tracking-widest mt-1">
              Membro Bronze
            </p>
          </div>

          <div className="flex gap-8 mt-6 relative z-10 border-t border-line pt-6 w-full justify-center">
            <div className="text-center">
              <p className="text-white font-bold">12</p>
              <p className="text-[10px] text-text-muted uppercase">Treinos</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold">850</p>
              <p className="text-[10px] text-text-muted uppercase">
                Seguidores
              </p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold">1.2k</p>
              <p className="text-[10px] text-text-muted uppercase">Pontos</p>
            </div>
          </div>
        </div>

        <div className="flex border-b border-line">
          {["FOTOS", "VÍDEOS"].map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`flex-1 pb-3 font-[Oswald] text-xs font-bold tracking-[2px] border-b-2 transition-colors
                ${tab === i ? "text-white border-red" : "text-text-muted border-transparent"}`}
            >
              {i === 0 ? "🖼" : "🎬"} {t}
            </button>
          ))}
        </div>

        <main className="min-h-[300px]">
          {carregando ? (
            <p className="text-center text-text-muted py-20 uppercase text-[10px] tracking-widest">
              Carregando Galeria...
            </p>
          ) : midias.length === 0 ? (
            <p className="text-center text-text-muted py-20">
              Nenhuma mídia encontrada.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {midias.map((m) => (
                <div
                  key={m.id}
                  className="aspect-square bg-bg-card rounded-2xl overflow-hidden border border-line hover:border-red transition-all cursor-pointer shadow-lg"
                >
                  <img
                    src={m.url}
                    alt=""
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
