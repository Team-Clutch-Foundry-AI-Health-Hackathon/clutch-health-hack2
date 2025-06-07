'use client';

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockMoodData = [
  { day: 'Mon', mood: 2, energy: 30, sleep: 6 },
  { day: 'Tue', mood: 3, energy: 45, sleep: 7 },
  { day: 'Wed', mood: 4, energy: 70, sleep: 8 },
  { day: 'Thu', mood: 3, energy: 60, sleep: 7.5 },
  { day: 'Fri', mood: 4, energy: 75, sleep: 7.5 },
  { day: 'Sat', mood: 3, energy: 65, sleep: 9 },
  { day: 'Sun', mood: 4, energy: 55, sleep: 8 },
];

export function HealthStats() {
  return (
    <Tabs defaultValue="mood">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="mood">Mood</TabsTrigger>
        <TabsTrigger value="energy">Energy</TabsTrigger>
        <TabsTrigger value="sleep">Sleep</TabsTrigger>
      </TabsList>
      
      <TabsContent value="mood" className="pt-4">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockMoodData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: 'var(--border)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value) => [`${value}`, 'Mood (0-5)']}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted-foreground mt-2 text-center">Your mood has been relatively stable with a positive trend.</p>
      </TabsContent>
      
      <TabsContent value="energy" className="pt-4">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockMoodData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: 'var(--border)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value) => [`${value}%`, 'Energy Level']}
              />
              <Line 
                type="monotone" 
                dataKey="energy" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted-foreground mt-2 text-center">Your energy levels peak mid-week and tend to dip on weekends.</p>
      </TabsContent>
      
      <TabsContent value="sleep" className="pt-4">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockMoodData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 10]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: 'var(--border)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value) => [`${value} hours`, 'Sleep Duration']}
              />
              <Bar 
                dataKey="sleep" 
                fill="hsl(var(--chart-4))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted-foreground mt-2 text-center">You&apos;re averaging 7.6 hours of sleep, with more sleep on weekends.</p>
      </TabsContent>
    </Tabs>
  );
}