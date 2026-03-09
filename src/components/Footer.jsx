export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white/60 py-6 text-center text-xs text-gray-400 space-y-1.5 mt-8">
      <div className="font-medium text-gray-500">DapperIQ&trade; &mdash; Lead Intelligence Platform</div>
      <div className="flex items-center justify-center gap-4">
        <span>&copy; {new Date().getFullYear()} Dapper Market Solutions LLC</span>
        <span className="text-gray-200">|</span>
        <a href="https://dapperms.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 underline transition">
          Privacy Policy
        </a>
      </div>
    </footer>
  )
}
