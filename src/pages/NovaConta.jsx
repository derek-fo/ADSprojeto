import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdsLogo from '../components/AdsLogo';
import { useAuth } from '../context/AuthContext';

const CAMPOS = [
  { key: 'nome',           label: 'Nome',            type: 'text' },
  { key: 'sobrenome',      label: 'Sobrenome',       type: 'text' },
  { key: 'telefone',       label: 'Telefone',        type: 'tel' },
  { key: 'email',          label: 'Email',           type: 'email' },
  { key: 'confirmarEmail', label: 'Confirmar Email', type: 'email' },
  { key: 'senha',          label: 'Senha',           type: 'password' },
  { key: 'confirmarSenha', label: 'Confirmar senha', type: 'password' },
  { key: 'peso',           label: 'Peso (kg)',       type: 'number' },
  { key: 'altura',         label: 'Altura (cm)',     type: 'number' },
];

export default function NovaConta() {
  const nav = useNavigate();
  const { cadastrar } = useAuth();
  const [form, setForm] = useState({});
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleCriarConta() {
    setErro('');

    if (!form.nome || !form.email || !form.senha) {
      setErro('Preencha ao menos nome, e-mail e senha.');
      return;
    }
    if (form.email !== form.confirmarEmail) {
      setErro('Os e-mails não coincidem.');
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setCarregando(true);
    try {
      await cadastrar({
        nome: form.nome,
        sobrenome: form.sobrenome || '',
        email: form.email,
        senha: form.senha,
        telefone: form.telefone || '',
        peso: Number(form.peso) || 0,
        altura: Number(form.altura) || 0,
      });
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

        <div className="flex justify-center pt-6 pb-5">
          <AdsLogo size={100} />
        </div>

        <h2 className="text-text-light font-[Oswald] text-xl font-bold tracking-[4px] text-center mb-6">
          CRIAR CONTA
        </h2>

        {erro && (
          <p className="bg-red/10 border border-red text-red text-xs rounded px-3 py-2 mb-4 text-center">
            {erro}
          </p>
        )}

        {CAMPOS.map(c => (
          <div key={c.key} className="mb-4">
            <label className="block text-text-muted text-xs mb-1">{c.label}</label>
            <div className="border-b border-line-lt focus-within:border-red transition-colors">
              <input
                type={c.type}
                value={form[c.key] || ''}
                onChange={e => setForm(f => ({ ...f, [c.key]: e.target.value }))}
                className="w-full text-white text-sm py-1.5 bg-transparent"
              />
            </div>
          </div>
        ))}

        <div className="mt-6 mb-4">
          <button
            onClick={handleCriarConta}
            disabled={carregando}
            className="w-full h-[50px] bg-red text-white font-[Oswald] text-base font-bold tracking-[6px] rounded hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            {carregando ? '...' : 'CRIAR CONTA'}
          </button>
        </div>

        <p
          onClick={() => nav('/login')}
          className="text-center text-text-muted text-sm pb-10 cursor-pointer hover:text-text-light transition-colors"
        >
          Já tenho conta
        </p>
      </div>
    </div>
  );
}
