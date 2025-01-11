import { motion } from 'framer-motion'

interface HighlightBoxProps {
  children: React.ReactNode
  color: string
}

const HighlightBox = ({ children, color }: HighlightBoxProps) => {
  return (
    <motion.span
      className={`inline-flex items-center rounded-lg px-2 py-1 ${color}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
      <motion.span
        className="ml-1"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        
      </motion.span>
    </motion.span>
  )
}

export default HighlightBox

