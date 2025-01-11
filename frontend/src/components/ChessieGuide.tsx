"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

interface CheesieGuideProps {
  currentStep: 'upload' | 'name' | 'templates' | 'build'
  onComplete?: () => void
}

export function CheesieGuide({ currentStep, onComplete }: CheesieGuideProps) {
  const [progress, setProgress] = useState(0)
  const [showGuide, setShowGuide] = useState(true)

  const steps = {
    upload: {
      message: "Hi! I'm Cheesie! Let's start by uploading your content or providing a URL. This will be the foundation of your learning pathway!",
      progress: 25
    },
    name: {
      message: "Great progress! Now let's give your pathway a memorable name that reflects its purpose.",
      progress: 50
    },
    templates: {
      message: "You're doing great! Choose from these awesome templates to make your pathway more engaging and interactive!",
      progress: 75
    },
    build: {
      message: "Amazing work! You're ready to build your pathway. Click the button below to create something awesome!",
      progress: 100
    }
  }

  useEffect(() => {
    setProgress(steps[currentStep].progress)
  }, [currentStep])

  return (
    <AnimatePresence>
      {showGuide && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 flex items-end gap-4 z-50"
        >
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-primary">Step {steps[currentStep].progress / 25} of 4</h3>
              <button
                onClick={() => setShowGuide(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">{steps[currentStep].message}</p>
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-xs text-gray-400 text-right">{progress}% Complete</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/direction-T5uSb4DvTlHO8GjYgSAdkDbdFyIhgd.png"
              alt="Cheesie Guide"
              className="w-[80px] h-[80px] object-contain cursor-pointer"
              onClick={() => {
                if (progress === 100) {
                  onComplete?.()
                }
              }}
            />
            {progress === 100 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ✓
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
