import React from 'react'

interface CheesieProps {
  emotion: 'happy' | 'thinking' | 'excited' | 'confused'
  message: string
}

const Cheesie: React.FC<CheesieProps> = ({ emotion, message }) => {
  const imageSrc = `/cheesie-${emotion}.png` // Assume we have these images

  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="relative w-16 h-16">
        <img
          src={imageSrc}
          alt={`Cheesie feeling ${emotion}`}
          className='object-fill w-full h-full'
        />
      </div>
      <div className="bg-yellow-100 p-3 rounded-lg max-w-xs">
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}

export default Cheesie

