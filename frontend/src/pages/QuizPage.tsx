import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import QuestionDisplay from '@/components/QuestionDisplay'
import MultipleChoiceQuestion from '@/components/MultipleChoiceQuestion'
import FillInTheBlankQuestion from '@/components/FillInTheBlankQuestion'
import Leaderboard from '@/components/Leaderboard'

interface Option {
  id: string
  text: string
}

interface BaseQuestion {
  question: string
}

interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single'
  options: Option[]
  correctAnswer: string
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple'
  options: Option[]
  correctAnswers: string[]
}

interface FillInTheBlankQuestion extends BaseQuestion {
  type: 'fillInTheBlank'
  correctAnswer: string
}

type Question = SingleChoiceQuestion | MultipleChoiceQuestion | FillInTheBlankQuestion

interface LeaderboardEntry {
  id: string
  name: string
  score: number
}

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const questions: Question[] = [
    {
      type: 'single',
      question: "What is the capital of France?",
      options: [
        { id: "a", text: "London" },
        { id: "b", text: "Berlin" },
        { id: "c", text: "Paris" },
        { id: "d", text: "Madrid" },
      ],
      correctAnswer: "c",
    },
    {
      type: 'multiple',
      question: "Which of the following are primary colors?",
      options: [
        { id: "a", text: "Red" },
        { id: "b", text: "Green" },
        { id: "c", text: "Blue" },
        { id: "d", text: "Yellow" },
      ],
      correctAnswers: ["a", "c", "d"],
    },
    {
      type: 'fillInTheBlank',
      question: "The largest planet in our solar system is _______.",
      correctAnswer: "Jupiter",
    },
  ]

  const leaderboardEntries: LeaderboardEntry[] = [
    { id: "1", name: "Alice", score: 1200 },
    { id: "2", name: "Bob", score: 1100 },
    { id: "3", name: "Charlie", score: 1000 },
    { id: "4", name: "David", score: 900 },
    { id: "5", name: "Eve", score: 800 },
  ]

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length)
  }

  const currentQuestionData = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 flex flex-col items-center justify-center p-4 space-y-8">
      {currentQuestionData.type === 'single' && (
        <QuestionDisplay
          question={currentQuestionData.question}
          options={currentQuestionData.options}
          correctAnswer={currentQuestionData.correctAnswer}
        />
      )}
      {currentQuestionData.type === 'multiple' && (
        <MultipleChoiceQuestion
          question={currentQuestionData.question}
          options={currentQuestionData.options}
          correctAnswers={currentQuestionData.correctAnswers}
        />
      )}
      {currentQuestionData.type === 'fillInTheBlank' && (
        <FillInTheBlankQuestion
          question={currentQuestionData.question}
          correctAnswer={currentQuestionData.correctAnswer}
        />
      )}
      <Button onClick={handleNextQuestion}>Next Question</Button>
      <Leaderboard entries={leaderboardEntries} />
    </div>
  )
}

export default Quiz