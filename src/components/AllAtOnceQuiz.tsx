import React from "react";
import Question from "./Question";
import { QuestionQuiz } from "./Quiz";

interface AllAtOnceQuizProps {
  questions: QuestionQuiz[];
  answers: Record<number, string>;
  score: number | null;
  onAnswerChange: (index: number, answer: string) => void;
  onCheckAnswers: () => void;
  onResetTest: () => void;
}

const AllAtOnceQuiz: React.FC<AllAtOnceQuizProps> = ({
  questions,
  answers,
  score,
  onAnswerChange,
  onCheckAnswers,
  onResetTest,
}) => {
  return (
    <>
      {questions.map((question, index) => (
        <Question
          key={question.pregunta}
          question={question}
          index={index}
          selectedAnswer={answers[index] || ""}
          onAnswerChange={onAnswerChange}
          checked={score !== null}
        />
      ))}

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={onCheckAnswers}
          disabled={score !== null}
          className="rounded-lg bg-blue-500 px-6 py-3 text-white disabled:bg-gray-300"
        >
          Comprobar Respuestas
        </button>

        <button
          onClick={onResetTest}
          disabled={score === null}
          className="rounded-lg bg-blue-500 px-6 py-3 text-white disabled:bg-gray-300"
        >
          Reset Test
        </button>

        {score !== null && (
          <h2 className="mt-4 text-xl">
            Puntuación: {score} de {questions.length}
          </h2>
        )}
      </div>
    </>
  );
};

export default AllAtOnceQuiz;
