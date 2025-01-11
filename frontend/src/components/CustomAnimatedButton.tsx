import {
  BookOpen,
  GraduationCap,
  Library,
  Lightbulb,
  Brain,
} from "lucide-react";

interface AnimatedButtonProps {
  text?: string;
}

const AnimatedButton = ({ text }: AnimatedButtonProps) => {
  return (
    <div className="relative inline-block">
      <button
        className="relative px-8 py-3 bg-amber-100 text-gray-800 font-bold text-lg rounded-lg 
        shadow-md hover:rounded-t-lg hover:rounded-b-3xl transition-all duration-300
        hover:shadow-lg hover:shadow-amber-200/50"
      >
        {text}

        {/* Icons that animate on hover */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-0 opacity-0 transition-all duration-500
          group-hover:w-12 group-hover:opacity-100 hover:-top-24"
        >
          <BookOpen
            className="absolute w-10 h-10 text-emerald-600 transform -translate-x-1/2
            transition-all duration-500 hover:-rotate-12"
          />
        </div>

        <div
          className="absolute top-0 left-[90%] -translate-x-1/2 w-0 opacity-0 transition-all duration-500
          group-hover:w-12 group-hover:opacity-100 hover:-top-20"
        >
          <GraduationCap
            className="absolute w-12 h-12 text-blue-600 transform -translate-x-1/2
            transition-all duration-500 hover:rotate-12"
          />
        </div>

        <div
          className="absolute top-0 left-[20%] -translate-x-1/2 w-0 opacity-0 transition-all duration-500
          group-hover:w-12 group-hover:opacity-100 hover:-top-16"
        >
          <Library
            className="absolute w-10 h-10 text-purple-600 transform -translate-x-1/2
            transition-all duration-500 hover:-rotate-6"
          />
        </div>

        <div
          className="absolute top-0 left-[10%] -translate-x-1/2 w-0 opacity-0 transition-all duration-500
          group-hover:w-12 group-hover:opacity-100 hover:-top-28"
        >
          <Lightbulb
            className="absolute w-14 h-14 text-yellow-600 transform -translate-x-1/2
            transition-all duration-500 hover:rotate-6"
          />
        </div>

        <div
          className="absolute top-0 left-[85%] -translate-x-1/2 w-0 opacity-0 transition-all duration-500
          group-hover:w-12 group-hover:opacity-100 hover:-top-32"
        >
          <Brain
            className="absolute w-14 h-14 text-rose-600 transform -translate-x-1/2
            transition-all duration-500 hover:-rotate-12"
          />
        </div>
      </button>
    </div>
  );
};

export default AnimatedButton;
