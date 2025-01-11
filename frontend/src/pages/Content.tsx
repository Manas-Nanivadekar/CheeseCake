import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Cheesie from "@/components/Cheesie";
import FillInTheBlanks from "@/components/FillInTheBlankQuestion";
import MultipleChoiceQuestion from "@/components/MultipleChoiceQuestion";
import ArrangeInOrder from "@/components/ArrangeInOrder";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Move the quiz data outside the component
const defaultQuizData = {
  source: "https://lisaapp.in",
  type: "website",
  context:
    "Welcome to the LISA AI learning experience! LISA is an innovative platform that combines artificial intelligence with learning management to create personalized, engaging, and effective learning experiences.",
  questions: {
    mcq: {
      question:
        "What feature of LISA AI helps ensure regulatory adherence through regular training and certifications?",
      options: {
        A: "Compliance Assessments",
        B: "Product Wikis",
        C: "Knowledge Hub",
        D: "Rich Course Library",
      },
      correct_answer: "A",
      explanation:
        "Compliance Assessments are specifically designed to ensure that employees receive regular training and certifications necessary for regulatory adherence. This feature facilitates ongoing education and certification in compliance-related areas, helping organizations stay up-to-date with regulations and avoid potential legal issues.",
    },
    true_false: {
      questions: [
        {
          statement:
            "The integration capabilities of LISA AI are designed to only work with specific, pre-approved tools, limiting its adaptability.",
          answer: false,
          explanation:
            "This statement is false because LISA's integration capabilities are portrayed as being designed to effortlessly connect with a variety of tools according to the provided context, indicating adaptability and a broad range of compatibility rather than limitation to specific tools.",
        },
        {
          statement:
            "Certifications awarded for completed courses can serve to enhance both credibility and motivation among learners.",
          answer: true,
          explanation:
            "This statement is true as the context directly mentions that certifications are awarded for completed courses, enhancing credibility and motivation. This suggests that certifications act as a tangible acknowledgment of achievement, which can validate a learner's effort and knowledge, thereby motivating them and others.",
        },
      ],
    },
    fill_blanks: {
      question:
        "LISA's integration capabilities are designed to effortlessly connect with a variety of tools, ensuring _____ and _____ connections.",
      answers: ["Seamless", "Powerful"],
      explanation:
        "In the context provided, LISA aims to revolutionize learning experiences by offering seamless and powerful connections with its AI (LISA AI), which implies that its integration capabilities are designed to ensure that users can connect effortlessly with various tools without interruptions, and at the same time, these connections are robust and efficient.",
    },
    ranking: {
      scenario:
        "Your organization has recently decided to overhaul its Learning and Development (L&D) strategy to address the rapid pace of technological advancements and the diverse needs of its global workforce.",
      question:
        "What is the correct order of steps to successfully implement LISA in your organization?",
      options: [
        "Step 1: Conduct compliance assessments to identify regulatory training requirements.",
        "Step 2: Customize AI-Based Learning Paths for different employee roles.",
        "Step 3: Integrate LISA with existing tools and systems.",
        "Step 4: Launch a pilot program with a select group of employees to gather feedback.",
      ],
      correct_order: [3, 1, 2, 4],
      explanation:
        "The correct order begins with integrating LISA with existing tools and systems (Step 3) to ensure that all organizational knowledge and resources are accessible through the platform.",
    },
  },
};

const GamefiedQuiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentTrueFalseIndex, setCurrentTrueFalseIndex] = useState(0);
  const navigate = useNavigate();
  const totalSteps = Object.keys(defaultQuizData.questions).length + 1; // +1 for the context step
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
    setShowExplanation(false);
    setIsCorrect(null);
    setCurrentTrueFalseIndex(0);
  };

  const handleAnswer = (correct: boolean) => {
    setIsCorrect(correct);
    setShowExplanation(true);
    if (correct) {
      setScore((prev) => prev + 10);
    }
  };

  const handleTrueFalseAnswer = (answer: boolean) => {
    const currentQuestion =
      defaultQuizData.questions.true_false.questions[currentTrueFalseIndex];
    const isAnswerCorrect = answer === currentQuestion.answer;
    setIsCorrect(isAnswerCorrect);
    setShowExplanation(true);

    if (isAnswerCorrect) {
      setScore((prev) => prev + 10);
    }

    if (
      currentTrueFalseIndex <
      defaultQuizData.questions.true_false.questions.length - 1
    ) {
      setTimeout(() => {
        setCurrentTrueFalseIndex((prev) => prev + 1);
        setShowExplanation(false);
        setIsCorrect(null);
      }, 2000);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                Welcome to the LISA AI Quiz!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Cheesie
                emotion="happy"
                message="Hey there! Ready to learn about LISA AI? Let's get started!"
              />
              <p className="mt-4">{defaultQuizData.context}</p>
              <Button onClick={handleNextStep} className="mt-4">
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <MultipleChoiceQuestion
            question={defaultQuizData.questions.mcq.question}
            options={Object.entries(defaultQuizData.questions.mcq.options).map(
              ([id, text]) => ({ id, text })
            )}
            correctAnswer={defaultQuizData.questions.mcq.correct_answer}
            onAnswer={handleAnswer}
          />
        );
      case 2:
        const currentTFQuestion =
          defaultQuizData.questions.true_false.questions[currentTrueFalseIndex];
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                True or False
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Cheesie
                emotion="pointing"
                message="Let's test your knowledge with some true or false questions!"
              />
              <div className="mb-4">
                <p>{currentTFQuestion.statement}</p>
                <div className="flex space-x-2 mt-2">
                  <Button onClick={() => handleTrueFalseAnswer(true)}>
                    True
                  </Button>
                  <Button onClick={() => handleTrueFalseAnswer(false)}>
                    False
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <FillInTheBlanks
            question={defaultQuizData.questions.fill_blanks.question}
            answers={defaultQuizData.questions.fill_blanks.answers}
            onAnswer={handleAnswer}
          />
        );
      case 4:
        return (
          <ArrangeInOrder
            question={defaultQuizData.questions.ranking.question}
            items={defaultQuizData.questions.ranking.options}
            correctOrder={defaultQuizData.questions.ranking.correct_order}
            onAnswer={handleAnswer}
          />
        );
      default:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                Quiz Completed!
              </CardTitle>
              <Button onClick={() => navigate("/leaderboard")}>
                View Leaderboard
              </Button>
            </CardHeader>
            <CardContent>
              <Cheesie
                emotion="happy"
                message={`Congratulations! You've completed the quiz with a score of ${score} points!`}
              />
              <div className="mt-4 text-center">
                <Sparkles className="inline-block w-8 h-8 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">
                  Your Score: {score} points
                </span>
              </div>
              <Button
                onClick={() => {
                  setCurrentStep(0);
                  setScore(0);
                  setShowExplanation(false);
                  setIsCorrect(null);
                  setCurrentTrueFalseIndex(0);
                }}
                className="mt-4 w-full"
              >
                Restart Quiz
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  const getCurrentExplanation = () => {
    switch (currentStep) {
      case 1:
        return defaultQuizData.questions.mcq.explanation;
      case 2:
        return defaultQuizData.questions.true_false.questions[
          currentTrueFalseIndex
        ].explanation;
      case 3:
        return defaultQuizData.questions.fill_blanks.explanation;
      case 4:
        return defaultQuizData.questions.ranking.explanation;
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-purple-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">
        Welcome to your Learning Adventure!
      </h1>
      <div className="w-full max-w-2xl mb-4">
        <Progress value={progress} className="w-full" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>
      {showExplanation && (
        <Card className="w-full max-w-4xl mt-4">
          <CardContent>
            <Cheesie
              emotion={isCorrect ? "happy" : "pointing"}
              message={
                isCorrect
                  ? "Great job! Here's why:"
                  : "Not quite. Here's the explanation:"
              }
            />
            <p className="mt-2">{getCurrentExplanation()}</p>
            {(currentStep !== 2 ||
              currentTrueFalseIndex ===
                defaultQuizData.questions.true_false.questions.length - 1) && (
              <Button onClick={handleNextStep} className="mt-4 w-full">
                Next Question
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      <div className="mt-4 text-xl font-semibold">
        Current Score: {score} points
      </div>
    </div>
  );
};

export default GamefiedQuiz;
