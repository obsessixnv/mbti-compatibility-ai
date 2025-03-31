'use client';

import { useState } from 'react';
import MBTISelector from '@/components/MBTISelector';
import { ArrowRight, Check, Loader2, Brain, Heart, AlertTriangle } from 'lucide-react';

// Helper function to calculate compatibility percentage from text
function calculateCompatibilityScore(text: string, mbtiOne: string | null = null, mbtiTwo: string | null = null): number {
  // If we have both MBTI types, use the standardized compatibility matrix
  if (mbtiOne && mbtiTwo) {
    return getStandardizedCompatibilityScore(mbtiOne, mbtiTwo);
  }
  
  // Fallback to text analysis if MBTI types weren't provided
  if (!text) return 70; // Default score if no text
  
  // Extract compatibility rating if present
  const ratingMatch = text.match(/Compatibility Rating:?\s*([a-zA-Z]+)/i);
  if (ratingMatch) {
    const rating = ratingMatch[1].toLowerCase();
    if (rating.includes('excellent') || rating.includes('very high')) return 95;
    if (rating.includes('good') || rating.includes('high')) return 85;
    if (rating.includes('moderate') || rating.includes('average')) return 70;
    if (rating.includes('challenging') || rating.includes('low')) return 55;
    if (rating.includes('difficult') || rating.includes('very low')) return 45;
  }
  
  // Count positive and negative indicators
  const positiveTerms = [
    'compatible', 'complement', 'harmony', 'balance', 'strength', 'positive', 'benefit',
    'understand', 'communicate', 'valuable', 'enjoy', 'appreciate', 'respect', 'support',
    'growth', 'learn', 'share', 'connect', 'effective', 'successful', 'strong', 'ideal',
    'well', 'advantage', 'enhance', 'excel', 'favorable', 'healthy', 'helpful', 'productive'
  ];
  
  const negativeTerms = [
    'conflict', 'clash', 'tension', 'difficult', 'challenge', 'struggle', 'misunderstand',
    'frustrat', 'stress', 'problem', 'differ', 'opposite', 'disagree', 'incompatible',
    'complicated', 'overwhelming', 'exhausting', 'drain', 'negative', 'issue', 'obstacle',
    'confuse', 'ineffective', 'miscommunication', 'dissatisfaction', 'uncomfortable'
  ];
  
  // Count occurrences
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\w*\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) positiveCount += matches.length;
  });
  
  negativeTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\w*\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) negativeCount += matches.length;
  });
  
  // Calculate score - weighting positive indicators slightly more
  const total = positiveCount + negativeCount;
  if (total === 0) return 70; // Default if no indicators found
  
  const positiveRatio = positiveCount / total;
  const adjustedRatio = positiveRatio * 1.1; // Slight positive bias to avoid overly negative scores
  
  // Convert to percentage but constrain between 40% and 95%
  const score = Math.min(95, Math.max(40, Math.round(adjustedRatio * 100)));
  return score;
}

