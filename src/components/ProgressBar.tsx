import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="mb-1 flex justify-between text-sm text-gray-700">
        <span>
          Pregunta {current} de {total}
        </span>
        <span>{percentage}%</span>
      </div>

      <div className="h-3 w-full rounded-full bg-gray-300">
        <div
          className="h-3 rounded-full bg-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
