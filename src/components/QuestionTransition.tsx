import React from "react";

interface QuestionTransitionProps {
  animationKey: string | number;
  children: React.ReactNode;
}

const QuestionTransition: React.FC<QuestionTransitionProps> = ({
  animationKey,
  children,
}) => {
  return (
    <div
      key={animationKey}
      className="animate-question-enter translate-y-0 opacity-100 transition-all duration-300 ease-out"
    >
      {children}
    </div>
  );
};

export default QuestionTransition;
