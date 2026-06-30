import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdsLogo from '../assets/icons/adslogo.png';

export default function ResetSenha() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [tel,   setTel]   = useState('');

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="w-full max-w-[430px] mx-auto px-5 flex flex-col flex-1">

        <div className="flex justify-center pt-6 pb-5">
          <img src={AdsLogo} alt="AdsLogo" className="w-24 h-24" />
        </div>

        <h2 className="text-text-light font-[Oswald] text-lg font-bold tracking-[3px] text-center mb-8">
          RECUPERE SUA SENHA
        </h2>

        {[
          { label: 'E-mail',               type: 'email', value: email, set: setEmail },
          { label: 'Número para contato',  type: 'tel',   value: tel,   set: setTel   },
        ].map(f => (
          <div key={f.label} className="mb-4">
            <label className="block text-text-muted text-xs mb-1">{f.label}</label>
            <div className="border-b border-line-lt focus-within:border-red transition-colors">
              <input
                type={f.type}
                value={f.value}
                onChange={e => f.set(e.target.value)}
                className="w-full text-white text-sm py-1.5 bg-transparent"
              />
            </div>
          </div>
        ))}

        <div className="mt-6 mb-4">
          <button className="w-full h-[50px] bg-red text-white font-[Oswald] text-base font-bold tracking-[6px] rounded hover:opacity-85 transition-opacity">
            ENVIAR
          </button>
        </div>

        <p
          onClick={() => nav('/login')}
          className="text-center text-text-muted text-sm cursor-pointer hover:text-text-light transition-colors pb-10"
        >
          Voltar ao login
        </p>
      </div>
    </div>
  );
}
