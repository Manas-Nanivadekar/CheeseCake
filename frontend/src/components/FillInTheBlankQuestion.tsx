import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cheesie from "./Cheesie";

interface FillInTheBlanksProps {
  question: string;
  answers: string[];
  onAnswer: (correct: boolean) => void;
}

const FillInTheBlanks: React.FC<FillInTheBlanksProps> = ({
  question,
  answers,
  onAnswer,
}) => {
  const [userAnswers, setUserAnswers] = useState<string[]>(
    new Array(answers.length).fill("")
  );
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = () => {
    const correct = userAnswers.every(
      (answer, index) =>
        answer.toLowerCase().trim() === answers[index].toLowerCase().trim()
    );
    setIsCorrect(correct);
    onAnswer(correct);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Fill in the Blanks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Cheesie
          emotion={isCorrect === null ? "pointing" : isCorrect ? "dude" : "sad"}
          message={
            isCorrect === null
              ? "Let's fill in the blanks! Can you complete the sentence?"
              : isCorrect
              ? "Great job! You've filled in all the blanks correctly!"
              : "Oops! That's not quite right. Want to try again?"
          }
        />
        <p className="mb-4">{question}</p>
        <div className="space-y-4">
          {userAnswers.map((answer, index) => (
            <Input
              key={index}
              type="text"
              placeholder={`Blank ${index + 1}`}
              value={answer}
              onChange={(e) => {
                const newAnswers = [...userAnswers];
                newAnswers[index] = e.target.value;
                setUserAnswers(newAnswers);
              }}
            />
          ))}
        </div>
        <Button onClick={handleSubmit} className="mt-4 w-full">
          Check Answer
        </Button>
      </CardContent>
    </Card>
  );
};

export default FillInTheBlanks;
