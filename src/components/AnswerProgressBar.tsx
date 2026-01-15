import React from "react";

interface AnswerProgressBarProps {
  questionsTotal: number;
  correctCount: number;
  wrongCount: number;
}

const AnswerProgressBar: React.FC<AnswerProgressBarProps> = ({
  questionsTotal,
  correctCount,
  wrongCount,
}) => {
  const unanswered = questionsTotal - correctCount - wrongCount;

  const correctPercent = (correctCount / questionsTotal) * 100;
  const wrongPercent = (wrongCount / questionsTotal) * 100;
  const unansweredPercent = (unanswered / questionsTotal) * 100;

  return (
    <div className="relative mb-4 w-full">
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-gray-300">
        <div
          className="h-4 bg-green-500 transition-all duration-300"
          style={{ width: `${correctPercent}%` }}
        />
        <div
          className="h-4 bg-gray-300 transition-all duration-300"
          style={{ width: `${unansweredPercent}%` }}
        />
        <div
          className="h-4 bg-red-500 transition-all duration-300"
          style={{ width: `${wrongPercent}%` }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs">
        {correctCount}/{questionsTotal}
      </div>
    </div>
  );
};

export default AnswerProgressBar;
