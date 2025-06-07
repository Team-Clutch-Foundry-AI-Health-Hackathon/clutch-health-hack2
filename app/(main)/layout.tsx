'use client';

import { useState } from 'react';
import { 
  HeartPulse, 
  LayoutDashboard, 
  Calendar,
  ActivitySquare, 
  Award, 
  Settings,
  User,
  Menu,
  X,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const routes = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/dashboard',
      active: pathname === '/dashboard',
    },
    {
      label: 'Daily Check-in',
      icon: <Calendar className="h-5 w-5" />,
      href: '/daily-check-in',
      active: pathname === '/daily-check-in',
    },
    {
      label: 'Health Metrics',
      icon: <ActivitySquare className="h-5 w-5" />,
      href: '/health-metrics',
      active: pathname === '/health-metrics',
    },
    {
      label: 'Achievements',
      icon: <Award className="h-5 w-5" />,
      href: '/achievements',
      active: pathname === '/achievements',
    },
    {
      label: 'Clinician View',
      icon: <Activity className="h-5 w-5" />,
      href: '/dashboard/clinician',
      active: pathname === '/dashboard/clinician',
    },
    {
      label: 'Profile',
      icon: <User className="h-5 w-5" />,
      href: '/profile',
      active: pathname === '/profile',
    },
    {
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      href: '/settings',
      active: pathname === '/settings',
    },
  ];

  return (
    <div className="h-full relative">
      {/* Mobile sidebar toggle */}
      <Button 
        variant="outline"
        size="icon"
        className="fixed right-4 top-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center">
            <HeartPulse className="h-6 w-6 text-rose-500 mr-2" />
            <span className="text-xl font-bold">HealthQuest</span>
          </div>
          
          <div className="p-6 border-y border-border">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Jane Smith</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="mr-1">Level 5</span>
                  <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-rose-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-secondary/50 rounded-lg p-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Current Streak</span>
                <span className="text-sm font-bold">7 days 🔥</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">XP Points</span>
                <span className="text-sm font-bold">1,240 XP</span>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  route.active 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-secondary text-foreground/80 hover:text-foreground"
                )}
              >
                {route.icon}
                <span>{route.label}</span>
                {route.label === "Daily Check-in" && (
                  <span className="ml-auto bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-border flex justify-between items-center">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Logout</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className={cn(
        "min-h-screen transition-all duration-300 lg:ml-72"
      )}>
        {children}
      </main>
    </div>
  );
}