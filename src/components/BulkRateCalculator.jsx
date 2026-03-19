import { useState } from "react";

const NAVY = "#00427c";
const GOLD = "#ffcb05";
const COMPETITOR_RATE = 0.15;

const TIERS = [
  {
    label: "Small Volume",
    badge: "Test the waters",
    range: "30,000 – 99,999",
    volLabel: "30K – 99K",
    price: 0.25,
    min: 30000,
    max: 99000,
    default: 50000,
    note: "Above standard market rate — intentional. Small volume costs more to manage. Use this tier to validate before scaling.",
  },
  {
    label: "Partner Entry",
    badge: "Recommended",
    range: "100,000 – 149,999",
    volLabel: "100K – 149K",
    price: 0.15,
    min: 100000,
    max: 149000,
    default: 100000,
    recommended: true,
    note: "Matches the standard market rate — but with behavioral intent scoring behind every record. Same price, completely different product.",
  },
  {
    label: "Growth",
    badge: "Natural next step",
    range: "150,000 – 249,999",
    volLabel: "150K – 249K",
    price: 0.13,
    min: 150000,
    max: 249000,
    default: 200000,
    note: "2 cents below standard publisher rates. Every record is intent-scored — people whose buying activity spiked in the last 7 days.",
  },
  {
    label: "Scale",
    badge: "Volume reward",
    range: "250,000 – 399,999",
    volLabel: "250K – 399K",
    price: 0.11,
    min: 250000,
    max: 399000,
    default: 300000,
    note: "Pipeline at scale. Cost per closed deal keeps dropping as volume goes up.",
  },
  {
    label: "Dominator",
    badge: "Full footprint",
    range: "400,000 – 999,999",
    volLabel: "400K – 999K",
    price: 0.10,
    min: 400000,
    max: 999000,
    default: 500000,
    note: "Maximum coverage at the best rate. Intent-scored records at scale — everyone actively in a buying cycle right now.",
  },
  {
    label: "Enterprise",
    badge: "Best rate — final price",
    range: "1,000,000+",
    volLabel: "1M+",
    price: 0.10,
    min: 1000000,
    max: 5000000,
    default: 1000000,
    enterprise: true,
    note: "One million records or more per month. 10 cents is the floor — no exceptions. At this volume you're running a full nationwide pipeline machine.",
  },
];

function fmt(n) {
  return "$" + Math.round(n).toLocaleString();
}
function fmtRecords(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toLocaleString();
}
function fmtRecordsFull(n) {
  return n.toLocaleString();
}
function fmtPct(n) {
  return (n * 100).toFixed(2) + "%";
}

function TierCard({ tier, index, isSelected, onClick }) {
  const diffNum = parseFloat(((tier.price - COMPETITOR_RATE) * 100).toFixed(0));
  const isFloor = tier.enterprise;

  return (
    <button
      onClick={() => onClick(index)}
      className="text-left rounded-xl p-4 transition-all duration-200 focus:outline-none w-full"
      style={{
        border: isSelected
          ? `2px solid ${NAVY}`
          : tier.recommended
          ? `2px solid ${GOLD}`
          : isFloor
          ? `2px solid #0f766e`
          : "1.5px solid #e2e8f0",
        backgroundColor: isSelected ? NAVY : "#ffffff",
        transform: isSelected ? "translateY(-2px)" : "none",
        boxShadow: isSelected ? `0 8px 24px ${NAVY}22` : "none",
      }}
    >
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-2"
        style={{
          backgroundColor: isSelected
            ? GOLD
            : tier.recommended
            ? GOLD + "33"
            : isFloor
            ? "#ccfbf1"
            : "#f1f5f9",
          color: isSelected
            ? NAVY
            : tier.recommended
            ? "#92650a"
            : isFloor
            ? "#0f766e"
            : "#64748b",
        }}
      >
        {tier.badge}
      </span>
      <div className="text-xs mb-1" style={{ color: isSelected ? GOLD + "cc" : "#94a3b8" }}>
        {tier.volLabel}
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: isSelected ? "#ffffff" : NAVY }}>
        {(tier.price * 100).toFixed(0)}¢
        <span className="text-xs font-normal ml-1" style={{ color: isSelected ? GOLD + "aa" : "#94a3b8" }}>
          /record
        </span>
      </div>
      <div
        className="text-xs font-medium"
        style={{
          color: diffNum > 0
            ? isSelected ? "#fca5a5" : "#dc2626"
            : diffNum < 0
            ? isSelected ? "#86efac" : "#16a34a"
            : isSelected ? "#fde68a" : "#92650a",
        }}
      >
        {diffNum > 0
          ? `+${Math.abs(diffNum)}¢ vs market`
          : diffNum < 0
          ? `-${Math.abs(diffNum)}¢ vs market`
          : isFloor
          ? `floor rate — non-negotiable`
          : `matches market rate`}
      </div>
    </button>
  );
}

