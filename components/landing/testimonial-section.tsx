'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChevronLeft, 
  ChevronRight,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    id: 1,
    content: "HealthQuest has completely transformed how I track my health. The gamification makes it fun, and I've maintained a 60-day streak! My doctor loves the detailed reports I can share during appointments.",
    author: "Sarah Johnson",
    role: "Fitness Enthusiast",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    id: 2,
    content: "As someone with a chronic condition, tracking symptoms daily is crucial. HealthQuest makes it engaging instead of a chore. The insights have helped identify triggers I wasn't aware of before.",
    author: "Michael Chen",
    role: "Software Developer",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    id: 3,
    content: "The virtual health companion is adorable and surprisingly motivating! I find myself logging in just to see how it's evolved. Meanwhile, I've become much more aware of my sleep patterns.",
    author: "Emma Rodriguez",
    role: "Teacher",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    id: 4,
    content: "As a healthcare provider, I recommend HealthQuest to my patients. The data they bring to appointments is invaluable, and they're more engaged with their health than ever before.",
    author: "Dr. James Williams",
    role: "Family Physician",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150"
  }
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground">
            Join thousands of users who have transformed their health journey with HealthQuest.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="overflow-hidden relative h-[300px] md:h-[250px]">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full"
            >
              <Card className="border-none shadow-md bg-card">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center px-4">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-lg mb-6">"{testimonials[currentIndex].content}"</p>
                    <Avatar className="h-16 w-16 mb-4">
                      <AvatarImage src={testimonials[currentIndex].avatar} />
                      <AvatarFallback>{testimonials[currentIndex].author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{testimonials[currentIndex].author}</h4>
                      <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {testimonials.map((_, i) => (
              <Button
                key={i}
                variant="ghost"
                size="sm"
                className={`w-2 h-2 p-0 rounded-full ${
                  i === currentIndex ? 'bg-primary' : 'bg-primary/20'
                }`}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
            <Button 
              variant="outline" 
              size="icon"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}