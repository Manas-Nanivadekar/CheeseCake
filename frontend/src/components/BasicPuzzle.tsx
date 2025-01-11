import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Cheesie from './Cheesie'

interface BasicPuzzleProps {
  question: string
  answer: string
  hint: string
}

const BasicPuzzle: React.FC<BasicPuzzleProps> = ({ question, answer, hint }) => {
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleSubmit = () => {
    setIsCorrect(userAnswer.toLowerCase().trim() === answer.toLowerCase().trim())
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Basic Puzzle</CardTitle>
      </CardHeader>
      <CardContent>
        <Cheesie
          emotion={isCorrect === null ? 'thinking' : isCorrect ? 'excited' : 'confused'}
          message={
            isCorrect === null
              ? "Here's a tricky puzzle! Can you solve it?"
              : isCorrect
              ? "Amazing! You've cracked the puzzle!"
              : "That's not quite it. Would you like a hint?"
          }
        />
        <p className="mb-4">{question}</p>
        <Input
          type="text"
          placeholder="Your answer"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="mb-4"
        />
        <div className="flex space-x-2">
          <Button onClick={handleSubmit} className="flex-1">
            Submit Answer
          </Button>
          <Button
            onClick={() => setShowHint(true)}
            variant="outline"
            className="flex-1"
            disabled={showHint}
          >
            Get Hint
          </Button>
        </div>
        {showHint && (
          <p className="mt-4 text-sm text-gray-600">
            <strong>Hint:</strong> {hint}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default BasicPuzzle

