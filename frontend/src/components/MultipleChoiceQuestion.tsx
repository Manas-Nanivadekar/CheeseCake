import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Cheesie from "./Cheesie";

interface Option {
  id: string;
  text: string;
}

interface MultipleChoiceQuestionProps {
  question: string;
  options: Option[];
  correctAnswer: string;
  onAnswer: (correct: boolean) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  options,
  correctAnswer,
  onAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (selectedOption) {
      const correct = selectedOption === correctAnswer;
      setIsCorrect(correct);
      onAnswer(correct);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Multiple Choice Question
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Cheesie
          emotion={
            isCorrect === null ? "thinking" : isCorrect ? "excited" : "confused"
          }
          message={
            isCorrect === null
              ? "Time for a multiple choice question! What do you think is the right answer?"
              : isCorrect
              ? "Fantastic! You've selected the correct answer!"
              : "Oh no! That's not the right answer. Want to try again?"
          }
        />
        <p className="mb-4">{question}</p>
        <RadioGroup onValueChange={setSelectedOption} className="space-y-2">
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id}>{option.text}</Label>
            </div>
          ))}
        </RadioGroup>
        <Button
          onClick={handleSubmit}
          className="mt-4 w-full"
          disabled={!selectedOption}
        >
          Submit Answer
        </Button>
      </CardContent>
    </Card>
  );
};

export default MultipleChoiceQuestion;
