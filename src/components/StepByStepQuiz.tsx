import React, { useState, useMemo } from "react";
import Question from "./Question";
import { QuestionQuiz } from "./Quiz";
import ProgressBar from "./ProgressBar";
import QuestionTransition from "./QuestionTransition";

interface StepByStepQuizProps {
  questions: QuestionQuiz[];
  answers: Record<number, string>;
  onAnswerChange: (index: number, answer: string) => void;
}

const StepByStepQuiz: React.FC<StepByStepQuizProps> = ({
  questions,
  answers,
  onAnswerChange,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const hasAnsweredCurrent = answers[currentQuestionIndex] !== undefined;

  const score = useMemo(() => {
    return questions.filter((q, index) => answers[index] === q.correcta).length;
  }, [answers, questions]);

  const goToNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const showAllQuestions = () => {
    setShowAll(true);
  };

  const renderSingleQuestion = () => (
    <>
      <ProgressBar
        current={currentQuestionIndex + 1}
        total={questions.length}
      />

      <QuestionTransition animationKey={currentQuestionIndex}>
        <div className="min-h-[320px]">
          <Question
            question={questions[currentQuestionIndex]}
            index={currentQuestionIndex}
            selectedAnswer={answers[currentQuestionIndex] || ""}
            onAnswerChange={onAnswerChange}
            checked={hasAnsweredCurrent}
          />
        </div>
      </QuestionTransition>

      <div className="mt-4 flex justify-center">
        {hasAnsweredCurrent && !isLastQuestion && (
          <button
            onClick={goToNextQuestion}
            className="rounded-lg bg-blue-500 px-6 py-2 text-white"
          >
            Siguiente
          </button>
        )}

        {hasAnsweredCurrent && isLastQuestion && (
          <button
            onClick={showAllQuestions}
            className="rounded-lg bg-green-500 px-6 py-2 text-white"
          >
            Mostrar todas
          </button>
        )}
      </div>
    </>
  );

  const renderAllQuestions = () => (
    <>
      {questions.map((question, index) => (
        <Question
          key={question.pregunta}
          question={question}
          index={index}
          selectedAnswer={answers[index] || ""}
          onAnswerChange={onAnswerChange}
          checked={true}
        />
      ))}

      <h2 className="mt-6 text-center text-xl">
        Puntuación final: {score} de {questions.length}
      </h2>
    </>
  );

  return <div>{!showAll ? renderSingleQuestion() : renderAllQuestions()}</div>;
};

export default StepByStepQuiz;
