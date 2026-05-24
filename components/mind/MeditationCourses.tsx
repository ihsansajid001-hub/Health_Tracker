'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Play, CheckCircle, Lock, Calendar, Clock, Star } from 'lucide-react';

interface CourseLesson {
  id: string;
  title: string;
  duration: number; // minutes
  description: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  audioUrl?: string;
}

interface MeditationCourse {
  id: string;
  title: string;
  description: string;
  instructor: string;
  totalDays: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'stress' | 'sleep' | 'focus' | 'anxiety' | 'mindfulness' | 'self-love';
  rating: number;
  enrolledCount: number;
  lessons: CourseLesson[];
  benefits: string[];
  isEnrolled: boolean;
  currentDay: number;
}

const meditationCourses: MeditationCourse[] = [
  {
    id: 'stress-relief-7',
    title: '7 Days of Stress Relief',
    description: 'Learn practical techniques to manage daily stress and find inner calm.',
    instructor: 'Dr. Sarah Chen',
    totalDays: 7,
    difficulty: 'beginner',
    category: 'stress',
    rating: 4.8,
    enrolledCount: 12543,
    isEnrolled: false,
    currentDay: 0,
    benefits: [
      'Reduce daily stress levels',
      'Improve emotional regulation',
      'Better sleep quality',
      'Increased focus and clarity'
    ],
    lessons: [
      {
        id: 'day1',
        title: 'Day 1: Understanding Stress',
        duration: 10,
        description: 'Learn what stress is and how it affects your body and mind.',
        isCompleted: false,
        isUnlocked: true
      },
      {
        id: 'day2',
        title: 'Day 2: Breathing for Calm',
        duration: 12,
        description: 'Master breathing techniques that instantly reduce stress.',
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'day3',
        title: 'Day 3: Body Scan Meditation',
        duration: 15,
        description: 'Release physical tension through guided body awareness.',
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'day4',
        title: 'Day 4: Mindful Observation',
        duration: 12,
        description: 'Practice observing thoughts without judgment.',
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'day5',
        title: 'Day 5: Loving-Kindness for Self',
        duration: 14,
        description: 'Cultivate self-compassion to reduce inner criticism.',
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'day6',
        title: 'Day 6: Stress in Daily Life',
        duration: 16,
        description: 'Apply mindfulness to stressful situations.',
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'day7',
        title: 'Day 7: Creating Your Practice',
        duration: 18,
        description: 'Build a sustainable daily meditation routine.',
        isCompleted: false,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'better-sleep-14',
    title: '14 Days to Better Sleep',
    description: 'Transform your sleep with guided meditations and sleep hygiene practices.',
    instructor: 'Michael Torres',
    totalDays: 14,
    difficulty: 'beginner',
    category: 'sleep',
    rating: 4.9,
    enrolledCount: 8932,
    isEnrolled: false,
    currentDay: 0,
    benefits: [
      'Fall asleep faster',
      'Deeper, more restful sleep',
      'Reduced nighttime anxiety',
      'Better morning energy'
    ],
    lessons: Array.from({ length: 14 }, (_, i) => ({
      id: `sleep-day${i + 1}`,
      title: `Day ${i + 1}: ${[
        'Sleep Foundation', 'Evening Routine', 'Body Relaxation', 'Mind Quieting',
        'Breath for Sleep', 'Progressive Relaxation', 'Sleep Stories',
        'Dealing with Insomnia', 'Sleep Anxiety', 'Deep Rest',
        'Sleep Visualization', 'Night Sounds', 'Sleep Mantras', 'Perfect Sleep'
      ][i]}`,
      duration: 15 + Math.floor(Math.random() * 10),
      description: `Sleep-focused meditation for day ${i + 1} of your journey.`,
      isCompleted: false,
      isUnlocked: i === 0
    }))
  },
  {
    id: 'focus-mastery-21',
    title: '21 Days of Focus Mastery',
    description: 'Develop laser-sharp concentration and mental clarity through advanced techniques.',
    instructor: 'Dr. Lisa Park',
    totalDays: 21,
    difficulty: 'intermediate',
    category: 'focus',
    rating: 4.7,
    enrolledCount: 6721,
    isEnrolled: false,
    currentDay: 0,
    benefits: [
      'Enhanced concentration',
      'Reduced mental distractions',
      'Improved work performance',
      'Greater mental stamina'
    ],
    lessons: Array.from({ length: 21 }, (_, i) => ({
      id: `focus-day${i + 1}`,
      title: `Day ${i + 1}: Focus Training`,
      duration: 20 + Math.floor(Math.random() * 15),
      description: `Advanced focus meditation for day ${i + 1}.`,
      isCompleted: false,
      isUnlocked: i === 0
    }))
  },
  {
    id: 'anxiety-freedom-10',
    title: '10 Days to Anxiety Freedom',
    description: 'Break free from anxiety patterns with evidence-based mindfulness techniques.',
    instructor: 'Dr. James Wilson',
    totalDays: 10,
    difficulty: 'intermediate',
    category: 'anxiety',
    rating: 4.9,
    enrolledCount: 15234,
    isEnrolled: false,
    currentDay: 0,
    benefits: [
      'Reduce anxiety symptoms',
      'Manage panic attacks',
      'Build emotional resilience',
      'Increase confidence'
    ],
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `anxiety-day${i + 1}`,
      title: `Day ${i + 1}: Anxiety Relief`,
      duration: 18 + Math.floor(Math.random() * 12),
      description: `Anxiety-focused meditation for day ${i + 1}.`,
      isCompleted: false,
      isUnlocked: i === 0
    }))
  }
];

