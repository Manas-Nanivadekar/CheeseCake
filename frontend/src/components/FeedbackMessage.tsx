import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

interface FeedbackMessageProps {
  isCorrect: boolean
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ isCorrect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={isCorrect ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"}>
        <CardContent className="flex items-center justify-center p-6">
          <Sparkles className={`w-8 h-8 ${isCorrect ? "text-green-500" : "text-red-500"} mr-2`} />
          <span className={`text-2xl font-bold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
            {isCorrect ? "Well Done!" : "Try Again!"}
          </span>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default FeedbackMessage