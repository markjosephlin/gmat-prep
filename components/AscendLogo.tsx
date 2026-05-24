export default function AscendLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#16a34a" />
      {/* Left leg of A */}
      <path d="M 5 27 L 16 9" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
      {/* Right leg of A */}
      <path d="M 27 27 L 16 9" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
      {/* Crossbar */}
      <path d="M 10 20 L 22 20" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      {/* Arrow stem upward from peak */}
      <path d="M 16 9 L 16 4" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      {/* Arrow head */}
      <path d="M 13 6.5 L 16 2.5 L 19 6.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