// Calculate standardized compatibility scores based on cognitive function theory
function getStandardizedCompatibilityScore(typeOne: string, typeTwo: string): number {
  // Create a compatibility matrix for all 16 MBTI types
  // These scores are based on cognitive function compatibility
  const compatibilityMatrix: Record<string, Record<string, number>> = {
    "INTJ": {"INTJ": 75, "INTP": 85, "ENTJ": 80, "ENTP": 80, "INFJ": 80, "INFP": 70, "ENFJ": 65, "ENFP": 75, "ISTJ": 70, "ISFJ": 55, "ESTJ": 65, "ESFJ": 45, "ISTP": 60, "ISFP": 50, "ESTP": 50, "ESFP": 40},
    "INTP": {"INTJ": 85, "INTP": 75, "ENTJ": 85, "ENTP": 85, "INFJ": 75, "INFP": 70, "ENFJ": 70, "ENFP": 70, "ISTJ": 60, "ISFJ": 50, "ESTJ": 60, "ESFJ": 45, "ISTP": 80, "ISFP": 55, "ESTP": 65, "ESFP": 50},
    "ENTJ": {"INTJ": 80, "INTP": 85, "ENTJ": 75, "ENTP": 80, "INFJ": 75, "INFP": 65, "ENFJ": 70, "ENFP": 65, "ISTJ": 75, "ISFJ": 55, "ESTJ": 80, "ESFJ": 50, "ISTP": 65, "ISFP": 50, "ESTP": 60, "ESFP": 45},
    "ENTP": {"INTJ": 80, "INTP": 85, "ENTJ": 80, "ENTP": 70, "INFJ": 85, "INFP": 75, "ENFJ": 65, "ENFP": 75, "ISTJ": 60, "ISFJ": 50, "ESTJ": 70, "ESFJ": 55, "ISTP": 75, "ISFP": 60, "ESTP": 75, "ESFP": 65},
    "INFJ": {"INTJ": 80, "INTP": 75, "ENTJ": 75, "ENTP": 85, "INFJ": 75, "INFP": 85, "ENFJ": 90, "ENFP": 85, "ISTJ": 60, "ISFJ": 70, "ESTJ": 55, "ESFJ": 65, "ISTP": 60, "ISFP": 70, "ESTP": 50, "ESFP": 65},
    "INFP": {"INTJ": 70, "INTP": 70, "ENTJ": 65, "ENTP": 75, "INFJ": 85, "INFP": 75, "ENFJ": 85, "ENFP": 85, "ISTJ": 50, "ISFJ": 65, "ESTJ": 45, "ESFJ": 70, "ISTP": 50, "ISFP": 70, "ESTP": 40, "ESFP": 65},
    "ENFJ": {"INTJ": 65, "INTP": 70, "ENTJ": 70, "ENTP": 65, "INFJ": 90, "INFP": 85, "ENFJ": 75, "ENFP": 80, "ISTJ": 60, "ISFJ": 75, "ESTJ": 50, "ESFJ": 80, "ISTP": 50, "ISFP": 70, "ESTP": 45, "ESFP": 70},
    "ENFP": {"INTJ": 75, "INTP": 70, "ENTJ": 65, "ENTP": 75, "INFJ": 85, "INFP": 85, "ENFJ": 80, "ENFP": 70, "ISTJ": 45, "ISFJ": 65, "ESTJ": 40, "ESFJ": 75, "ISTP": 55, "ISFP": 65, "ESTP": 60, "ESFP": 75},
    "ISTJ": {"INTJ": 70, "INTP": 60, "ENTJ": 75, "ENTP": 60, "INFJ": 60, "INFP": 50, "ENFJ": 60, "ENFP": 45, "ISTJ": 75, "ISFJ": 80, "ESTJ": 85, "ESFJ": 80, "ISTP": 75, "ISFP": 65, "ESTP": 70, "ESFP": 55},
    "ISFJ": {"INTJ": 55, "INTP": 50, "ENTJ": 55, "ENTP": 50, "INFJ": 70, "INFP": 65, "ENFJ": 75, "ENFP": 65, "ISTJ": 80, "ISFJ": 75, "ESTJ": 80, "ESFJ": 90, "ISTP": 65, "ISFP": 80, "ESTP": 55, "ESFP": 75},
    "ESTJ": {"INTJ": 65, "INTP": 60, "ENTJ": 80, "ENTP": 70, "INFJ": 55, "INFP": 45, "ENFJ": 50, "ENFP": 40, "ISTJ": 85, "ISFJ": 80, "ESTJ": 75, "ESFJ": 80, "ISTP": 70, "ISFP": 60, "ESTP": 75, "ESFP": 65},
    "ESFJ": {"INTJ": 45, "INTP": 45, "ENTJ": 50, "ENTP": 55, "INFJ": 65, "INFP": 70, "ENFJ": 80, "ENFP": 75, "ISTJ": 80, "ISFJ": 90, "ESTJ": 80, "ESFJ": 75, "ISTP": 55, "ISFP": 75, "ESTP": 60, "ESFP": 80},
    "ISTP": {"INTJ": 60, "INTP": 80, "ENTJ": 65, "ENTP": 75, "INFJ": 60, "INFP": 50, "ENFJ": 50, "ENFP": 55, "ISTJ": 75, "ISFJ": 65, "ESTJ": 70, "ESFJ": 55, "ISTP": 80, "ISFP": 70, "ESTP": 85, "ESFP": 70},
    "ISFP": {"INTJ": 50, "INTP": 55, "ENTJ": 50, "ENTP": 60, "INFJ": 70, "INFP": 70, "ENFJ": 70, "ENFP": 65, "ISTJ": 65, "ISFJ": 80, "ESTJ": 60, "ESFJ": 75, "ISTP": 70, "ISFP": 75, "ESTP": 70, "ESFP": 80},
    "ESTP": {"INTJ": 50, "INTP": 65, "ENTJ": 60, "ENTP": 75, "INFJ": 50, "INFP": 40, "ENFJ": 45, "ENFP": 60, "ISTJ": 70, "ISFJ": 55, "ESTJ": 75, "ESFJ": 60, "ISTP": 85, "ISFP": 70, "ESTP": 70, "ESFP": 80},
    "ESFP": {"INTJ": 40, "INTP": 50, "ENTJ": 45, "ENTP": 65, "INFJ": 65, "INFP": 65, "ENFJ": 70, "ENFP": 75, "ISTJ": 55, "ISFJ": 75, "ESTJ": 65, "ESFJ": 80, "ISTP": 70, "ISFP": 80, "ESTP": 80, "ESFP": 70}
  };
  
  // Get the compatibility score
  if (compatibilityMatrix[typeOne] && compatibilityMatrix[typeOne][typeTwo]) {
    return compatibilityMatrix[typeOne][typeTwo];
  }
  
  // Fallback if type not found (shouldn't happen with valid MBTI types)
  return 70;
}

