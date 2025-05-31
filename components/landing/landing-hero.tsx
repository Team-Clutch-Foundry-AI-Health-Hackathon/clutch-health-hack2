'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LandingHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Turn Your Health Journey Into An{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500">
                Adventure
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Track your health with a fun, gamified experience that rewards consistency
              and provides meaningful insights for you and your healthcare providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild>
                <Link href="/register">Start Your Journey</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
            <div className="mt-8 text-sm text-muted-foreground">
              <span className="flex items-center justify-center lg:justify-start gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-green-500"></span>
                No credit card required • Free to start
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-border">
              <div className="bg-primary/10 dark:bg-primary/5 p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                    <span className="text-rose-500 font-bold">L5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Health Explorer</h3>
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">75% to Level 6</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs">
                    <span className="font-medium">7 day streak 🔥</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-4">Today's Health Check</h3>
                <div className="space-y-4">
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="font-medium mb-2">How are you feeling today?</p>
                    <div className="flex justify-between">
                      {['😞', '😟', '😐', '🙂', '😄'].map((emoji, i) => (
                        <button 
                          key={i}
                          className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                            i === 3 ? 'bg-primary text-primary-foreground scale-110' : 'bg-background hover:bg-secondary'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="font-medium mb-2">Energy level</p>
                    <div className="h-4 bg-background rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-amber-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/50 p-4 rounded-lg flex justify-between items-center">
                    <span className="font-medium">Did you experience headaches today?</span>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 rounded bg-primary text-primary-foreground">Yes</button>
                      <button className="px-3 py-1 rounded bg-background">No</button>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="w-full">Complete Check-in (+20 XP)</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}