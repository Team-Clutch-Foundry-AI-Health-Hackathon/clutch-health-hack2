'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { HeartPulse } from 'lucide-react';
import { useUser } from '@/lib/context/user-context';

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { saveUserProfile } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    race: '',
    height: '',
    weight: '',
    location: '',
    recentIllness: '',
    currentConditions: '',
    allergies: '',
    medications: '',
    familyHistory: '',
    lifestyle: {
      smoking: 'no',
      alcohol: 'no',
      exercise: 'moderate'
    }
  });

  const calculateBMI = () => {
    const heightInMeters = parseFloat(formData.height) / 100;
    const weightInKg = parseFloat(formData.weight);
    if (heightInMeters && weightInKg) {
      return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLifestyleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save the user profile data
      saveUserProfile(formData);
      
      toast({
        title: "Profile created successfully!",
        description: "Welcome to HealthQuest. Let's start your health journey.",
      });
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Enter your age"
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Race/Ethnicity</Label>
              <Select
                value={formData.race}
                onValueChange={(value) => handleInputChange('race', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select race/ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="black">Black or African American</SelectItem>
                  <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                  <SelectItem value="native">Native American</SelectItem>
                  <SelectItem value="pacific">Pacific Islander</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="multiple">Multiple Ethnicities</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="Height in centimeters"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="Weight in kilograms"
                />
              </div>
            </div>

            {calculateBMI() && (
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm font-medium">Your BMI</p>
                <p className="text-2xl font-bold">{calculateBMI()}</p>
                <p className="text-sm text-muted-foreground">
                  {parseFloat(calculateBMI()!) < 18.5
                    ? 'Underweight'
                    : parseFloat(calculateBMI()!) < 25
                    ? 'Normal weight'
                    : parseFloat(calculateBMI()!) < 30
                    ? 'Overweight'
                    : 'Obese'}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recentIllness">Recent Illnesses (past 3 months)</Label>
              <Textarea
                id="recentIllness"
                value={formData.recentIllness}
                onChange={(e) => handleInputChange('recentIllness', e.target.value)}
                placeholder="Describe any recent illnesses..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentConditions">Current Medical Conditions</Label>
              <Textarea
                id="currentConditions"
                value={formData.currentConditions}
                onChange={(e) => handleInputChange('currentConditions', e.target.value)}
                placeholder="List any current medical conditions..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                placeholder="List any allergies..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medications">Current Medications</Label>
              <Textarea
                id="medications"
                value={formData.medications}
                onChange={(e) => handleInputChange('medications', e.target.value)}
                placeholder="List any medications you're currently taking..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="familyHistory">Family Medical History</Label>
              <Textarea
                id="familyHistory"
                value={formData.familyHistory}
                onChange={(e) => handleInputChange('familyHistory', e.target.value)}
                placeholder="Describe any significant family medical history..."
              />
            </div>

            <div className="space-y-4">
              <Label>Lifestyle Factors</Label>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Do you smoke?</p>
                <RadioGroup
                  value={formData.lifestyle.smoking}
                  onValueChange={(value) => handleLifestyleChange('smoking', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="smoking-no" />
                    <Label htmlFor="smoking-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="occasionally" id="smoking-occasionally" />
                    <Label htmlFor="smoking-occasionally">Occasionally</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regularly" id="smoking-regularly" />
                    <Label htmlFor="smoking-regularly">Regularly</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Do you consume alcohol?</p>
                <RadioGroup
                  value={formData.lifestyle.alcohol}
                  onValueChange={(value) => handleLifestyleChange('alcohol', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="alcohol-no" />
                    <Label htmlFor="alcohol-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="occasionally" id="alcohol-occasionally" />
                    <Label htmlFor="alcohol-occasionally">Occasionally</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regularly" id="alcohol-regularly" />
                    <Label htmlFor="alcohol-regularly">Regularly</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Physical Activity Level</p>
                <RadioGroup
                  value={formData.lifestyle.exercise}
                  onValueChange={(value) => handleLifestyleChange('exercise', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sedentary" id="exercise-sedentary" />
                    <Label htmlFor="exercise-sedentary">Sedentary</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="exercise-moderate" />
                    <Label htmlFor="exercise-moderate">Moderate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="exercise-active" />
                    <Label htmlFor="exercise-active">Active</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <HeartPulse className="h-8 w-8 text-rose-500" />
            <span className="text-2xl font-bold ml-2">HealthQuest</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Complete Your Health Profile</CardTitle>
            <CardDescription>
              Help us personalize your health journey. Your information helps us provide better recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  Step {step} of 3: {
                    step === 1 ? 'Basic Information' :
                    step === 2 ? 'Medical History' :
                    'Lifestyle & Family History'
                  }
                </span>
                <span className="text-sm text-muted-foreground">{Math.round((step/3) * 100)}% complete</span>
              </div>
              <div className="h-2 bg-secondary rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(step/3) * 100}%` }}
                />
              </div>
            </div>

            {renderStep()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              {step === 3 ? 'Complete Profile' : 'Continue'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}