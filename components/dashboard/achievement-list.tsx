'use client';

import { Trophy, Star, Zap, Heart } from 'lucide-react';

const achievements = [
  {
    id: 1,
    title: '7-Day Streak',
    description: 'Completed daily check-ins for 7 consecutive days',
    icon: <Zap className="h-5 w-5 text-amber-500" />,
    date: '2024-03-15',
    xp: 100,
  },
  {
    id: 2,
    title: 'Sleep Master',
    description: 'Maintained 7+ hours of sleep for 5 consecutive days',
    icon: <Star className="h-5 w-5 text-blue-500" />,
    date: '2024-03-12',
    xp: 150,
  },
  {
    id: 3,
    title: 'Mood Tracker',
    description: 'Logged mood data for 14 consecutive days',
    icon: <Heart className="h-5 w-5 text-rose-500" />,
    date: '2024-03-10',
    xp: 200,
  },
];

export function AchievementList() {
  return (
    <div className="space-y-4">
      {achievements.map((achievement) => (
        <div
          key={achievement.id}
          className="flex items-start space-x-4 p-4 bg-card border rounded-lg"
        >
          <div className="p-2 bg-primary/10 rounded-lg">
            {achievement.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{achievement.title}</h4>
              <span className="text-sm font-medium text-muted-foreground">
                +{achievement.xp} XP
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {achievement.description}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Earned on {new Date(achievement.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}