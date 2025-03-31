import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { mbtiOne, mbtiTwo } = await request.json();

    if (!mbtiOne || !mbtiTwo) {
      return NextResponse.json(
        { error: 'Both MBTI types are required' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: `You are an expert on MBTI personality types and compatibility between different types. 
          You analyze relationships based on cognitive functions and psychological theory.
          
          YOU MUST FORMAT YOUR RESPONSE EXACTLY AS SHOWN BELOW, including all headers and using the exact same bullet point format with + and - symbols:
          
          ## Overview:
          [Brief overview of how these two types interact - 2-3 sentences only]
          
          ## Communication Styles:
          [Brief description of communication dynamics - 2-3 sentences only]
          
          ## Key Strengths:
          + [First strength with concrete example]
          + [Second strength with concrete example]
          + [Third strength with concrete example]
          
          ## Potential Challenges:
          - [First challenge with concrete example]
          - [Second challenge with concrete example]
          - [Third challenge with concrete example]
          
          ## Growth Opportunities:
          [Brief description of how these types can help each other grow - 2-3 sentences only]
          
          ## Compatibility Rating:
          [ONE of these exact words: Excellent, Strong, Good, Moderate, or Challenging]
          
          Note: Each section must be formatted EXACTLY as shown. The "+" and "-" symbols MUST appear at the beginning of each bullet point in the strengths and challenges sections.
          Keep the total response under 500 words and focused on practical insights.` 
        },
        { 
          role: 'user', 
          content: `Analyze the compatibility between ${mbtiOne} (${getMBTIDescription(mbtiOne)}) and ${mbtiTwo} (${getMBTIDescription(mbtiTwo)}) in relationships, friendships, and work environments.
          
          Focus on:
          - Cognitive function interactions
          - Communication patterns
          - Value conflicts and alignments
          - How they complement or challenge each other
          
          Remember to strictly follow the template format with the exact headers and bullet points with + and - symbols.`
        }
      ],
      temperature: 0.3,
      max_tokens: 1200,
    });

    return NextResponse.json({
      result: response.choices[0].message.content
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to get MBTI compatibility data' },
      { status: 500 }
    );
  }
}

// Helper function to get MBTI descriptions
function getMBTIDescription(type: string): string {
  const descriptions: Record<string, string> = {
    INTJ: 'Architect', INTP: 'Logician', ENTJ: 'Commander', ENTP: 'Debater',
    INFJ: 'Advocate', INFP: 'Mediator', ENFJ: 'Protagonist', ENFP: 'Campaigner',
    ISTJ: 'Logistician', ISFJ: 'Defender', ESTJ: 'Executive', ESFJ: 'Consul',
    ISTP: 'Virtuoso', ISFP: 'Adventurer', ESTP: 'Entrepreneur', ESFP: 'Entertainer'
  };
  
  return descriptions[type] || type;
} 