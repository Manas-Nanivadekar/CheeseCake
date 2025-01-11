import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Cheesie from "./Cheesie";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import FillInTheBlanks from "./FillInTheBlankQuestion";
import ArrangeInOrder from "./ArrangeInOrder";

interface PathwayLearningProps {
  content: {
    title: string;
    context: string; // Theory content
    questions: Array<{
      type: "multiple-choice" | "fill-blanks" | "arrange-order";
      question: string;
      options?: Array<{ id: string; text: string }>;
      correctAnswer?: string;
      answers?: string[];
      items?: string[];
      correctOrder?: number[];
    }>;
  };
}

const PathwayLearning: React.FC<PathwayLearningProps> = ({ content }) => {
  const [showTheory, setShowTheory] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<boolean[]>([]);

  const handleTheoryComplete = () => {
    setShowTheory(false);
  };

  const handleQuestionAnswer = (correct: boolean) => {
    const newCompleted = [...completedQuestions];
    newCompleted[currentQuestionIndex] = correct;
    setCompletedQuestions(newCompleted);

    if (correct && currentQuestionIndex < content.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 1500);
    }
  };

  if (showTheory) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            {content.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Cheesie
            emotion="happy"
            message="Hi! I'm Cheesie, and I'll be your learning companion. Let's start by understanding the basics!"
          />
          <div className="prose max-w-none">{content.context}</div>
          <Button onClick={handleTheoryComplete} className="w-full">
            I'm Ready for the Questions!
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = content.questions[currentQuestionIndex];

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "multiple-choice":
        return (
          <MultipleChoiceQuestion
            question={currentQuestion.question}
            options={currentQuestion.options!}
            correctAnswer={currentQuestion.correctAnswer!}
            onAnswer={handleQuestionAnswer}
          />
        );
      case "fill-blanks":
        return (
          <FillInTheBlanks
            question={currentQuestion.question}
            answers={currentQuestion.answers!}
            onAnswer={handleQuestionAnswer}
          />
        );
      case "arrange-order":
        return (
          <ArrangeInOrder
            question={currentQuestion.question}
            items={currentQuestion.items!}
            correctOrder={currentQuestion.correctOrder!}
            onAnswer={handleQuestionAnswer}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">
          Question {currentQuestionIndex + 1} of {content.questions.length}
        </span>
        <Button variant="outline" onClick={() => setShowTheory(true)}>
          Review Theory
        </Button>
      </div>
      {renderQuestion()}
    </div>
  );
};

export default PathwayLearning;
