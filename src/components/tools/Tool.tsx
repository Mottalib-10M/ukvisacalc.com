/** Island that renders one simulator from its spec (page file → ContentPage / HomePage). */
import SkilledWorkerTool from './SkilledWorkerTool';
import CostTool from './CostTool';
import SettlementTool from './SettlementTool';
import SpouseTool from './SpouseTool';
import SponsorSearch from './SponsorSearch';
import TimeTool from './TimeTool';
import FeeHistoryTool from './FeeHistoryTool';
import StudentTool from './StudentTool';
import SponsorCostTool from './SponsorCostTool';
import type { ToolSpec } from '../../lib/page-types';

interface Props extends ToolSpec { sponsorMeta?: { routes: string[]; ratings: string[]; date: string; organisations: number; shards: string[] }; links?: Record<string, string>; uid?: string }
export default function Tool({ kind, props = {}, sponsorMeta, links = {}, uid }: Props) {
  const p = { ...props, ...(uid ? { id: uid } : {}) } as Record<string, never>;
  switch (kind) {
    case 'sw': return <SkilledWorkerTool costHref={links.cost} ratesHref={links.rates} {...p} />;
    case 'cost': return <CostTool {...p} />;
    case 'ilr': return <SettlementTool mode="ilr" {...p} />;
    case 'absence': return <SettlementTool mode="absence" {...p} />;
    case 'citizenship': return <SettlementTool mode="citizenship" {...p} />;
    case 'spouse': return <SpouseTool costHref={links.cost} {...p} />;
    case 'sponsor': return <SponsorSearch {...sponsorMeta!} {...p} />;
    case 'time': return <TimeTool {...p} />;
    case 'history': return <FeeHistoryTool {...p} />;
    case 'student': return <StudentTool {...p} />;
    case 'licence': return <SponsorCostTool {...p} />;
  }
}
