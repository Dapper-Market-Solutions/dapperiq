export default function Header({ clientName, onLogoClick }) {
  return (
    <header className="bg-navy-800 text-white">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-3 hover:opacity-80 transition">
          <img src="/logo.png" alt="DMS" className="h-8 brightness-0 invert" />
          <div className="h-5 w-px bg-white/30" />
          <span className="font-semibold text-lg tracking-tight">DapperIQ<sup className="text-[9px] align-super ml-0.5">TM</sup></span>
        </button>
        {clientName && (
          <span className="text-sm text-navy-200">{clientName}</span>
        )}
      </div>
    </header>
  )
}
