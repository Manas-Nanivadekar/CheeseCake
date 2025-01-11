import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import FeedbackMessage from './FeedbackMessage'

interface Option {
  id: string
  text: string
}

interface MultipleChoiceQuestionProps {
  question: string
  options: Option[]
  correctAnswers: string[]
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  options,
  correctAnswers,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleOptionChange = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    )
  }

  const handleSubmit = () => {
    const correct =
      selectedOptions.length === correctAnswers.length &&
      selectedOptions.every((option) => correctAnswers.includes(option))
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
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={selectedOptions.includes(option.id)}
                onCheckedChange={() => handleOptionChange(option.id)}
              />
              <Label htmlFor={option.id} className="text-lg">
                {option.text}
              </Label>
            </div>
          ))}
        </div>
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0}
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

export default MultipleChoiceQuestion