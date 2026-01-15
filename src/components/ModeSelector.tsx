import React from "react";

interface ModeSelectorProps {
  mode: "ALL_AT_ONCE" | "STEP_BY_STEP";
  onChange: (mode: "ALL_AT_ONCE" | "STEP_BY_STEP") => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onChange }) => {
  return (
    <div className="my-4 flex justify-center gap-4">
      <button
        onClick={() => onChange("ALL_AT_ONCE")}
        className={`px-4 py-2 rounded ${
          mode === "ALL_AT_ONCE" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        Classic
      </button>

      <button
        onClick={() => onChange("STEP_BY_STEP")}
        className={`px-4 py-2 rounded ${
          mode === "STEP_BY_STEP" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        Una a una
      </button>
    </div>
  );
};

export default ModeSelector;
