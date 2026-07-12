import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { SkillGrowthEntry } from '@/types/skill';
import { formatRelative } from '@/lib/utils/date';

interface SkillBarChartProps {
  data: SkillGrowthEntry[];
}

interface TooltipPayloadItem {
  payload: SkillGrowthEntry;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0]?.payload;
  if (!entry) return null;

  return (
    <div className="rounded-lg border border-border-hairline bg-surface px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-ink-primary">{entry.tag}</p>
      <p className="mt-0.5 text-ink-secondary">
        {entry.ticketCount} tickets · {entry.learningCount} learnings
      </p>
      <p className="mt-0.5 text-xs text-ink-muted">
        {entry.lastTouchedAt ? `Last touched ${formatRelative(entry.lastTouchedAt)}` : 'Never touched'}
      </p>
    </div>
  );
}

export function SkillBarChart({ data }: SkillBarChartProps) {
  const height = Math.max(160, data.length * 36);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 4 }} barCategoryGap={10}>
        <CartesianGrid horizontal={false} stroke="var(--color-border-hairline)" />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="tag"
          width={110}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--color-ink-secondary)', fontSize: 12 }}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-surface-hover)' }} />
        <Bar dataKey="totalReps" fill="var(--color-accent)" radius={[0, 4, 4, 0]} maxBarSize={18}>
          <LabelList
            dataKey="totalReps"
            position="right"
            className="tabular-nums"
            style={{ fill: 'var(--color-ink-primary)', fontSize: 12, fontWeight: 500 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
