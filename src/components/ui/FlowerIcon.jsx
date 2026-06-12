export default function FlowerIcon({ size = 48, color = '#F8D7DA', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {[0, 45, 90, 135, 22.5, 67.5, 112.5, 157.5].map((angle, i) => (
        <ellipse
          key={angle}
          cx="50" cy="22" rx="10" ry="19"
          fill={color}
          opacity={i < 4 ? 0.78 : 0.55}
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="13" fill="#F8E7A1" opacity="0.92" />
      <circle cx="50" cy="50" r="7"  fill="#F0B8BF" opacity="0.85" />
    </svg>
  )
}
