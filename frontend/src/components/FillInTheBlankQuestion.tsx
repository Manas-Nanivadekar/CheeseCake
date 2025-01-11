import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FeedbackMessage from './FeedbackMessage'

interface FillInTheBlankQuestionProps {
  question: string
  correctAnswer: string
}

const FillInTheBlankQuestion: React.FC<FillInTheBlankQuestionProps> = ({
  question,
  correctAnswer,
}) => {
  const [answer, setAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    const correct = answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
    setIsCorrect(correct)
    setShowFeedback(true)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Type your answer here"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={answer.trim() === ''}
            className="w-full"
          >
            Submit Answer
          </Button>
        </motion.div>
      </CardContent>
      {showFeedback && <FeedbackMessage isCorrect={isCorrect} />}
    </Card>
  )
}

export default FillInTheBlankQuestion