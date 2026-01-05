import React from "react";

interface QuestionProps {
  question: {
    pregunta: string;
    respuestas: Record<string, string>;
    correcta: string;
  };
  index: number;
  selectedAnswer: string;
  onAnswerChange: (index: number, answer: string) => void;
  checked: boolean;
}

const Question: React.FC<QuestionProps> = ({
  question,
  index,
  selectedAnswer,
  onAnswerChange,
  checked,
}) => {
  const getAnswerClass = (key: string) => {
    if (!checked) return "";

    if (key === selectedAnswer) {
      return key === question.correcta ? "bg-green-500" : "bg-red-500";
    }
    return "";
  };

  return (
    <div className="bg-white rounded-lg p-5 mb-4 shadow-lg">
      <h3 className="text-lg mb-3">
        {index + 1}. {question.pregunta}
      </h3>
      <div className="flex flex-col">
        {Object.entries(question.respuestas).map(([key, value]) => (
          <div
            key={key}
            className={`${
              selectedAnswer === key ? "ring-2 ring-blue-500" : ""
            } ${getAnswerClass(
              key
            )} bg-gray-200 rounded-lg my-2 p-4 cursor-pointer transition-all ease-in-out duration-300`}
          >
            <input
              type="radio"
              id={`q${index}_${key}`}
              name={`q${index}`}
              value={key}
              checked={selectedAnswer === key}
              onChange={() => onAnswerChange(index, key)}
              disabled={checked}
              className="hidden"
            />
            <label
              htmlFor={`q${index}_${key}`}
              className={`cursor-pointer text-base block ${
                selectedAnswer === key
                  ? "text-blue-500 font-bold"
                  : "text-gray-800"
              }`}
            >
              {value}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
