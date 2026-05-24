'use client';

import { useState } from 'react';
import { Brain, CheckCircle, ArrowRight, Lightbulb, Target } from 'lucide-react';

interface CBTTechnique {
  id: string;
  name: string;
  category: 'thought-challenging' | 'behavioral' | 'mindfulness' | 'problem-solving';
  description: string;
  steps: string[];
  example?: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
}

const cbtTechniques: CBTTechnique[] = [
  {
    id: 'thought-record',
    name: 'Thought Record',
    category: 'thought-challenging',
    description: 'Identify and challenge negative thought patterns by examining evidence.',
    steps: [
      'Identify the triggering situation',
      'Notice your automatic thoughts',
      'Rate your emotional intensity (1-10)',
      'Examine evidence for and against the thought',
      'Create a balanced, realistic thought',
      'Re-rate your emotional intensity'
    ],
    example: 'Situation: Failed a test. Thought: "I\'m stupid." Balanced: "I didn\'t prepare enough this time, but I can improve."',
    duration: '10-15 minutes',
    difficulty: 'beginner',
    benefits: ['Reduces negative thinking', 'Improves emotional regulation', 'Increases self-awareness']
  },
  {
    id: 'behavioral-activation',
    name: 'Behavioral Activation',
    category: 'behavioral',
    description: 'Schedule pleasant and meaningful activities to improve mood and motivation.',
    steps: [
      'List activities you used to enjoy',
      'Rate each activity for pleasure (1-10)',
      'Rate each activity for mastery/accomplishment (1-10)',
      'Schedule 2-3 activities for this week',
      'Start with small, achievable goals',
      'Track your mood before and after activities'
    ],
    duration: '20-30 minutes planning',
    difficulty: 'beginner',
    benefits: ['Increases motivation', 'Improves mood', 'Builds sense of accomplishment']
  },
  {
    id: 'grounding-5-4-3-2-1',
    name: '5-4-3-2-1 Grounding',
    category: 'mindfulness',
    description: 'Use your senses to ground yourself in the present moment during anxiety.',
    steps: [
      'Name 5 things you can see',
      'Name 4 things you can touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste'
    ],
    duration: '3-5 minutes',
    difficulty: 'beginner',
    benefits: ['Reduces anxiety', 'Increases present-moment awareness', 'Calms nervous system']
  },
  {
    id: 'problem-solving',
    name: 'Structured Problem Solving',
    category: 'problem-solving',
    description: 'Break down overwhelming problems into manageable steps.',
    steps: [
      'Define the problem clearly and specifically',
      'Brainstorm all possible solutions (no judgment)',
      'Evaluate pros and cons of each solution',
      'Choose the best solution to try first',
      'Create an action plan with specific steps',
      'Implement and evaluate the results'
    ],
    duration: '15-25 minutes',
    difficulty: 'intermediate',
    benefits: ['Reduces overwhelm', 'Improves decision-making', 'Increases sense of control']
  },
  {
    id: 'cognitive-defusion',
    name: 'Cognitive Defusion',
    category: 'mindfulness',
    description: 'Create distance from unhelpful thoughts by changing how you relate to them.',
    steps: [
      'Notice the unhelpful thought',
      'Say "I\'m having the thought that..."',
      'Sing the thought to a silly tune',
      'Imagine the thought in a cartoon character\'s voice',
      'Thank your mind for the thought',
      'Choose whether to engage with it or let it pass'
    ],
    duration: '5-10 minutes',
    difficulty: 'intermediate',
    benefits: ['Reduces thought fusion', 'Increases psychological flexibility', 'Decreases rumination']
  },
  {
    id: 'values-clarification',
    name: 'Values Clarification',
    category: 'behavioral',
    description: 'Identify your core values to guide meaningful action and decision-making.',
    steps: [
      'Review a list of common values (family, creativity, health, etc.)',
      'Choose your top 10 values',
      'Narrow down to your top 5 core values',
      'For each value, write why it\'s important to you',
      'Identify one action you can take this week for each value',
      'Schedule these value-based actions'
    ],
    duration: '20-30 minutes',
    difficulty: 'advanced',
    benefits: ['Increases life satisfaction', 'Improves decision-making', 'Enhances motivation']
  }
];

export default function CBTTechniques() {
  const [selectedTechnique, setSelectedTechnique] = useState<CBTTechnique | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Techniques', icon: '🧠' },
    { id: 'thought-challenging', name: 'Thought Challenging', icon: '💭' },
    { id: 'behavioral', name: 'Behavioral', icon: '🎯' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🧘‍♀️' },
    { id: 'problem-solving', name: 'Problem Solving', icon: '🔍' }
  ];

  const filteredTechniques = selectedCategory === 'all' 
    ? cbtTechniques 
    : cbtTechniques.filter(t => t.category === selectedCategory);

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  const resetProgress = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'intermediate': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'advanced': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  if (selectedTechnique) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedTechnique(null);
              resetProgress();
            }}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            ← Back to Techniques
          </button>
          <button
            onClick={resetProgress}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Reset Progress
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedTechnique.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedTechnique.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedTechnique.duration}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
            </div>
            <div className="text-center">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedTechnique.difficulty)}`}>
                {selectedTechnique.difficulty}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Difficulty</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {completedSteps.length}/{selectedTechnique.steps.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Steps Complete</div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Steps to Follow:
            </h3>
            {selectedTechnique.steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                  completedSteps.includes(index)
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <button
                  onClick={() => handleStepComplete(index)}
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    completedSteps.includes(index)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-green-600 hover:text-white'
                  }`}
                >
                  {completedSteps.includes(index) ? (
                    <CheckCircle size={16} />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </button>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">{step}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Example */}
          {selectedTechnique.example && (
            <div className="bg-orange-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb size={20} className="text-orange-500 dark:text-orange-400" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Example:</h4>
              </div>
              <p className="text-blue-800 dark:text-blue-200">{selectedTechnique.example}</p>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Target size={20} className="text-purple-600 dark:text-purple-400" />
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">Benefits:</h4>
            </div>
            <ul className="space-y-2">
              {selectedTechnique.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-2 text-purple-800 dark:text-purple-200">
                  <ArrowRight size={16} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          CBT Techniques
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Evidence-based cognitive behavioral therapy techniques to improve mental health and well-being.
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

      {/* Techniques Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechniques.map((technique) => (
          <div
            key={technique.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedTechnique(technique)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {technique.name}
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(technique.difficulty)}`}>
                {technique.difficulty}
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              {technique.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>{technique.duration}</span>
              <span>{technique.steps.length} steps</span>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {technique.benefits.slice(0, 2).map((benefit, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
                >
                  {benefit}
                </span>
              ))}
              {technique.benefits.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                  +{technique.benefits.length - 2} more
                </span>
              )}
            </div>
            
            <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
              Start Technique
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}