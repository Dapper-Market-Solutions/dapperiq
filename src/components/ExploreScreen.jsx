import { useState } from 'react'

const INDUSTRIES = [
  {
    id: 'insurance',
    name: 'Insurance',
    icon: '\u{1F6E1}\uFE0F',
    audiences: [
      { id: '82fbc057-e947-49e7-9bfc-6ea91edb099b', name: 'Universal Life Insurance', stateField: 'PERSONAL_STATE' },
      { id: 'c83a2b81-1598-4f20-8500-6d9b939035ca', name: 'Final Expense', stateField: 'PERSONAL_STATE' },
    ],
  },
  {
    id: 'personal-injury',
    name: 'Personal Injury',
    icon: '\u2696\uFE0F',
    audiences: [
      { id: '1be5f858-5504-4a75-8a78-0a8a9ccf3396', name: 'Auto Accidents', stateField: 'PERSONAL_STATE' },
    ],
  },
  {
    id: 'solar',
    name: 'Solar',
    icon: '\u2600\uFE0F',
    audiences: [
      { id: '2c9cdc26-094a-4b1e-8a39-7774506b5d83', name: 'Solar Leads', stateField: 'PERSONAL_STATE' },
    ],
  },
  {
    id: 'mortgage',
    name: 'Mortgage Lenders',
    icon: '\u{1F3E0}',
    audiences: [
      { id: 'f6124cd2-2e05-4078-9cd1-ef86f17906fd', name: 'Mortgage Leads', stateField: 'PERSONAL_STATE' },
    ],
  },
  {
    id: 'golf-carts',
    name: 'Golf Cart Dealers',
    icon: '\u{1F3CC}\uFE0F',
    audiences: [
      { id: '550da214-d24f-4a2e-ac2d-664de71cd87b', name: 'Golf Cart Buyers', stateField: 'PERSONAL_STATE' },
    ],
  },
  {
    id: 'roofing',
    name: 'Roofing & Home Services',
    icon: '\u{1F528}',
    audiences: [],
    comingSoon: true,
  },
]

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
]

const STATE_ABBR = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
  'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
  'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS',
  'Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA',
  'Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT',
  'Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM',
  'New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK',
  'Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
  'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
  'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY',
}

export default function ExploreScreen({ onBack }) {
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [selectedState, setSelectedState] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleExplore() {
    if (!selectedIndustry || !selectedState) return
    const industry = INDUSTRIES.find(i => i.id === selectedIndustry)
    if (!industry || industry.comingSoon) return

    setLoading(true)
    setError(null)
    setResults(null)

    const abbr = STATE_ABBR[selectedState] || selectedState

    try {
      const promises = industry.audiences.map(async (aud) => {
        const res = await fetch('/api/explore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audienceId: aud.id,
            state: abbr,
            stateField: aud.stateField,
          }),
        })
        if (!res.ok) throw new Error(`Failed for ${aud.name}`)
        const data = await res.json()
        return { ...aud, count: data.count, totalNational: data.totalNational }
      })

      const audienceResults = await Promise.all(promises)
      setResults(audienceResults)
    } catch (err) {
      setError('Unable to fetch lead counts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const totalCount = results ? results.reduce((sum, r) => sum + r.count, 0) : 0
  const industry = INDUSTRIES.find(i => i.id === selectedIndustry)

  return (
    <div className="py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-navy-800 mb-2">
          Explore Available Leads
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Choose your industry and state to see how many high-intent leads are available right now.
          We're consistently adding more industries as demand grows.
        </p>
      </div>

      {/* Step 1: Industry */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-navy-700 mb-3 uppercase tracking-wide">
          Step 1 &mdash; Choose Your Industry
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.id}
              onClick={() => { if (!ind.comingSoon) { setSelectedIndustry(ind.id); setResults(null); } }}
              disabled={ind.comingSoon}
              className={`
                relative p-4 rounded-xl border-2 text-center transition-all
                ${ind.comingSoon
                  ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                  : selectedIndustry === ind.id
                    ? 'border-navy-600 bg-navy-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-navy-300 hover:shadow-sm cursor-pointer'
                }
              `}
            >
              <span className="text-2xl block mb-1">{ind.icon}</span>
              <span className={`text-sm font-semibold ${selectedIndustry === ind.id ? 'text-navy-700' : 'text-gray-700'}`}>
                {ind.name}
              </span>
              {ind.comingSoon && (
                <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: State */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-navy-700 mb-3 uppercase tracking-wide">
          Step 2 &mdash; Select Your State
        </label>
        <select
          value={selectedState}
          onChange={(e) => { setSelectedState(e.target.value); setResults(null); }}
          className="w-full max-w-sm px-4 py-3 border border-gray-200 rounded-xl text-gray-900
                     focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent
                     transition bg-white"
        >
          <option value="">Select a state...</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <button
        onClick={handleExplore}
        disabled={!selectedIndustry || !selectedState || loading || (industry && industry.comingSoon)}
        className="w-full max-w-sm py-3 bg-navy-600 text-white font-semibold rounded-xl
                   hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transition flex items-center justify-center gap-2"
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {loading ? 'Searching...' : 'Show Available Leads'}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="mt-10 animate-fade-in">
          <div className="text-sm font-semibold text-navy-700 uppercase tracking-wide mb-4">
            Results for {industry?.name} in {selectedState}
          </div>

          <div className="space-y-3 mb-6">
            {results.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4"
              >
                <div>
                  <div className="font-semibold text-gray-800">{r.name}</div>
                  <div className="text-sm text-gray-400 mt-0.5">
                    {r.totalNational.toLocaleString()} records nationally
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-navy-700">
                    ~{r.count.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">leads in {STATE_ABBR[selectedState]}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Total + CTA */}
          <div className="bg-navy-50 border border-navy-200 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-navy-800 mb-1">
              ~{totalCount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              total high-intent leads available in {STATE_ABBR[selectedState]}
            </div>
            <p className="text-sm text-gray-600 mb-5 max-w-md mx-auto">
              These are real people actively researching {industry?.name.toLowerCase()} right now.
              Book a 15-minute call to see what a sample delivery looks like.
            </p>
            <a
              href="https://bit.ly/dmsinterview"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-3 px-8 bg-navy-600 text-white font-semibold rounded-xl
                         hover:bg-navy-700 transition"
            >
              Book a Call &rarr;
            </a>
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-navy-600 transition"
        >
          &larr; Back to main menu
        </button>
      </div>
    </div>
  )
}
