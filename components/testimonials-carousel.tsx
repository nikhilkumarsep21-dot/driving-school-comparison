"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "./ui/button";
import { StarRating } from "./ui/star-rating";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Ahmed Al-Mansoori",
    location: "Dubai Marina",
    rating: 5,
    comment:
      "Excellent platform! Found the perfect driving school near my home. The comparison feature made it so easy to see pricing and reviews at a glance. Highly recommend!",
    image:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    location: "Downtown Dubai",
    rating: 5,
    comment:
      "This website saved me so much time! I was able to compare all the driving schools in my area and read real student reviews. Passed my test on the first try!",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "3",
    name: "Mohammed Hassan",
    location: "Business Bay",
    rating: 5,
    comment:
      "Very user-friendly website with accurate information. The side-by-side comparison helped me choose the best school for my budget and schedule. Great experience overall!",
    image:
      "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "4",
    name: "Priya Sharma",
    location: "Jumeirah",
    rating: 4.5,
    comment:
      "Love how transparent the pricing is on this platform. No hidden fees or surprises. Found a great driving school with excellent instructors thanks to the verified reviews!",
    image:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "5",
    name: "David Chen",
    location: "JBR",
    rating: 5,
    comment:
      "The filtering options are fantastic! I could narrow down schools by location, price, and license type in seconds. Made my decision so much easier and stress-free.",
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0">
              <div className="mx-auto max-w-4xl">
                <div className="relative rounded-3xl bg-white p-8 shadow-soft-lg sm:p-12">
                  <Quote className="absolute left-8 top-8 h-12 w-12 text-gold-100" />

                  <div className="relative z-10">
                    <div className="mb-6 flex justify-center">
                      <StarRating rating={testimonial.rating} size="lg" />
                    </div>

                    <p className="mb-8 text-center text-lg leading-relaxed text-gray-700 sm:text-xl">
                      "{testimonial.comment}"
                    </p>

                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                      <div className="h-16 w-16 overflow-hidden rounded-full bg-gold-100 shadow-soft">
                        {testimonial.image && (
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="font-bold text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          className="h-12 w-12 rounded-full border-2 border-gold-200 bg-white hover:bg-gold-50 hover:border-gold-300"
        >
          <ChevronLeft className="h-5 w-5 text-gold-600" />
        </Button>

        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "w-8 bg-gold-600"
                  : "w-2.5 bg-gold-200 hover:bg-gold-300"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="h-12 w-12 rounded-full border-2 border-gold-200 bg-white hover:bg-gold-50 hover:border-gold-300"
        >
          <ChevronRight className="h-5 w-5 text-gold-600" />
        </Button>
      </div>
    </div>
  );
}
