'use client';

import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Manager',
    image: '👩‍💼',
    rating: 5,
    text: 'PeaceHub gave me the strength to overcome my anxiety. The compassionate insights provided unwavering support, and I\'ve found a renewed sense of purpose and tranquility in my life.',
  },
  {
    name: 'Michael Chen',
    role: 'Software Engineer',
    image: '👨‍💻',
    rating: 5,
    text: 'PeaceHub has been a true lifeline for me during some of my darkest moments. As someone who has battled stress and burnout for years, finding a platform like PeaceHub has been a game-changer.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Fitness Instructor',
    image: '👩‍🏫',
    rating: 5,
    text: 'The supportive community on PeaceHub has been an invaluable source of comfort. Knowing that I\'m not alone and I can connect with others who truly understand has transformed my wellness journey.',
  },
  {
    name: 'David Thompson',
    role: 'Entrepreneur',
    image: '👨‍💼',
    rating: 5,
    text: 'The AI insights are incredibly accurate and helpful. PeaceHub helped me optimize my sleep and productivity, leading to better business decisions and overall life satisfaction.',
  },
  {
    name: 'Lisa Park',
    role: 'Teacher',
    image: '👩‍🏫',
    rating: 5,
    text: 'I love how easy it is to track everything in one place. The Life Score gives me a clear picture of my wellness, and the recommendations are always spot-on and actionable.',
  },
  {
    name: 'James Wilson',
    role: 'Student',
    image: '👨‍🎓',
    rating: 5,
    text: 'As a busy student, PeaceHub helps me balance my studies, fitness, and mental health. The streak system keeps me motivated, and I\'ve never felt better!',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our <span className="gradient-text">Community</span> Says
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of people who have transformed their lives with PeaceHub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-xl transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