export default function MeditationCourses() {
  const [courses, setCourses] = useState<MeditationCourse[]>(meditationCourses);
  const [selectedCourse, setSelectedCourse] = useState<MeditationCourse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);

  const categories = [
    { id: 'all', name: 'All Courses', icon: '🧘‍♀️' },
    { id: 'stress', name: 'Stress Relief', icon: '😌' },
    { id: 'sleep', name: 'Better Sleep', icon: '😴' },
    { id: 'focus', name: 'Focus & Clarity', icon: '🎯' },
    { id: 'anxiety', name: 'Anxiety Relief', icon: '💚' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🌸' },
    { id: 'self-love', name: 'Self-Love', icon: '💖' }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const enrollInCourse = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, isEnrolled: true, currentDay: 1 }
        : course
    ));
  };

  const completeLesson = (courseId: string, lessonId: string) => {
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        const updatedLessons = course.lessons.map((lesson, index) => {
          if (lesson.id === lessonId) {
            return { ...lesson, isCompleted: true };
          }
          // Unlock next lesson
          if (lesson.id === lessonId && index < course.lessons.length - 1) {
            const nextLesson = course.lessons[index + 1];
            return lesson;
          }
          return lesson;
        });

        // Unlock next lesson
        const currentIndex = course.lessons.findIndex(l => l.id === lessonId);
        if (currentIndex < course.lessons.length - 1) {
          updatedLessons[currentIndex + 1].isUnlocked = true;
        }

        const completedLessons = updatedLessons.filter(l => l.isCompleted).length;
        
        return {
          ...course,
          lessons: updatedLessons,
          currentDay: Math.min(completedLessons + 1, course.totalDays)
        };
      }
      return course;
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'intermediate': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'advanced': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || '🧘‍♀️';
  };

  if (currentLesson && selectedCourse) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentLesson(null)}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            ← Back to Course
          </button>
          <button
            onClick={() => {
              completeLesson(selectedCourse.id, currentLesson.id);
              setCurrentLesson(null);
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Mark Complete
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {currentLesson.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {currentLesson.description}
            </p>
          </div>

          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play size={48} className="text-white ml-2" />
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentLesson.duration} minutes
            </div>
          </div>

          <button
            onClick={() => {
              // In a real app, this would start audio playback
              console.log('Starting meditation:', currentLesson.title);
            }}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Start Meditation
          </button>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    const completedLessons = selectedCourse.lessons.filter(l => l.isCompleted).length;
    const progress = (completedLessons / selectedCourse.totalDays) * 100;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedCourse(null)}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            ← Back to Courses
          </button>
          {!selectedCourse.isEnrolled && (
            <button
              onClick={() => enrollInCourse(selectedCourse.id)}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
            >
              Enroll in Course
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="flex items-start space-x-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center text-3xl">
              {getCategoryIcon(selectedCourse.category)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedCourse.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedCourse.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>By {selectedCourse.instructor}</span>
                <span>•</span>
                <span>{selectedCourse.totalDays} days</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span>{selectedCourse.rating}</span>
                </div>
                <span>•</span>
                <span>{selectedCourse.enrolledCount.toLocaleString()} enrolled</span>
              </div>
            </div>
          </div>

          {selectedCourse.isEnrolled && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress: Day {selectedCourse.currentDay} of {selectedCourse.totalDays}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(progress)}% complete
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                What You'll Learn
              </h3>
              <ul className="space-y-2">
                {selectedCourse.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Course Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="text-gray-900 dark:text-white">{selectedCourse.totalDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedCourse.difficulty)}`}>
                    {selectedCourse.difficulty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Time:</span>
                  <span className="text-gray-900 dark:text-white">
                    {Math.round(selectedCourse.lessons.reduce((sum, lesson) => sum + lesson.duration, 0) / 60)}h {selectedCourse.lessons.reduce((sum, lesson) => sum + lesson.duration, 0) % 60}m
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Course Lessons
            </h3>
            <div className="space-y-3">
              {selectedCourse.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    lesson.isCompleted
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : lesson.isUnlocked
                      ? 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                  }`}
                  onClick={() => {
                    if (lesson.isUnlocked && selectedCourse.isEnrolled) {
                      setCurrentLesson(lesson);
                    }
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      lesson.isCompleted
                        ? 'bg-green-600 text-white'
                        : lesson.isUnlocked
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}>
                      {lesson.isCompleted ? (
                        <CheckCircle size={20} />
                      ) : lesson.isUnlocked ? (
                        <Play size={16} />
                      ) : (
                        <Lock size={16} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {lesson.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {lesson.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock size={16} />
                    <span>{lesson.duration}min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Meditation Courses
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Structured multi-day programs to deepen your meditation practice and achieve specific goals.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              selectedCategory === category.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/20'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedCourse(course)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">
                {getCategoryIcon(course.category)}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                {course.difficulty}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {course.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
              {course.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{course.totalDays} days</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={14} className="text-yellow-500 fill-current" />
                <span>{course.rating}</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              By {course.instructor} • {course.enrolledCount.toLocaleString()} enrolled
            </div>
            
            {course.isEnrolled ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-gray-900 dark:text-white">
                    Day {course.currentDay}/{course.totalDays}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-orange-500 h-2 rounded-full"
                    style={{ width: `${(course.currentDay / course.totalDays) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  enrollInCourse(course.id);
                }}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Enroll Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}