/** Home: four calculators behind one row of tabs, the Skilled Worker check first (largest demand). */
import { useEffect, useState } from 'react';
import SkilledWorkerTool from './SkilledWorkerTool';
import CostTool from './CostTool';
import SettlementTool from './SettlementTool';
import SpouseTool from './SpouseTool';
import { readParams, str } from '../../lib/url-state';

const TABS = [
  { id: 'sw', label: 'Skilled Worker salary' },
  { id: 'cost', label: 'Visa cost' },
  { id: 'ilr', label: 'ILR and citizenship date' },
  { id: 'spouse', label: 'Spouse visa income' },
] as const;
type Tab = (typeof TABS)[number]['id'];
export default function HomeTools({ links = {} }: { links?: Record<string, string> }) {
  const [tab, setTab] = useState<Tab>('sw');
  useEffect(() => { const t = str(readParams(window.location.search), 'tool', 'sw'); if (TABS.some((x) => x.id === t)) setTab(t as Tab); }, []);
  return (
    <div>
      <div role="tablist" aria-label="Choose a calculator" className="-mx-4 mb-2 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {TABS.map((t) => <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
          className={`h-9 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-medium ${tab === t.id ? 'border-accent-600 bg-accent-600 text-white' : 'border-navy-300 bg-white text-navy-700 hover:bg-navy-50'}`}>{t.label}</button>)}
      </div>
      {tab === 'sw' && <SkilledWorkerTool id="home-sw" costHref={links.cost} ratesHref={links.rates} title="Does your job meet the Skilled Worker salary threshold?" />}
      {tab === 'cost' && <CostTool id="home-cost" title="Total cost of a UK visa, family included" />}
      {tab === 'ilr' && <SettlementTool id="home-ilr" mode="ilr" title="When can you apply for ILR, then citizenship?" />}
      {tab === 'spouse' && <SpouseTool id="home-sp" costHref={links.cost} title="Spouse visa: do you meet the minimum income?" />}
    </div>
  );
}
