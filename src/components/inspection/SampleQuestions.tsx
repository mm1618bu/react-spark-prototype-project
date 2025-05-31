
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';

interface SampleQuestionsProps {
  onQuestionClick: (question: string) => void;
  isMinimized?: boolean;
}

const sampleQuestions = [
  {
    title: "How Data Fuels The Move To Smart Manufacturing",
    description: "Digital transformation is critical to ensuring a positive outcome in..."
  },
  {
    title: "How To Handle Breakdown During Production", 
    description: ""
  },
  {
    title: "Reduce Downtime For Meeting High Demand",
    description: ""
  },
  {
    title: "Leading With Innovation In Smart Factories",
    description: ""
  }
];

export const SampleQuestions = ({ onQuestionClick, isMinimized = false }: SampleQuestionsProps) => {
  if (isMinimized) return null;

  return (
    <div className="mb-6">
      <div className="flex justify-center mb-8">
        <div className="flex flex-col items-center">
          <Logo />
          <p className="text-gray-600 text-sm mt-2">Discover Infinite Wisdom</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sampleQuestions.map((question, index) => (
          <Card 
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow border"
            onClick={() => onQuestionClick(question.title)}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-semibold leading-tight">
                {question.title}
              </CardTitle>
            </CardHeader>
            {question.description && (
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-gray-600">{question.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
