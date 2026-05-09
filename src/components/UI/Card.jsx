export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#13151f] border border-[#2a2d3e] rounded-xl p-5 ${className}`}>
      {children}
    </div>
  );
}
