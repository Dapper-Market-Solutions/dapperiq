export default function Header({ clientName, onLogoClick }) {
  return (
    <header className="relative bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-3 hover:opacity-80 transition">
          <img src="/logo.png" alt="DMS" className="h-8 brightness-0 invert" />
          <div className="h-5 w-px bg-white/30" />
          <span className="font-semibold text-lg tracking-tight">DapperIQ<sup className="text-[9px] align-super ml-0.5">TM</sup></span>
        </button>
        {clientName ? (
          <span className="text-sm text-navy-200">{clientName}</span>
        ) : (
          <span className="text-xs text-gold-400 tracking-wide hidden sm:block">High-Intent Data, On Demand</span>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-60" />
    </header>
  )
}
