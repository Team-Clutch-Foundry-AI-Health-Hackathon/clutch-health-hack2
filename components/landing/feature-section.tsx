'use client';

import { motion } from 'framer-motion';
import { 
  Award, 
  Calendar, 
  LineChart, 
  Heart, 
  Lightbulb,
  Tablet,
  BarChart3,
  Trophy
} from 'lucide-react';

const features = [
  {
    icon: <Calendar className="h-6 w-6 text-rose-500" />,
    title: 'Daily Health Check-ins',
    description: 'Quick, engaging daily check-ins track your physical and mental health with smart, adaptive questions.'
  },
  {
    icon: <Trophy className="h-6 w-6 text-amber-500" />,
    title: 'Streaks & Rewards',
    description: 'Build streaks and earn rewards for consistent tracking. Never miss a day with gentle reminders.'
  },
  {
    icon: <Heart className="h-6 w-6 text-rose-500" />,
    title: 'Virtual Health Companion',
    description: 'A digital companion that grows and evolves as you make progress on your health journey.'
  },
  {
    icon: <LineChart className="h-6 w-6 text-indigo-500" />,
    title: 'Visual Health Insights',
    description: 'Beautiful charts and visualizations that help you understand your health patterns over time.'
  },
  {
    icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
    title: 'Personalized Prompts',
    description: 'Smart questions that adapt based on your health profile, previous responses, and goals.'
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-indigo-500" />,
    title: 'Progress Tracking',
    description: 'Track your health journey with level-ups, milestones, and achievements to stay motivated.'
  },
  {
    icon: <Tablet className="h-6 w-6 text-emerald-500" />,
    title: 'Medical Reports',
    description: 'Generate comprehensive health reports to share with your healthcare providers.'
  },
  {
    icon: <Award className="h-6 w-6 text-emerald-500" />,
    title: 'Achievements & Badges',
    description: 'Unlock special badges and achievements as you reach health milestones and complete challenges.'
  }
];

export default function FeatureSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-20" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Turn Health Tracking Into a Rewarding Adventure</h2>
          <p className="text-xl text-muted-foreground">
            Our gamified approach makes daily health journaling enjoyable while collecting valuable data for your wellness journey.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}