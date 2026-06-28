import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { atualizarUsuario, excluirUsuario } from "../api/usuarios";
import BottomNav from "../components/BottomNav";

const ABAS = [
  { id: "perfil", label: "Perfil e Conta" },
  { id: "vincularcontas", label: "Vincular Contas" },
  { id: "notificacoes", label: "Notificações" },
  { id: "feedback", label: "Feedback" },
  { id: "ajudaesuporte", label: "Ajuda e Suporte" },
  { id: "logout", label: "Logout" },
];

export default function Config() {
  const nav = useNavigate();
  const { usuario, logout } = useAuth();

  const [tabAtiva, setTabAtiva] = useState("");
  const [viewMobile, setViewMobile] = useState("menu");

  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function handleSalvarNome() {
    if (nome.trim() === "")
      return setMensagem("O nome do perfil não pode estar vazio!");
    try {
      await atualizarUsuario(usuario.usuarioId, { nome });
      setMensagem(`Nome alterado para: ${nome}`);
    } catch (e) {
      setMensagem(e.message);
    }
  }

  async function handleSalvarEmail() {
    if (email.trim() === "")
      return setMensagem("O e-mail não pode estar vazio!");
    try {
      await atualizarUsuario(usuario.usuarioId, { email });
      setMensagem(`E-mail alterado para: ${email}`);
    } catch (e) {
      setMensagem(e.message);
    }
  }

  async function handleAlterarSenha() {
    if (senhaAtual === "" || novaSenha === "")
      return setMensagem("Preencha a senha atual e a nova senha!");
    try {
      await atualizarUsuario(usuario.usuarioId, { senha: novaSenha });
      setMensagem("Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
    } catch (e) {
      setMensagem(e.message);
    }
  }

  function handleLogout() {
    if (window.confirm("Tem certeza que deseja sair da sua conta?")) {
      logout();
      nav("/login");
    }
  }

  async function handleExcluirConta() {
    if (
      window.confirm(
        "Tem certeza absoluta que deseja excluir sua conta? Esta ação não pode ser desfeita.",
      )
    ) {
      try {
        await excluirUsuario(usuario.usuarioId);
        logout();
        nav("/login");
      } catch (e) {
        setMensagem(e.message);
      }
    }
  }

  function selecionarAba(id) {
    setTabAtiva(id);
    setViewMobile("content");
    setMensagem("");
  }

  return (
    <div className="min-h-screen bg-bg text-text-light p-4 md:p-8 pb-20">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
        <div
          className={`w-full md:w-1/4 bg-bg-card border border-line p-4 rounded-xl h-fit space-y-2 ${viewMobile === "menu" ? "block" : "hidden"} md:block`}
        >
          <button
            onClick={() => nav("/inicio")}
            className="text-xs text-text-muted hover:text-white mb-6 block font-semibold uppercase tracking-wide transition-colors"
          >
            ← Voltar pro Início
          </button>

          <h3 className="text-text-muted text-xs font-bold uppercase tracking-wide px-2 mb-4">
            Configurações
          </h3>

          <nav className="flex flex-col gap-2">
            {ABAS.map((aba) => (
              <button
                key={aba.id}
                onClick={() => selecionarAba(aba.id)}
                className={`w-full text-left px-4 py-3 rounded text-sm font-medium transition-all
                  ${
                    tabAtiva === aba.id
                      ? "bg-bg-darker text-white border-l-4 border-red"
                      : "text-text-muted hover:bg-bg-darker/60 hover:text-white"
                  }`}
              >
                {aba.label}
              </button>
            ))}
          </nav>
        </div>

        <div
          className={`flex-1 bg-bg-card border border-line p-6 rounded-xl space-y-6 ${viewMobile === "content" ? "block" : "hidden"} md:block`}
        >
          <button
            onClick={() => setViewMobile("menu")}
            className="md:hidden text-xs text-text-muted hover:text-white mb-2 block font-semibold uppercase tracking-wide transition-colors"
          >
            ← Voltar para Opções
          </button>

          {mensagem && (
            <p className="bg-red/10 border border-red text-red text-xs rounded px-3 py-2 text-center">
              {mensagem}
            </p>
          )}

          {!tabAtiva && (
            <div className="text-center py-20 space-y-3">
              <h2 className="text-white font-[Oswald] text-2xl font-bold uppercase tracking-wide">
                Suas Configurações
              </h2>
              <p className="text-sm text-text-muted max-w-md mx-auto">
                Selecione uma das opções no menu lateral para gerenciar os dados
                do seu perfil, notificações, segurança e preferências de conta.
              </p>
            </div>
          )}

          {tabAtiva === "perfil" && (
            <>
              <div>
                <h2 className="text-white font-[Oswald] text-xl font-bold uppercase tracking-wide">
                  Minha Conta
                </h2>
                <p className="text-xs text-text-muted mt-1">
                  Gerencie suas informações de perfil, e-mail e credenciais de
                  acesso.
                </p>
              </div>

              <div className="border-t border-line pt-4 space-y-2">
                <label className="text-text-muted text-xs block font-semibold uppercase">
                  Nome do Perfil
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="flex-1 bg-bg-darker text-white p-2 rounded border border-line focus:outline-none focus:border-red text-sm transition-colors"
                  />
                  <button
                    onClick={handleSalvarNome}
                    className="bg-red hover:opacity-85 text-white font-semibold py-2 px-4 rounded text-xs uppercase transition-opacity sm:w-32 shrink-0"
                  >
                    Salvar
                  </button>
                </div>
              </div>

              <div className="border-t border-line pt-4 space-y-2">
                <label className="text-text-muted text-xs block font-semibold uppercase">
                  Endereço de E-mail
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-bg-darker text-white p-2 rounded border border-line focus:outline-none focus:border-red text-sm transition-colors"
                  />
                  <button
                    onClick={handleSalvarEmail}
                    className="bg-red hover:opacity-85 text-white font-semibold py-2 px-4 rounded text-xs uppercase transition-opacity sm:w-32 shrink-0"
                  >
                    Alterar
                  </button>
                </div>
              </div>

              <div className="border-t border-line pt-4 space-y-2">
                <label className="text-text-muted text-xs block font-semibold uppercase">
                  Trocar Senha
                </label>
                <div className="flex flex-col sm:flex-row gap-2 items-end">
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="password"
                      placeholder="Senha Atual"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      className="w-full bg-bg-darker text-white p-2 rounded border border-line focus:outline-none focus:border-red text-sm transition-colors"
                    />
                    <input
                      type="password"
                      placeholder="Nova Senha"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      className="w-full bg-bg-darker text-white p-2 rounded border border-line focus:outline-none focus:border-red text-sm transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleAlterarSenha}
                    className="bg-red hover:opacity-85 text-white font-semibold py-2 px-4 rounded text-xs uppercase transition-opacity h-fit sm:w-32 shrink-0"
                  >
                    Atualizar
                  </button>
                </div>
              </div>

              <div className="border-t border-line pt-6">
                <div className="bg-red-dark/10 border border-red-dark/40 p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-red uppercase">
                      Zona de Perigo
                    </h4>
                    <p className="text-xs text-text-muted">
                      Ao excluir sua conta, todos os seus treinos e históricos
                      salvos serão apagados permanentemente.
                    </p>
                  </div>
                  <button
                    onClick={handleExcluirConta}
                    className="bg-transparent border border-red text-red hover:bg-red hover:text-white font-semibold py-2 px-4 rounded text-xs uppercase tracking-wide transition-all whitespace-nowrap w-full sm:w-auto text-center"
                  >
                    Excluir Conta
                  </button>
                </div>
              </div>
            </>
          )}

          {tabAtiva === "vincularcontas" && (
            <Placeholder texto="Vinculação de Contas" />
          )}
          {tabAtiva === "notificacoes" && <Placeholder texto="Notificações" />}
          {tabAtiva === "feedback" && <Placeholder texto="Feedback" />}
          {tabAtiva === "ajudaesuporte" && (
            <Placeholder texto="Ajuda e Suporte" />
          )}

          {tabAtiva === "logout" && (
            <div className="border-t border-line pt-6">
              <div className="bg-red-dark/10 border border-red-dark/40 p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-red uppercase">
                    Quer sair da sua conta?
                  </h4>
                  <p className="text-xs text-text-muted">
                    Você pode fazer logout da sua conta para proteger suas
                    informações pessoais. Ao clicar em "Logout", você será
                    desconectado.
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-transparent border border-red text-red hover:bg-red hover:text-white font-semibold py-2 px-4 rounded text-xs uppercase tracking-wide transition-all whitespace-nowrap w-full sm:w-auto text-center"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function Placeholder({ texto }) {
  return (
    <div className="text-center py-12 text-text-muted text-sm">
      Tela de configurações de {texto} (em desenvolvimento).
    </div>
  );
}
