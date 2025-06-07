'use client';

import { useEffect, useState } from 'react';
import { 
  Calendar,
  ChevronRight, 
  Trophy,
  Zap,
  LineChart,
  Heart,
  Activity,
  Coffee,
  Moon 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HealthStats } from '@/components/dashboard/health-stats';
import { StreakCalendar } from '@/components/dashboard/streak-calendar';
import { AchievementList } from '@/components/dashboard/achievement-list';
import { CompanionCard } from '@/components/dashboard/companion-card';
import Link from 'next/link';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Normally this data would come from an API
  const checkInStreak = 7;
  const totalXp = 1240;
  const nextLevelXp = 1500;
  const level = 5;
  const todayCompleted = false;

  const progressToNextLevel = Math.round((totalXp / nextLevelXp) * 100);
  
  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Continue your health journey.
          </p>
        </div>
        <div className="flex gap-2">
          {!todayCompleted && (
            <Button asChild className="bg-gradient-to-r from-rose-500 to-indigo-500 text-white">
              <Link href="/daily-check-in" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Complete Today&apos;s Check-in
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/dashboard/clinician" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              View Clinician Side
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Level Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-2xl">Level {level}</p>
                  <p className="text-sm text-muted-foreground">Health Explorer</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <Progress value={progressToNextLevel} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {totalXp} / {nextLevelXp} XP to Level {level + 1}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center mr-3">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-2xl">{checkInStreak} Days 🔥</p>
                  <p className="text-sm text-muted-foreground">Your longest: 14 days</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/daily-check-in">Check-in</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Health Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mr-3">
                  <LineChart className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-2xl">Good</p>
                  <p className="text-sm text-muted-foreground">Based on your recent check-ins</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/health-metrics">Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="activity">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Your Health Journey</CardTitle>
                  <CardDescription>
                    See your recent check-in history and progress.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <StreakCalendar />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    You&apos;ve checked in 23 days this month
                  </p>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/health-metrics">View Detailed History</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="metrics">
              <Card>
                <CardHeader>
                  <CardTitle>Health Metrics</CardTitle>
                  <CardDescription>
                    Track your key health indicators over time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HealthStats />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/health-metrics">View All Health Data</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>
                    Your latest health milestones and badges.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AchievementList />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/achievements">View All Achievements</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Insights</CardTitle>
              <CardDescription>
                Based on your health check-ins from the past week.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Heart className="h-5 w-5 text-rose-500" />
                </div>
                <div>
                  <h4 className="font-semibold">Mood Patterns</h4>
                  <p className="text-sm text-muted-foreground">Your mood tends to improve on days when you report 7+ hours of sleep.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Activity className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <h4 className="font-semibold">Energy Level</h4>
                  <p className="text-sm text-muted-foreground">Your energy is typically highest mid-week and dips on weekends.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Coffee className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold">Hydration Notice</h4>
                  <p className="text-sm text-muted-foreground">You&apos;ve reported feeling dehydrated 3 times this week. Consider setting a water intake reminder.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Moon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold">Sleep Quality</h4>
                  <p className="text-sm text-muted-foreground">Your average sleep quality rating has improved by 15% compared to last month.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">View All Insights</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <CompanionCard />
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Quests</CardTitle>
              <CardDescription>
                Complete these health quests to earn rewards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">7-Day Streak Challenge</h4>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full font-medium">
                    In Progress
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Check in for 7 consecutive days.
                </p>
                <Progress value={checkInStreak * (100/7)} className="h-2" />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-muted-foreground">Reward: +100 XP</p>
                  <p className="text-xs text-muted-foreground">{checkInStreak}/7 days</p>
                </div>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">Track Your Sleep</h4>
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-full font-medium">
                    New
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Log sleep data for 5 nights this week.
                </p>
                <Progress value={40} className="h-2" />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-muted-foreground">Reward: Sleep Master Badge</p>
                  <p className="text-xs text-muted-foreground">2/5 days</p>
                </div>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">Hydration Hero</h4>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full font-medium">
                    Coming Soon
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Track your water intake for a full week.
                </p>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-muted-foreground">Reward: +150 XP & Hydration Badge</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">View All Quests</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}