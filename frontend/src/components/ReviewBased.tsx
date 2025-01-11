import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Cheesie from './Cheesie'

interface ReviewBasedQuestionProps {
  question: string
  minWords: number
}

const ReviewBasedQuestion: React.FC<ReviewBasedQuestionProps> = ({ question, minWords }) => {
  const [answer, setAnswer] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const wordCount = answer.trim().split(/\s+/).length

  const handleSubmit = () => {
    if (wordCount >= minWords) {
      setIsSubmitted(true)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Review Question</CardTitle>
      </CardHeader>
      <CardContent>
        <Cheesie
          emotion={isSubmitted ? 'excited' : 'thinking'}
          message={
            isSubmitted
              ? "Great job on your review! Your thoughts are valuable."
              : `Let's dive deep! Can you write a review of at least ${minWords} words?`
          }
        />
        <p className="mb-4">{question}</p>
        <Textarea
          placeholder="Write your review here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={6}
          className="mb-2"
        />
        <p className="text-sm text-gray-500 mb-4">
          Word count: {wordCount} / {minWords} minimum
        </p>
        <Button onClick={handleSubmit} className="w-full" disabled={wordCount < minWords || isSubmitted}>
          {isSubmitted ? 'Submitted' : 'Submit Review'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default ReviewBasedQuestion

