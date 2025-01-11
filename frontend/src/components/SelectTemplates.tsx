import { X } from 'lucide-react'
import { motion } from 'framer-motion'

interface SelectedTemplatesProps {
  templates: { id: string; title: string }[]
  selectedIds: string[]
  onRemove: (id: string) => void
}

const SelectedTemplates: React.FC<SelectedTemplatesProps> = ({ templates, selectedIds, onRemove }) => {
  const selectedTemplates = templates.filter(t => selectedIds.includes(t.id))

  if (selectedTemplates.length === 0) return null

  return (
    <div className="mt-6 mb-8">
      <h4 className="text-lg font-medium text-[#0A0B1F] mb-3">Selected Templates:</h4>
      <div className="flex flex-wrap gap-2">
        {selectedTemplates.map(template => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-[#94a4ff]/20 text-[#0A0B1F] px-3 py-1 rounded-full flex items-center"
          >
            <span className="mr-2">{template.title}</span>
            <button
              onClick={() => onRemove(template.id)}
              className="text-[#0A0B1F]/60 hover:text-[#0A0B1F] transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SelectedTemplates

