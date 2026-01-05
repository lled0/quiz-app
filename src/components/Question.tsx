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
      return key === question.correcta ? "correct" : "incorrect";
    }
    return "";
  };

  return (
    <div className="question">
      <h3>
        {index + 1}. {question.pregunta}
      </h3>
      <div className="options">
        {Object.entries(question.respuestas).map(([key, value]) => (
          <div key={key} className={`option ${getAnswerClass(key)}`}>
            <input
              type="radio"
              id={`q${index}_${key}`}
              name={`q${index}`}
              value={key}
              checked={selectedAnswer === key}
              onChange={() => onAnswerChange(index, key)}
              disabled={checked}
            />
            <label htmlFor={`q${index}_${key}`}>{value}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
