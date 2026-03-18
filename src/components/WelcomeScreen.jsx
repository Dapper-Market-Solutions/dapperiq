export default function WelcomeScreen({ onCurrentClient, onExplore }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <img src="/logo.png" alt="DMS" className="h-16 mb-8" />

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-navy-800 mb-2">
          Welcome to DapperIQ<sup className="text-lg align-super ml-0.5">TM</sup>
        </h1>
        <p className="text-gray-500">High-intent consumer data <span className="font-bold underline text-navy-700">across every industry and niche in the United States</span> &mdash; delivered on demand.</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={onCurrentClient}
          className="w-full py-4 bg-navy-600 text-white font-semibold rounded-xl
                     hover:bg-navy-700 transition text-center"
        >
          I'm a Current Client
        </button>

        <button
          onClick={onExplore}
          className="w-full py-4 bg-white text-navy-700 font-semibold rounded-xl
                     border-2 border-navy-200 hover:border-navy-400 hover:bg-navy-50
                     transition text-center"
        >
          I'm New &mdash; Explore Available Data
        </button>
      </div>

      <p className="text-sm text-gray-400 mt-6 text-center max-w-sm">
        We have data on virtually any audience you can think of &mdash; insurance, solar, legal, home services, medical, marketing, and more. Choose "Explore" to see what's available in your state.
      </p>
    </div>
  )
}
