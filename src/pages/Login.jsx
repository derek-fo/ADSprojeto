import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdsLogo from '../assets/icons/adslogo.png';
import googleIcon from '../assets/icons/googleicon.png';
import appleIcon from '../assets/icons/appleicon.png';
import stravaIcon from '../assets/icons/stravaicon.png';
import eyeOpenIcon from '../assets/icons/eyeopen.svg';
import eyeClosedIcon from '../assets/icons/eyeclosed.svg';
import { useAuth } from '../context/AuthContext';
import { SocialBtn } from '../components/SocialBtn';

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [show,  setShow]  = useState(false);
  const [erro,  setErro]  = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    setErro('');
    setCarregando(true);
    try {
      await login(email, senha);
      nav('/inicio');
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="w-full max-w-[430px] mx-auto px-5 flex flex-col flex-1">

        <div className="flex justify-center py-6">
          <img src={AdsLogo} alt="ADS Logo" className="w-32 h-auto" />
        </div>

        <h2 className="text-text-light font-[Oswald] text-lg font-bold tracking-[4px] text-center mb-7 uppercase">
          Entre com a sua conta
        </h2>

        {erro && (
          <p className="bg-red/10 border border-red text-red text-xs rounded px-3 py-2 mb-4 text-center">
            {erro}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-text-muted text-xs mb-1">E-mail</label>
          <div className="border-b border-line-lt focus-within:border-red transition-colors">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full text-white text-sm py-1.5 bg-transparent"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-text-muted text-xs mb-1">Senha</label>
          <div className="flex items-center border-b border-line-lt focus-within:border-red transition-colors">
            <input
              type={show ? 'text' : 'password'}
              value={senha}
              onChange={e => setSenha(e.target.value)}
              className="flex-1 text-white text-sm py-1.5 bg-transparent"
            />
            <button onClick={() => setShow(v => !v)} className="text-base pl-2">
              {show ? <img src={eyeClosedIcon} alt="Esconder senha" className="w-5 h-5 object-contain brightness-0 invert opacity-40" /> : <img src={eyeOpenIcon} alt="Mostrar senha" className="w-5 h-5 object-contain brightness-0 invert opacity-40" />}
            </button>
          </div>
          <div className="flex justify-end mt-2">
            <Link to="/reset-senha" className="text-red text-xs hover:underline">
              Esqueci minha senha
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2 mb-7">
          <button
            onClick={handleLogin}
            disabled={carregando}
            className="w-full h-[50px] bg-red text-white font-[Oswald] text-base font-bold tracking-[6px] rounded hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            {carregando ? '...' : 'LOGIN'}
          </button>
          <button
            onClick={() => nav('/nova-conta')}
            className="w-full h-[50px] border border-red text-red font-[Oswald] text-base font-bold tracking-[5px] rounded hover:bg-red/10 transition-colors"
          >
            CRIAR CONTA
          </button>
        </div>

        <div className="flex flex-col gap-3 pb-10">
          <SocialBtn icon={googleIcon} label="ENTRE COM UMA CONTA GOOGLE" />
          <SocialBtn icon={appleIcon} label="ENTRE COM UMA CONTA APPLE" />
          <SocialBtn icon={stravaIcon} label="ENTRE COM UMA CONTA STRAVA" />
        </div>

      </div>
    </div>
  );
}
