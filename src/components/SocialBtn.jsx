export function SocialBtn({ icon, label }) {
  return (
    <button className="w-full h-[50px] bg-red rounded flex items-center justify-center gap-2.5 text-white font-[Oswald] text-xs font-bold tracking-[2px] hover:opacity-85 transition-opacity">
      <img src={icon} alt={label} className="w-5 h-5 object-contain brightness-0 invert" />
      <span>{label}</span>
    </button>
  );
}