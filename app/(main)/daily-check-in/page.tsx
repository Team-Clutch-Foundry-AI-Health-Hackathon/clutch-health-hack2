'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, Trophy, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import type { HealthAnalysis } from '@/lib/openai';
import { useUser } from '@/lib/context/user-context';

export default function DailyCheckInPage() {
  const { toast } = useToast();
  const { userProfile } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [moodValue, setMoodValue] = useState(3);
  const [energyValue, setEnergyValue] = useState(50);
  const [sleepHours, setSleepHours] = useState(7);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<HealthAnalysis | null>(null);
  
  const steps = [
    { id: 'mood', title: 'Mood Check' },
    { id: 'energy', title: 'Energy & Sleep' },
    { id: 'symptoms', title: 'Symptoms' },
    { id: 'summary', title: 'Summary' },
  ];
  
  const moodEmojis = ['😞', '😟', '😐', '🙂', '😄'];
  
  const commonSymptoms = [
    'Headache', 'Fatigue', 'Nausea', 'Dizziness', 
    'Joint pain', 'Muscle soreness', 'Cough', 'Sore throat',
  ];
  
  const toggleSymptom = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = async () => {
    setIsAnalyzing(true);
    
    try {
      const checkInData = {
        date: new Date().toISOString(),
        mood: moodValue,
        energy: energyValue,
        sleep: sleepHours,
        symptoms,
        userProfile: userProfile ? {
          age: parseInt(userProfile.age),
          gender: userProfile.gender,
          conditions: userProfile.currentConditions.split(',').map(c => c.trim()).filter(Boolean),
          medications: userProfile.medications.split(',').map(m => m.trim()).filter(Boolean),
          allergies: userProfile.allergies.split(',').map(a => a.trim()).filter(Boolean),
          lifestyle: userProfile.lifestyle
        } : null
      };

      const response = await fetch('/api/health/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkInData),
      });

      if (!response.ok) throw new Error('Analysis failed');
      
      const analysisResult = await response.json();
      setAnalysis(analysisResult);
      setCompleted(true);
      
      toast({
        title: "Check-in complete!",
        description: "You've earned 20 XP and extended your streak to 8 days! 🔥",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "Unable to analyze your health data. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Mood
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">How are you feeling today?</h2>
              <p className="text-muted-foreground">Select the emoji that best describes your mood</p>
            </div>
            
            <div className="flex justify-center gap-4 mt-8">
              {moodEmojis.map((emoji, index) => (
                <button 
                  key={index}
                  onClick={() => setMoodValue(index)}
                  className={`h-16 w-16 text-3xl rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
                    moodValue === index 
                      ? 'bg-primary text-primary-foreground scale-110 shadow-lg' 
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                  aria-label={`Mood level ${index + 1} out of 5`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            <div className="bg-secondary/50 p-4 rounded-lg mt-8">
              <h3 className="font-medium mb-2">Would you like to add more detail?</h3>
              <textarea 
                className="w-full p-2 rounded-md border border-input bg-background"
                placeholder="Optional: Describe how you're feeling today..."
                rows={3}
              ></textarea>
            </div>
          </div>
        );
      
      case 1: // Energy & Sleep
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Energy & Sleep</h2>
              <p className="text-muted-foreground">Track your energy levels and sleep quality</p>
            </div>
            
            <div className="space-y-8 mt-8">
              <div className="space-y-4">
                <Label>How is your energy level today?</Label>
                <Slider 
                  value={[energyValue]} 
                  onValueChange={(value) => setEnergyValue(value[0])} 
                  max={100} 
                  step={1} 
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Very low</span>
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                  <span>Very high</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>How many hours did you sleep last night?</Label>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setSleepHours(Math.max(0, sleepHours - 0.5))}
                    disabled={sleepHours <= 0}
                  >
                    -
                  </Button>
                  <div className="flex-1 text-center text-3xl font-bold">
                    {sleepHours}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setSleepHours(Math.min(12, sleepHours + 0.5))}
                    disabled={sleepHours >= 12}
                  >
                    +
                  </Button>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${(sleepHours/12)*100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>How was your sleep quality?</Label>
                <RadioGroup defaultValue="medium">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="poor" id="poor" />
                      <Label htmlFor="poor">Poor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fair" id="fair" />
                      <Label htmlFor="fair">Fair</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Good</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id="excellent" />
                      <Label htmlFor="excellent">Excellent</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );
      
      case 2: // Symptoms
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Symptom Tracker</h2>
              <p className="text-muted-foreground">Select any symptoms you experienced today</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-6">
              {commonSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                    symptoms.includes(symptom) 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border hover:bg-secondary'
                  }`}
                >
                  <span>{symptom}</span>
                  {symptoms.includes(symptom) ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
            
            <div>
              <Label>Any other symptoms or notes?</Label>
              <textarea 
                className="w-full mt-2 p-3 rounded-md border border-input bg-background"
                placeholder="Describe any other symptoms or health observations..."
                rows={3}
              ></textarea>
            </div>
          </div>
        );
      
      case 3: // Summary
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Daily Check-in Summary</h2>
              <p className="text-muted-foreground">Review your health data for today</p>
            </div>
            
            <div className="space-y-4 bg-card border rounded-xl p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Mood</h3>
                  <div className="text-2xl mt-1">{moodEmojis[moodValue]}</div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Energy Level</h3>
                  <div className="text-xl font-semibold mt-1">
                    {energyValue < 30 ? 'Low' : energyValue < 70 ? 'Moderate' : 'High'}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Sleep Duration</h3>
                  <div className="text-xl font-semibold mt-1">{sleepHours} hours</div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Symptoms</h3>
                  <div className="mt-1">
                    {symptoms.length > 0 ? (
                      <div className="text-sm">
                        {symptoms.slice(0, 2).join(', ')}
                        {symptoms.length > 2 && ` +${symptoms.length - 2} more`}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">None reported</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center">
                <Trophy className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <h3 className="font-medium text-green-800 dark:text-green-300">Rewards for completion:</h3>
              </div>
              <ul className="mt-2 text-sm text-green-800 dark:text-green-300 space-y-1 ml-7">
                <li>+20 XP points</li>
                <li>Streak extended to 8 days</li>
                <li>Progress toward &quot;Consistent Tracker&quot; badge</li>
              </ul>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  if (completed) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="inline-flex h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-green-800 dark:text-green-300">Check-in Complete!</h1>
              
              {analysis && (
                <div className="space-y-6 mt-8 text-left">
                  <div className="bg-card border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Your Health Analysis</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Summary</h3>
                        <p className="text-muted-foreground">{analysis.summary}</p>
                      </div>
                      
                      {analysis.concerns.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Potential Concerns</h3>
                          <ul className="list-disc list-inside space-y-1">
                            {analysis.concerns.map((concern, index) => (
                              <li key={index} className="text-muted-foreground">{concern}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="font-medium mb-2">Wellness Tips</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {analysis.tips.map((tip, index) => (
                            <li key={index} className="text-muted-foreground">{tip}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {analysis.doctorRecommendation.needed && (
                        <div className={`p-4 rounded-lg ${
                          analysis.doctorRecommendation.urgency === 'urgent'
                            ? 'bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                            : 'bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                        }`}>
                          <div className="flex items-center">
                            <AlertTriangle className={`h-5 w-5 mr-2 ${
                              analysis.doctorRecommendation.urgency === 'urgent'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-yellow-600 dark:text-yellow-400'
                            }`} />
                            <h3 className="font-medium">Medical Attention Recommended</h3>
                          </div>
                          <p className="mt-2 text-sm">
                            {analysis.doctorRecommendation.reason}
                            {analysis.doctorRecommendation.specialistType && (
                              <> Consider consulting a {analysis.doctorRecommendation.specialistType}.</>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-card rounded-lg p-4 border border-green-200 dark:border-green-800 shadow-sm">
                      <p className="text-muted-foreground text-sm">XP Earned</p>
                      <p className="text-2xl font-bold">+20 XP</p>
                    </div>
                    <div className="bg-white dark:bg-card rounded-lg p-4 border border-green-200 dark:border-green-800 shadow-sm">
                      <p className="text-muted-foreground text-sm">Current Streak</p>
                      <p className="text-2xl font-bold">8 Days 🔥</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <Button asChild>
                  <Link href="/dashboard">
                    Return to Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`h-1 rounded-full w-16 ${
                    index <= currentStep ? 'bg-primary' : 'bg-secondary'
                  }`}
                />
              ))}
            </div>
            <CardDescription>
              Step {currentStep + 1} of {steps.length}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          {currentStep === steps.length - 1 ? (
            <Button 
              onClick={handleComplete}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Complete Check-in"}
            </Button>
          ) : (
            <Button onClick={handleNextStep}>
              Continue
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}