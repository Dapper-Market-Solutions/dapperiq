export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400 space-y-1">
      <div>&copy; {new Date().getFullYear()} DapperIQ&trade; &middot; Lead Intelligence Platform</div>
      <div>
        <a href="https://dapperms.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 underline">
          Privacy Policy
        </a>
      </div>
    </footer>
  )
}
