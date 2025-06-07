'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Sparkles } from 'lucide-react';

export function CompanionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Health Companion</CardTitle>
        <CardDescription>
          Get personalized insights and support
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">Daily Insights</h4>
            <p className="text-sm text-muted-foreground">
              Your sleep quality has improved by 15% this week!
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">Quick Tips</h4>
            <p className="text-sm text-muted-foreground">
              Try to maintain consistent sleep and wake times for better energy levels.
            </p>
          </div>
        </div>
        
        <Button className="w-full">
          Chat with Companion
        </Button>
      </CardContent>
    </Card>
  );
}