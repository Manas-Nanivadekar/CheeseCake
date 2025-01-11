import React from "react";
import cheesieHappy from "../../public/cheesie-happy.png";
import cheesieDude from "../../public/cheesie-dude.png";
import cheesieGood from "../../public/cheesie-good.png";
import cheesiePointing from "../../public/cheesie-pointing.png";
import cheesieSad from "../../public/cheesie-sad.png";

interface CheesieProps {
  emotion: "happy" | "dude" | "good" | "pointing" | "sad";
  message: string;
}

const Cheesie: React.FC<CheesieProps> = ({ emotion, message }) => {
  const getImageSrc = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return cheesieHappy;
      case "dude":
        return cheesieDude;
      case "good":
        return cheesieGood;
      case "pointing":
        return cheesiePointing;
      case "sad":
        return cheesieSad;
      default:
        return cheesieHappy;
    }
  };

  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="relative w-16 h-16">
        <img
          src={getImageSrc(emotion)}
          alt={`Cheesie feeling ${emotion}`}
          className="object-fill w-full h-full"
        />
      </div>
      <div className="bg-yellow-100 p-3 rounded-lg max-w-xs">
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Cheesie;
