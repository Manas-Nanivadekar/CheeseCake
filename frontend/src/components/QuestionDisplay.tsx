import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import FeedbackMessage from './FeedbackMessage'

interface Option {
  id: string
  text: string
}

interface QuestionDisplayProps {
  question: string
  options: Option[]
  correctAnswer: string
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  options,
  correctAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    if (selectedOption) {
      const correct = selectedOption === correctAnswer
      setIsCorrect(correct)
      setShowFeedback(true)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={(value) => setSelectedOption(value)}
          className="space-y-4"
        >
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="text-lg">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption}
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

export default QuestionDisplay