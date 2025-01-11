import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import Cheesie from './Cheesie'

interface ArrangeInOrderProps {
  question: string
  items: string[]
  correctOrder: number[]
  onAnswer: (correct: boolean) => void
}

const ArrangeInOrder: React.FC<ArrangeInOrderProps> = ({ question, items, correctOrder, onAnswer }) => {
  const [currentOrder, setCurrentOrder] = useState(items)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const newItems = Array.from(currentOrder)
    const [reorderedItem] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, reorderedItem)
    setCurrentOrder(newItems)
  }

  const handleSubmit = () => {
    const isOrderCorrect = currentOrder.every(
      (item, index) => items.indexOf(item) === correctOrder[index] - 1
    )
    setIsCorrect(isOrderCorrect)
    onAnswer(isOrderCorrect) // Call the onAnswer callback with the result
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Arrange in Correct Order</CardTitle>
      </CardHeader>
      <CardContent>
        <Cheesie
          emotion={isCorrect === null ? 'thinking' : isCorrect ? 'excited' : 'confused'}
          message={
            isCorrect === null
              ? "Let's put these in order! Drag and drop the items to arrange them correctly."
              : isCorrect
                ? "Wow! You've arranged everything perfectly!"
                : "Hmm, that's not quite right. Want to try rearranging them?"
          }
        />
        <p className="mb-4">{question}</p>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided: any) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {currentOrder.map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index}>
                    {(provided: any) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-2 bg-gray-100 rounded cursor-move"
                      >
                        {item}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <Button onClick={handleSubmit} className="mt-4 w-full">
          Check Order
        </Button>
      </CardContent>
    </Card>
  )
}

export default ArrangeInOrder