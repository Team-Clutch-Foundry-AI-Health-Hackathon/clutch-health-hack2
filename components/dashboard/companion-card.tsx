'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

export function CompanionCard() {
  const [happiness, setHappiness] = useState(85);
  const [energy, setEnergy] = useState(70);
  const [isInteracting, setIsInteracting] = useState(false);
  const [lastAction, setLastAction] = useState('');
  
  const handleInteract = (action: string) => {
    setIsInteracting(true);
    
    if (action === 'feed') {
      setEnergy((prev) => Math.min(100, prev + 15));
      setLastAction('You fed your companion!');
    } else if (action === 'play') {
      setHappiness((prev) => Math.min(100, prev + 15));
      setEnergy((prev) => Math.max(10, prev - 5));
      setLastAction('You played with your companion!');
    }
    
    setTimeout(() => {
      setIsInteracting(false);
    }, 1500);
  };
  
  const getCompanionMood = () => {
    if (happiness > 80) return '😄';
    if (happiness > 60) return '🙂';
    if (happiness > 40) return '😐';
    if (happiness > 20) return '😟';
    return '😞';
  };
  
  const getCompanionState = () => {
    if (energy < 30) return 'Tired';
    if (happiness < 30) return 'Sad';
    if (happiness > 80 && energy > 80) return 'Energetic';
    if (happiness > 80) return 'Happy';
    if (energy > 80) return 'Restless';
    return 'Content';
  };
  
  const companionLevel = 3;
  const companionName = "Healix";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Health Companion</span>
          <div className="text-xs bg-primary/10 px-2 py-1 rounded-full">
            Level {companionLevel}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col items-center">
          <AnimatePresence>
            {isInteracting ? (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                exit={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-7xl mb-4"
              >
                {getCompanionMood()}
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-7xl mb-4"
              >
                {getCompanionMood()}
              </motion.div>
            )}
          </AnimatePresence>
          
          <h3 className="font-semibold text-lg">{companionName}</h3>
          <p className="text-sm text-muted-foreground">{getCompanionState()}</p>
          
          <div className="w-full space-y-3 mt-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Happiness</span>
                <span>{happiness}%</span>
              </div>
              <Progress value={happiness} className="h-2" />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Energy</span>
                <span>{energy}%</span>
              </div>
              <Progress value={energy} className="h-2" />
            </div>
          </div>
          
          {lastAction && (
            <p className="text-xs text-muted-foreground mt-3">{lastAction}</p>
          )}
          
          <div className="flex gap-3 mt-4">
            <Button size="sm" variant="outline" onClick={() => handleInteract('feed')}>
              <Zap className="h-4 w-4 mr-1" /> Feed
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleInteract('play')}>
              <Heart className="h-4 w-4 mr-1" /> Play
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Complete daily check-ins to level up your companion!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}