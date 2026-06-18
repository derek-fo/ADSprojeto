export default function AdsLogo({ size = 160 }) {
  const w = size, h = size * 1.1;
  const outer = `${w*.5},${h*.02} ${w*.98},${h*.22} ${w*.82},${h*.95} ${w*.5},${h*1.0} ${w*.18},${h*.95} ${w*.02},${h*.22}`;
  const inner = `${w*.5},${h*.10} ${w*.88},${h*.28} ${w*.75},${h*.88} ${w*.5},${h*.93} ${w*.25},${h*.88} ${w*.12},${h*.28}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polygon points={outer} fill="#101114" stroke="#888" strokeWidth={w * .025} />
      <polygon points={inner} fill="none"   stroke="#888" strokeWidth={w * .012} />
      <text
        x={w / 2} y={h * .62}
        textAnchor="middle"
        fontSize={w * .38}
        fontWeight="bold"
        fill="#DCDCDC"
        fontFamily="Oswald, Impact, Arial Black, sans-serif"
        letterSpacing={w * .01}
      >
        ADS
      </text>
    </svg>
  );
}