function MetricCard({ label, value, sub, color, highlight }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: highlight ? color + "10" : "#f8fafc",
        border: highlight ? `1.5px solid ${color}44` : "1.5px solid #e2e8f0",
      }}
    >
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="text-lg font-bold" style={{ color }}>
        {value}
      </div>
      {sub && (
        <div className="text-xs mt-0.5" style={{ color: highlight ? color + "99" : "#94a3b8" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function SliderRow({ label, min, max, step, value, onChange, displayValue, leftLabel, rightLabel }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="text-sm font-bold" style={{ color: NAVY }}>{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          accentColor: NAVY,
          background: `linear-gradient(to right, ${NAVY} ${pct}%, #e2e8f0 0%)`,
        }}
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

function PricingTab() {
  const [selectedTier, setSelectedTier] = useState(1);
  const [volume, setVolume] = useState(TIERS[1].default);

  function handleTierSelect(idx) {
    setSelectedTier(idx);
    setVolume(TIERS[idx].default);
  }

  const tier = TIERS[selectedTier];
  const revenue = volume * tier.price;
  const vsComp = (COMPETITOR_RATE - tier.price) * volume;
  const clientSaves = vsComp > 0;
  const matchesMarket = tier.price === COMPETITOR_RATE;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {TIERS.map((t, i) => (
          <TierCard key={i} tier={t} index={i} isSelected={i === selectedTier} onClick={handleTierSelect} />
        ))}
      </div>

      <div className="rounded-2xl p-6 md:p-8 mb-6" style={{ backgroundColor: "#ffffff", border: "1.5px solid #e2e8f0" }}>
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="flex-1">
            <SliderRow
              label="Monthly volume"
              min={tier.min}
              max={tier.max}
              step={tier.enterprise ? 100000 : 1000}
              value={volume}
              onChange={(v) => setVolume(Math.min(tier.max, Math.max(tier.min, v)))}
              displayValue={`${fmtRecordsFull(volume)} records`}
              leftLabel={fmtRecords(tier.min)}
              rightLabel={tier.enterprise ? "5M+" : fmtRecords(tier.max)}
            />

            {tier.enterprise && (
              <div
                className="rounded-lg px-4 py-2 mb-4 text-xs font-medium flex items-center gap-2"
                style={{ backgroundColor: "#ccfbf1", color: "#0f766e" }}
              >
                <span>✓</span>
                <span>$0.10 is the absolute floor at this volume. This rate does not decrease further regardless of volume.</span>
              </div>
            )}

            <div
              className="rounded-xl p-4 text-sm leading-relaxed"
              style={{ backgroundColor: NAVY + "08", color: "#475569" }}
            >
              <span className="font-semibold block mb-1" style={{ color: NAVY }}>
                {tier.label} — {tier.range} records/mo
              </span>
              {tier.note}
            </div>
          </div>

          <div className="flex flex-col gap-3 md:w-56">
            <MetricCard
              label="Monthly spend"
              value={fmt(revenue)}
              sub={`at ${(tier.price * 100).toFixed(0)}¢/record`}
              color={NAVY}
            />
            <MetricCard
              label="vs. 15¢ market rate"
              value={
                matchesMarket && !tier.enterprise
                  ? "Same price"
                  : clientSaves
                  ? `Save ${fmt(vsComp)}/mo`
                  : `+${fmt(Math.abs(vsComp))}/mo`
              }
              sub={
                matchesMarket && !tier.enterprise
                  ? "Market rate — with intent data"
                  : clientSaves
                  ? "below standard publisher rate"
                  : "above standard publisher rate"
              }
              color={
                matchesMarket && !tier.enterprise
                  ? "#92650a"
                  : clientSaves
                  ? "#16a34a"
                  : "#dc2626"
              }
              highlight={clientSaves || (matchesMarket && !tier.enterprise)}
            />
            <a
              href="https://bit.ly/dmsinterview"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-center text-sm font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: NAVY, color: GOLD }}
            >
              Get Started →
            </a>
            <p className="text-center text-xs text-gray-400">No commitment. Talk to Deepak first.</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl" style={{ border: "1.5px solid #e2e8f0" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: NAVY }}>
              {["Tier", "Monthly Volume", "Price / Record", "vs. 15¢ Market", "Est. Monthly Spend"].map((h) => (
                <th key={h} className="text-left py-3 px-4 font-semibold" style={{ color: GOLD }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIERS.map((t, i) => {
              const diff = COMPETITOR_RATE - t.price;
              const midVol = t.enterprise
                ? 1000000
                : Math.round((t.min + t.max) / 2 / 1000) * 1000;
              return (
                <tr
                  key={i}
                  onClick={() => handleTierSelect(i)}
                  className="cursor-pointer transition-colors duration-150"
                  style={{
                    backgroundColor: i === selectedTier ? NAVY + "08" : i % 2 === 0 ? "#ffffff" : "#f8fafc",
                    borderLeft: i === selectedTier ? `3px solid ${NAVY}` : "3px solid transparent",
                  }}
                >
                  <td className="py-3 px-4 font-medium" style={{ color: NAVY }}>
                    {t.label}
                    {t.recommended && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: GOLD, color: NAVY }}>
                        Recommended
                      </span>
                    )}
                    {t.enterprise && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#ccfbf1", color: "#0f766e" }}>
                        Floor rate
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{t.range}</td>
                  <td className="py-3 px-4 font-bold" style={{ color: NAVY }}>${t.price.toFixed(2)}</td>
                  <td
                    className="py-3 px-4 font-medium"
                    style={{
                      color: diff > 0 ? "#16a34a" : diff < 0 ? "#dc2626" : "#92650a",
                    }}
                  >
                    {diff > 0
                      ? `Save ${(diff * 100).toFixed(0)}¢`
                      : diff < 0
                      ? `+${(Math.abs(diff) * 100).toFixed(0)}¢`
                      : t.enterprise
                      ? `Floor — non-negotiable`
                      : `Matches market`}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    ~{fmt(midVol * t.price)}
                    <span className="text-xs text-gray-400 ml-1">
                      at {fmtRecords(midVol)} records
                      {t.enterprise && "+"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ROITab() {
  const [selectedTier, setSelectedTier] = useState(1);
  const [volume, setVolume] = useState(TIERS[1].default);
  const [convRate, setConvRate] = useState(0.0025);
  const [dealValue, setDealValue] = useState(5000);
  const [margin, setMargin] = useState(20);

  function handleTierSelect(idx) {
    setSelectedTier(idx);
    setVolume(TIERS[idx].default);
  }

  const tier = TIERS[selectedTier];
  const dataCost = volume * tier.price;
  const closedDeals = Math.floor(volume * convRate);
  const grossRevenue = closedDeals * dealValue;
  const grossProfit = grossRevenue * (margin / 100);
  const netProfit = grossProfit - dataCost;
  const roi = dataCost > 0 ? Math.round((netProfit / dataCost) * 100) : 0;
  const costPerDeal = closedDeals > 0 ? dataCost / closedDeals : 0;
  const isPositive = netProfit > 0;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {TIERS.map((t, i) => (
          <TierCard key={i} tier={t} index={i} isSelected={i === selectedTier} onClick={handleTierSelect} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1.5px solid #e2e8f0" }}>
          <h3 className="font-semibold text-sm mb-5" style={{ color: NAVY }}>Dial in your assumptions</h3>

          <SliderRow
            label="Monthly volume"
            min={tier.min}
            max={tier.max}
            step={tier.enterprise ? 100000 : 1000}
            value={volume}
            onChange={(v) => setVolume(Math.min(tier.max, Math.max(tier.min, v)))}
            displayValue={`${fmtRecordsFull(volume)} records`}
            leftLabel={fmtRecords(tier.min)}
            rightLabel={tier.enterprise ? "5M+" : fmtRecords(tier.max)}
          />

          <SliderRow
            label="Lead-to-close conversion rate"
            min={0.0005}
            max={0.01}
            step={0.0001}
            value={convRate}
            onChange={setConvRate}
            displayValue={fmtPct(convRate)}
            leftLabel="0.05% — very conservative"
            rightLabel="1.0% — optimistic"
          />

          <div className="rounded-lg p-3 mb-5 text-xs" style={{ backgroundColor: NAVY + "06" }}>
            <div className="font-semibold mb-2" style={{ color: NAVY }}>
              Closed deals at {fmtRecordsFull(volume)} records
            </div>
            {[
              { label: "Very conservative (0.05%)", rate: 0.0005 },
              { label: "Conservative (0.25%)", rate: 0.0025 },
              { label: "Realistic (0.50%)", rate: 0.005 },
              { label: "Optimistic (1.0%)", rate: 0.01 },
            ].map(({ label, rate }) => (
              <div key={rate} className="flex justify-between mb-1 last:mb-0">
                <span style={{
                  color: Math.abs(convRate - rate) < 0.00005 ? NAVY : "#94a3b8",
                  fontWeight: Math.abs(convRate - rate) < 0.00005 ? 600 : 400,
                }}>
                  {label}
                </span>
                <span className="font-medium" style={{ color: NAVY }}>
                  {Math.floor(volume * rate).toLocaleString()} deals
                </span>
              </div>
            ))}
          </div>

          <SliderRow
            label="Revenue per closed deal"
            min={500}
            max={50000}
            step={500}
            value={dealValue}
            onChange={setDealValue}
            displayValue={fmt(dealValue)}
            leftLabel="$500"
            rightLabel="$50,000"
          />

          <SliderRow
            label="Profit margin per deal"
            min={5}
            max={80}
            step={1}
            value={margin}
            onChange={setMargin}
            displayValue={`${margin}%`}
            leftLabel="5%"
            rightLabel="80%"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              backgroundColor: isPositive ? "#f0fdf4" : "#fef2f2",
              border: `1.5px solid ${isPositive ? "#bbf7d0" : "#fecaca"}`,
            }}
          >
            <div className="text-sm mb-2" style={{ color: isPositive ? "#15803d" : "#dc2626" }}>
              {isPositive ? "Estimated return on data spend" : "Adjust assumptions — currently negative ROI"}
            </div>
            <div className="text-6xl font-bold mb-1" style={{ color: isPositive ? "#15803d" : "#dc2626" }}>
              {isPositive ? `${roi}%` : `-${Math.abs(roi)}%`}
            </div>
            <div className="text-xs mt-1" style={{ color: isPositive ? "#15803d99" : "#dc262699" }}>
              ROI on data spend · {fmtPct(convRate)} conversion · {fmt(dealValue)}/deal · {margin}% margin
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Closed deals" value={closedDeals.toLocaleString()} sub={`at ${fmtPct(convRate)} conversion`} color={NAVY} />
            <MetricCard label="Cost per deal" value={fmt(costPerDeal)} sub="from data spend only" color={NAVY} />
            <MetricCard label="Gross revenue" value={fmt(grossRevenue)} sub={`${closedDeals.toLocaleString()} × ${fmt(dealValue)}`} color={NAVY} />
            <MetricCard label="Gross profit" value={fmt(grossProfit)} sub={`at ${margin}% margin`} color={NAVY} />
          </div>

          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: isPositive ? "#f0fdf4" : "#fef2f2",
              border: `1.5px solid ${isPositive ? "#bbf7d0" : "#fecaca"}`,
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium" style={{ color: isPositive ? "#15803d" : "#dc2626" }}>
                Net profit after data cost
              </span>
              <span className="text-xl font-bold" style={{ color: isPositive ? "#15803d" : "#dc2626" }}>
                {netProfit >= 0 ? fmt(netProfit) : `-${fmt(Math.abs(netProfit))}`}
              </span>
            </div>
            <div className="text-xs mt-1 text-gray-400">
              Gross profit {fmt(grossProfit)} — data cost {fmt(dataCost)}
            </div>
          </div>

          <a
            href="https://bit.ly/dmsinterview"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-sm font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: NAVY, color: GOLD }}
          >
            Talk to Deepak About Your Numbers →
          </a>
          <p className="text-center text-xs text-gray-400">
            Illustrative estimates only. Results depend on your sales process, vertical, and follow-up cadence.
          </p>
        </div>
      </div>
    </>
  );
}

export default function BulkRateCalculator({ onBack }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Pricing Tiers", "ROI Calculator"];

  return (
    <section className="w-full py-16 px-4" style={{ backgroundColor: "#f8f9fc" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <button
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-flex items-center gap-1 transition"
          >
            ← Back
          </button>
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: GOLD + "22", color: NAVY }}
          >
            Intent-Scored Lead Data
          </span>
          <h2 className="text-3xl font-bold mb-3" style={{ color: NAVY }}>
            Bulk Pricing Calculator
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Every record includes behavioral intent scoring — people whose buying activity
            spiked in the last 7 days above their own personal baseline.
            Minimum 30,000 records/month. Nationwide coverage.
          </p>
        </div>

        <div className="flex gap-2 mb-8 p-1 rounded-xl w-fit mx-auto" style={{ backgroundColor: "#e2e8f0" }}>
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                backgroundColor: activeTab === i ? NAVY : "transparent",
                color: activeTab === i ? GOLD : "#64748b",
                boxShadow: activeTab === i ? `0 2px 8px ${NAVY}33` : "none",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 0 ? <PricingTab /> : <ROITab />}

        <p className="text-center text-xs text-gray-400 mt-6">
          All records include behavioral intent scoring. Geography filtered to your target markets.
          Minimum 30,000 records/month.
        </p>
      </div>
    </section>
  );
}
