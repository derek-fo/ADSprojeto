export function CardStats({ item }) {
  return (
    <div className="flex justify-between mt-3">
      {[['Duração', item.duracao + ' min.'], ['Séries', item.exercicios.reduce((s, e) => s + Number(e.series || 0), 0)], ['Exercícios', item.exercicios.length]].map(([l, v]) => (
        <div key={l} className="flex flex-col items-center">
          <span className="text-text-muted text-[10px]">{l}</span>
          <span className="text-white text-xs font-semibold mt-0.5">{v}</span>
        </div>
      ))}
    </div>
  );
}