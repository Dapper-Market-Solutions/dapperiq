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
      <div className="max-w-2xl mx-auto px-4 leading-relaxed">
        Data is provided for marketing purposes only. Users are solely responsible for compliance with all applicable laws including{' '}
        <a href="https://www.fcc.gov/consumers/guides/stopping-unwanted-calls-texts" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition">TCPA</a>,{' '}
        <a href="https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition">CAN-SPAM</a>,{' '}
        <a href="https://www.ftc.gov/rules/rulemaking-regulatory-reform-proceedings/do-not-call-registry" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition">DNC Registry</a>,{' '}
        <a href="https://oag.ca.gov/privacy/ccpa" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition">CCPA</a>, and{' '}
        <a href="https://www.ftc.gov/legal-library/browse/statutes/fair-credit-reporting-act" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition">FCRA</a>.{' '}
        This data may not be used for credit, employment, or housing screening purposes.
      </div>
    </footer>
  )
}
