import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import Cheesie from "./Cheesie";

interface ArrangeInOrderProps {
  question: string;
  items: string[];
  correctOrder: number[];
  onAnswer: (correct: boolean) => void;
}

const ArrangeInOrder: React.FC<ArrangeInOrderProps> = ({
  question,
  items,
  correctOrder,
  onAnswer,
}) => {
  const [currentOrder, setCurrentOrder] = useState(items);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(currentOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCurrentOrder(items);
  };

  const handleSubmit = () => {
    const isOrderCorrect = currentOrder.every(
      (item, index) => items.indexOf(item) === correctOrder[index] - 1
    );
    setIsCorrect(isOrderCorrect);
    onAnswer(isOrderCorrect);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Arrange in Correct Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Cheesie
          emotion={isCorrect === null ? "pointing" : isCorrect ? "dude" : "sad"}
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
          <Droppable droppableId="droppable">
            {(provided: any) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {currentOrder.map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-4 rounded-lg select-none touch-none
                          ${
                            snapshot.isDragging
                              ? "bg-primary/10 shadow-lg"
                              : "bg-secondary hover:bg-secondary/80"
                          }
                          transition-colors duration-200`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-primary/50">{index + 1}</div>
                          <div className="select-none">{item}</div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Button onClick={handleSubmit} className="mt-4 w-full">
          Check Order
        </Button>
      </CardContent>
    </Card>
  );
};

export default ArrangeInOrder;
