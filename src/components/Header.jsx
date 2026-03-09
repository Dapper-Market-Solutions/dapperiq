export default function Header({ clientName, onLogoClick }) {
  return (
    <header className="bg-gradient-to-r from-navy-900 to-navy-700 text-white border-b-2 border-gold-400/60 shadow-md">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-3 hover:opacity-80 transition">
          <img src="/logo.png" alt="DMS" className="h-8 brightness-0 invert" />
          <div className="h-5 w-px bg-white/30" />
          <span className="font-semibold text-lg tracking-tight">DapperIQ<sup className="text-[9px] align-super ml-0.5">TM</sup></span>
        </button>
        {clientName && (
          <span className="text-sm bg-white/10 text-white px-3 py-1 rounded-full border border-white/20">
            {clientName}
          </span>
        )}
      </div>
    </header>
  )
}