// Add this function to determine rating text from score
function getRatingTextFromScore(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 65) return "Good";
  if (score >= 50) return "Moderate";
  return "Challenging";
}

// Component to format compatibility text with rich styling
const FormattedCompatibilityText = ({ text, mbtiOne, mbtiTwo }: { text: string, mbtiOne: string | null, mbtiTwo: string | null }) => {
  if (!text) return null;
  
  // Calculate compatibility percentage using standardized scores
  const score = calculateCompatibilityScore(text, mbtiOne, mbtiTwo);
  
  // Get the nearest 5-multiple for the score class (40, 45, 50, etc.)
  const scoreClass = `score-${Math.round(score / 5) * 5}`;
  
  // Determine compatibility level for text display
  let compatLevel = 'Moderate';
  if (score >= 85) compatLevel = 'Excellent';
  else if (score >= 75) compatLevel = 'Strong';
  else if (score >= 65) compatLevel = 'Good';
  else if (score < 50) compatLevel = 'Challenging';
  
  // Parse the formatted text into sections
  const sections: Record<string, string> = {};
  
  // Extract sections using regex for the exact format we specified
  const overviewMatch = text.match(/## Overview:([\s\S]*?)(?=##|$)/);
  const commStylesMatch = text.match(/## Communication Styles:([\s\S]*?)(?=##|$)/);
  const strengthsMatch = text.match(/## Key Strengths:([\s\S]*?)(?=##|$)/);
  const challengesMatch = text.match(/## Potential Challenges:([\s\S]*?)(?=##|$)/);
  const growthMatch = text.match(/## Growth Opportunities:([\s\S]*?)(?=##|$)/);
  const ratingMatch = text.match(/## Compatibility Rating:([\s\S]*?)(?=##|$)/);
  
  // Store matched content in sections object
  if (overviewMatch) sections['Overview'] = overviewMatch[1].trim();
  if (commStylesMatch) sections['Communication Styles'] = commStylesMatch[1].trim();
  if (strengthsMatch) sections['Key Strengths'] = strengthsMatch[1].trim();
  if (challengesMatch) sections['Potential Challenges'] = challengesMatch[1].trim();
  if (growthMatch) sections['Growth Opportunities'] = growthMatch[1].trim();
  if (ratingMatch) sections['Compatibility Rating'] = ratingMatch[1].trim();
  
  // Parse strengths and challenges bullet points
  const strengths = sections['Key Strengths'] 
    ? sections['Key Strengths']
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('+'))
        .map(line => line.substring(1).trim())
    : [];
    
  const challenges = sections['Potential Challenges']
    ? sections['Potential Challenges']
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.substring(1).trim())
    : [];

  // Determine rating text from score
  const formattedRating = sections['Compatibility Rating'] || getRatingTextFromScore(score);

  return (
    <div className="animate-fade-in">
      {/* Compatibility meter */}
      <div className="compat-meter">
        <div className={`compat-circle ${scoreClass}`} style={{ '--circle-percent': score } as any}>
          {/* Tick marks for percentage reference */}
          <div className="compat-indicators">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className={`compat-indicator ${i % 3 === 0 ? 'compat-indicator-major' : ''}`}
                style={{ '--index': i + 1 } as any} 
              />
            ))}
          </div>
          
          <div className="compat-inner">
            <div className="compat-percentage">{score}<span>%</span></div>
          </div>
        </div>
        <div className="compat-label">
          {compatLevel} Compatibility
        </div>
      </div>
      
      {/* Overview section */}
      {sections['Overview'] && (
        <div className="mb-8">
          <h3 className="section-header">Overview</h3>
          <p className="text-base opacity-90 leading-relaxed">{sections['Overview']}</p>
        </div>
      )}
      
      {/* Strengths and Challenges panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="strengths-panel">
          <h3 className="text-green-500 text-lg font-semibold mb-3 flex items-center">
            <Check className="w-5 h-5 mr-2" /> Key Strengths
          </h3>
          <div className="space-y-2">
            {strengths.length > 0 ? (
              strengths.map((strength, idx) => (
                <div key={idx} className="strength-item">{strength}</div>
              ))
            ) : (
              <p className="text-sm opacity-70">No specific strengths information available</p>
            )}
          </div>
        </div>
        
        <div className="challenges-panel">
          <h3 className="text-red-500 text-lg font-semibold mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" /> Potential Challenges
          </h3>
          <div className="space-y-2">
            {challenges.length > 0 ? (
              challenges.map((challenge, idx) => (
                <div key={idx} className="challenge-item">{challenge}</div>
              ))
            ) : (
              <p className="text-sm opacity-70">No specific challenges information available</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Communication Styles section */}
      {sections['Communication Styles'] && (
        <div className="mb-8">
          <h3 className="section-header">Communication Styles</h3>
          <p className="text-base opacity-90 leading-relaxed">{sections['Communication Styles']}</p>
        </div>
      )}
      
      {/* Growth Opportunities section */}
      {sections['Growth Opportunities'] && (
        <div className="mb-8">
          <h3 className="section-header">Growth Opportunities</h3>
          <p className="text-base opacity-90 leading-relaxed">{sections['Growth Opportunities']}</p>
        </div>
      )}
      
      {/* Compatibility Rating badge */}
      {formattedRating && (
        <div className="flex justify-center mt-10 mb-2">
          <div className={`compat-rating-badge ${scoreClass}`}>
            Compatibility Rating: <span className="font-semibold">{formattedRating}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Loader component
const LoadingIndicator = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative w-20 h-20 mb-4">
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <Brain className="w-16 h-16 text-purple-300" />
      </div>
    </div>
    <p className="text-center text-sm opacity-70">Analyzing compatibility...</p>
  </div>
);

// Main page component
export default function Home() {
  const [mbtiOne, setMbtiOne] = useState<string | null>(null);
  const [mbtiTwo, setMbtiTwo] = useState<string | null>(null);
  const [compatibilityResult, setCompatibilityResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch compatibility data
  const checkCompatibility = async () => {
    if (!mbtiOne || !mbtiTwo) {
      setError("Please select both MBTI types");
      return;
    }

    setLoading(true);
    setError(null);
    setCompatibilityResult(null);

    try {
      const response = await fetch('/api/compatibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mbtiOne,
          mbtiTwo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch compatibility data');
      }

      const data = await response.json();
      setCompatibilityResult(data.result);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // MBTI Celebrity Examples
  const celebrityExamples = [
    { name: "ENFJ", examples: "Barack Obama, Oprah Winfrey" },
    { name: "ENFP", examples: "Robin Williams, Ellen DeGeneres" },
    { name: "ENTJ", examples: "Steve Jobs, Margaret Thatcher" },
    { name: "ENTP", examples: "Robert Downey Jr., Leonardo da Vinci" },
    { name: "ESFJ", examples: "Taylor Swift, Bill Clinton" },
    { name: "ESFP", examples: "Jamie Foxx, Marilyn Monroe" },
    { name: "ESTJ", examples: "Sonia Sotomayor, Judge Judy" },
    { name: "ESTP", examples: "Madonna, Donald Trump" },
    { name: "INFJ", examples: "Martin Luther King Jr., Nicole Kidman" },
    { name: "INFP", examples: "Johnny Depp, Audrey Hepburn" },
    { name: "INTJ", examples: "Elon Musk, Nikola Tesla" },
    { name: "INTP", examples: "Albert Einstein, Marie Curie" },
    { name: "ISFJ", examples: "Queen Elizabeth II, Beyoncé" },
    { name: "ISFP", examples: "Michael Jackson, Bob Dylan" },
    { name: "ISTJ", examples: "Warren Buffett, Queen Victoria" },
    { name: "ISTP", examples: "Clint Eastwood, Scarlett Johansson" },
  ];

  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 heading-gradient">
          MBTI Compatibility Checker
        </h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
          Discover how different MBTI personality types interact in relationships, 
          friendships, and work environments.
        </p>
        
        <div className="premium-card bg-opacity-80 mb-8">
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 items-center">
            <MBTISelector 
              selectedType={mbtiOne} 
              onSelect={setMbtiOne}
              label="Your MBTI Type"
            />

            <div className="flex items-center justify-center py-2">
              <ArrowRight className="w-6 h-6 text-purple-400" />
            </div>

            <MBTISelector 
              selectedType={mbtiTwo} 
              onSelect={setMbtiTwo}
              label="Their MBTI Type"
            />
          </div>
          
          <div className="mt-8 text-center">
            <button 
              className="premium-btn"
              onClick={checkCompatibility}
              disabled={loading || !mbtiOne || !mbtiTwo}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2 inline" />
                  Check Compatibility
                </>
              )}
            </button>
            
            {error && (
              <p className="text-red-500 mt-4 text-sm">{error}</p>
            )}
          </div>
        </div>
      </section>
      
      {/* Results Section */}
      {loading && (
        <section className="premium-card mb-8">
          <LoadingIndicator />
        </section>
      )}
      
      {compatibilityResult && !loading && (
        <section className="premium-card mb-8">
          <div className="compatibility-header">
            <h2 className="text-2xl font-bold">{mbtiOne} + {mbtiTwo} Compatibility</h2>
            <span className="compatibility-badge">Analysis</span>
          </div>
          
          <div className="compatibility-section">
            <FormattedCompatibilityText text={compatibilityResult} mbtiOne={mbtiOne} mbtiTwo={mbtiTwo} />
          </div>
        </section>
      )}
      
      {/* Celebrity Examples */}
      <section className="premium-card">
        <h2 className="text-2xl font-bold mb-6">Famous Personalities by MBTI Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {celebrityExamples.map((type) => (
            <div key={type.name} className="text-center p-3">
              <h3 className="text-lg font-bold text-gradient-gold mb-1">{type.name}</h3>
              <p className="text-sm opacity-75">{type.examples}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
