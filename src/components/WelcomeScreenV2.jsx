export default function WelcomeScreenV2({ onCurrentClient, onExplore }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <img src="/logo.png" alt="DMS" className="h-16 mb-10" />

      <div className="text-center mb-10 max-w-xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-800 mb-4 leading-tight">
          What If You Could See Exactly Who&rsquo;s Researching Your Product or Service{' '}
          <span className="underline decoration-gold-400 decoration-2 underline-offset-4">Right Now</span>?
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          Name. Phone number. Email. Home address.
          <br />
          <span className="text-navy-700 font-semibold">
            Not a list of cold contacts.
          </span>{' '}
          Real consumers who are actively in-market for what you sell &mdash; identified and verified within the last 30 days.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3 mb-8">
        <button
          onClick={onCurrentClient}
          className="w-full py-4 bg-navy-600 text-white font-semibold rounded-xl
                     hover:bg-navy-700 transition text-center"
        >
          I&rsquo;m Already a Client &mdash; Let&rsquo;s Go
        </button>

        <button
          onClick={onExplore}
          className="w-full py-4 bg-white text-navy-700 font-semibold rounded-xl
                     border-2 border-navy-200 hover:border-navy-400 hover:bg-navy-50
                     transition text-center"
        >
          Show Me the Data &mdash; Free, No Commitment
        </button>
      </div>

      <div className="max-w-md text-center">
        <p className="text-sm text-gray-500 leading-relaxed">
          In the last 30 days, we&rsquo;ve identified over{' '}
          <span className="font-bold text-navy-700">2 million high-intent consumers</span>{' '}
          actively researching insurance, solar, legal services, home services, medical, marketing, and dozens of other industries across{' '}
          <span className="font-bold underline text-navy-700">every niche in the United States</span>.
        </p>
        <p className="text-sm text-gray-400 mt-3">
          Pick your industry. Pick your state. See the numbers for yourself.
          <br />
          No sales call required. No credit card. Just data.
        </p>
      </div>
    </div>
  )
}
