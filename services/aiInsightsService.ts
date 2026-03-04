import { LifeScore, WeeklyReport } from '@/types';

interface WeeklyData {
  lifeScore: LifeScore;
  previousScore?: number;
  streakDays: number;
  missedDays: number;
}

export class AIInsightsService {
  private static GROQ_API_KEY = process.env.GROQ_API_KEY;
  private static GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  // Generate AI-powered weekly insights using Groq
  static async generateWeeklyInsights(data: WeeklyData): Promise<{
    insights: string[];
    recommendations: string[];
  }> {
    if (!this.GROQ_API_KEY) {
      // Fallback to rule-based if no API key
      return this.generateRuleBasedInsights(data);
    }

    try {
      const prompt = this.buildPrompt(data);
      
      const response = await fetch(this.GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a wellness coach providing lifestyle optimization insights. Focus on actionable advice for sleep, fitness, nutrition, mental health, and hydration. Never provide medical diagnosis or treatment. Keep responses concise and motivating.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Groq API request failed');
      }

      const result = await response.json();
      const content = result.choices[0]?.message?.content || '';
      
      return this.parseAIResponse(content);
    } catch (error) {
      console.error('AI Insights Error:', error);
      return this.generateRuleBasedInsights(data);
    }
  }

  // Build prompt for AI
  private static buildPrompt(data: WeeklyData): string {
    const { lifeScore, previousScore, streakDays, missedDays } = data;
    const change = previousScore ? lifeScore.overall - previousScore : 0;

    return `
Analyze this user's weekly wellness data and provide insights:

Overall Life Score: ${lifeScore.overall}/100 ${change !== 0 ? `(${change > 0 ? '+' : ''}${change} from last week)` : ''}

Category Scores:
- Sleep: ${lifeScore.sleep}/100
- Fitness: ${lifeScore.fitness}/100
- Nutrition: ${lifeScore.nutrition}/100
- Mind: ${lifeScore.mind}/100
- Hydration: ${lifeScore.hydration}/100
- Consistency: ${lifeScore.consistency}/100

Tracking Stats:
- Current streak: ${streakDays} days
- Missed days: ${missedDays}

Provide:
1. Three key insights about their performance (be specific and data-driven)
2. Three actionable recommendations for improvement

Format as:
INSIGHTS:
- [insight 1]
- [insight 2]
- [insight 3]

RECOMMENDATIONS:
- [recommendation 1]
- [recommendation 2]
- [recommendation 3]

Keep it motivating and actionable. Focus on the weakest areas but celebrate strengths.
`;
  }

  // Parse AI response
  private static parseAIResponse(content: string): {
    insights: string[];
    recommendations: string[];
  } {
    const insights: string[] = [];
    const recommendations: string[] = [];

    const insightsMatch = content.match(/INSIGHTS:([\s\S]*?)(?=RECOMMENDATIONS:|$)/i);
    const recommendationsMatch = content.match(/RECOMMENDATIONS:([\s\S]*?)$/i);

    if (insightsMatch) {
      const insightLines = insightsMatch[1].trim().split('\n');
      insightLines.forEach(line => {
        const cleaned = line.replace(/^[-*]\s*/, '').trim();
        if (cleaned) insights.push(cleaned);
      });
    }

    if (recommendationsMatch) {
      const recLines = recommendationsMatch[1].trim().split('\n');
      recLines.forEach(line => {
        const cleaned = line.replace(/^[-*]\s*/, '').trim();
        if (cleaned) recommendations.push(cleaned);
      });
    }

    // Ensure we have at least 3 of each
    while (insights.length < 3) insights.push('Keep tracking your daily habits consistently.');
    while (recommendations.length < 3) recommendations.push('Focus on improving your lowest scoring area.');

    return {
      insights: insights.slice(0, 3),
      recommendations: recommendations.slice(0, 3),
    };
  }

  // Rule-based fallback insights
  private static generateRuleBasedInsights(data: WeeklyData): {
    insights: string[];
    recommendations: string[];
  } {
    const { lifeScore, previousScore, streakDays } = data;
    const insights: string[] = [];
    const recommendations: string[] = [];

    // Analyze scores
    const scores = [
      { name: 'Sleep', value: lifeScore.sleep },
      { name: 'Fitness', value: lifeScore.fitness },
      { name: 'Nutrition', value: lifeScore.nutrition },
      { name: 'Mind', value: lifeScore.mind },
      { name: 'Hydration', value: lifeScore.hydration },
    ];

    const sorted = scores.sort((a, b) => b.value - a.value);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];

    // Generate insights
    if (previousScore) {
      const change = lifeScore.overall - previousScore;
      if (change > 5) {
        insights.push(`Great progress! Your Life Score improved by ${change} points this week.`);
      } else if (change < -5) {
        insights.push(`Your score dropped by ${Math.abs(change)} points. Let's identify what changed.`);
      } else {
        insights.push(`Your score remained stable at ${lifeScore.overall}. Consistency is key!`);
      }
    }

    insights.push(`Your strongest area is ${strongest.name} with a score of ${strongest.value}/100.`);
    insights.push(`${weakest.name} needs attention with a score of ${weakest.value}/100.`);

    // Generate recommendations
    if (weakest.value < 50) {
      recommendations.push(`Focus on improving your ${weakest.name.toLowerCase()} - it's your biggest opportunity for growth.`);
    }

    if (lifeScore.consistency < 70) {
      recommendations.push('Try to track your habits daily for better insights and consistency.');
    }

    if (lifeScore.sleep < 70) {
      recommendations.push('Aim for 7-9 hours of quality sleep each night. Consider a consistent bedtime routine.');
    }

    if (lifeScore.hydration < 70) {
      recommendations.push('Increase your water intake. Try setting hourly reminders to drink water.');
    }

    if (lifeScore.fitness < 60) {
      recommendations.push('Aim for at least 3-4 workouts per week. Start small and build consistency.');
    }

    if (streakDays >= 7) {
      recommendations.push(`Amazing ${streakDays}-day streak! Keep the momentum going.`);
    }

    return {
      insights: insights.slice(0, 3),
      recommendations: recommendations.slice(0, 3),
    };
  }
}
