'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Mon', mood: 4, energy: 75, sleep: 7.5 },
  { date: 'Tue', mood: 3, energy: 65, sleep: 6.5 },
  { date: 'Wed', mood: 4, energy: 80, sleep: 8 },
  { date: 'Thu', mood: 5, energy: 85, sleep: 7 },
  { date: 'Fri', mood: 4, energy: 70, sleep: 6.5 },
  { date: 'Sat', mood: 5, energy: 90, sleep: 8.5 },
  { date: 'Sun', mood: 4, energy: 75, sleep: 7 },
];

export function HealthStats() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="mood"
            stroke="#ef4444"
            name="Mood"
            strokeWidth={2}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="energy"
            stroke="#3b82f6"
            name="Energy"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="sleep"
            stroke="#10b981"
            name="Sleep"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}