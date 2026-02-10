import { Project } from "@shared/schema";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, RadialBarChart, RadialBar
} from 'recharts';

interface DashboardChartsProps {
  data: Project['dashboardData'];
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  if (!data) return null;

  const engagementData = data.engagement;
  const npsData = [{ name: 'NPS', value: data.nps.score, fill: '#8884d8' }];
  const successData = [
    { name: 'Applied', value: data.success.applied },
    { name: 'Offers', value: data.success.offers }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Chart 1: Engagement Over Time */}
      <div className="col-span-full lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 font-display text-lg font-semibold">Cohort Engagement</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="assignments" name="Assignments %" stroke="hsl(var(--secondary-foreground))" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metric Cards Column */}
      <div className="flex flex-col gap-6">
        {/* NPS Score */}
        <div className="flex-1 rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <h3 className="absolute top-6 left-6 font-display text-lg font-semibold">NPS Score</h3>
          <div className="relative flex items-center justify-center">
            <div className="text-center">
              <span className="block text-5xl font-bold tracking-tighter text-foreground">{data.nps.score}</span>
              <span className="text-sm text-muted-foreground">out of {data.nps.total} students</span>
            </div>
            <div className="absolute inset-0 -z-10 opacity-20">
              <ResponsiveContainer width="100%" height={160}>
                <RadialBarChart innerRadius="80%" outerRadius="100%" data={npsData} startAngle={180} endAngle={0}>
                  <RadialBar background dataKey="value" cornerRadius={10} fill="hsl(var(--primary))" />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="flex-1 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-display text-lg font-semibold">Placement Success</h3>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Applications Sent</span>
                <span className="font-medium">{data.success.applied}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-primary" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Offers Received</span>
                <span className="font-medium">{data.success.offers}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${(data.success.offers / data.success.applied) * 100}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
