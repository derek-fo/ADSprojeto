import { useNavigate } from "react-router-dom";
import AdsLogo from '../assets/icons/adslogo.png';

export default function Splash() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-bg flex flex-col max-w-[430px] mx-auto px-5">
      <div className="flex-1 flex items-center justify-center">
        <img src={AdsLogo} alt="ADS Logo" className="w-32 h-auto" />
      </div>
      <div className="pb-10">
        <button
          onClick={() => nav("/login")}
          className="w-full h-[50px] bg-red text-white font-[Oswald] text-base font-bold tracking-[6px] rounded hover:opacity-85 transition-opacity"
        >
          ENTRAR
        </button>
      </div>
    </div>
  );
}
