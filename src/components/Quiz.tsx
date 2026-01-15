import React, { useState } from "react";
import ModeSelector from "./ModeSelector";
import AllAtOnceQuiz from "./AllAtOnceQuiz";
import StepByStepQuiz from "./StepByStepQuiz";

export interface QuestionQuiz {
  pregunta: string;
  respuestas: Record<string, string>;
  correcta: string;
}

type QuizMode = "ALL_AT_ONCE" | "STEP_BY_STEP";

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionQuiz[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const [mode, setMode] = useState<QuizMode>("ALL_AT_ONCE");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/json") {
      processFile(file);
    } else {
      alert("Por favor, sube un archivo JSON válido.");
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        setFileName(file.name);
        loadQuestions(data);
      } catch (error) {
        console.error("Error al procesar el archivo JSON:", error);
      }
    };
    reader.readAsText(file);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const loadQuestions = (data: QuestionQuiz[]) => {
    setQuestions(shuffleArray(data));
    setAnswers({});
    setScore(null);
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const checkAnswers = () => {
    const correctCount = questions.filter(
      (question, index) => answers[index] === question.correcta
    ).length;
    setScore(correctCount);
  };

  const resetTest = () => {
    setAnswers({});
    setScore(null);
    setQuestions(shuffleArray(questions));
    window.scrollTo(0, 0);
  };

  const resetFile = () => {
    setFileName("");
    setQuestions([]);
    setAnswers({});
    setScore(null);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-5 font-sans">
      <h1 className="text-center text-4xl text-blue-500">Quiz Test</h1>

      <div className="flex w-full justify-center">
        <div className="w-full max-w-2xl text-center">
          {!fileName ? <ModeSelector mode={mode} onChange={setMode} /> : null}

          <div className="py-5">
            {!fileName ? (
              <input
                type="file"
                accept="application/json"
                onChange={handleFileUpload}
                data-testid="file-input"
                className="rounded-lg border bg-white px-4 py-2"
              />
            ) : (
              <div className="flex items-center gap-2">
                <p>Fichero subido: {fileName}</p>
                <button
                  onClick={resetFile}
                  className="rounded-lg bg-blue-500 px-6 py-2 text-white"
                >
                  Reset Fichero
                </button>
              </div>
            )}
          </div>

          {questions.length > 0 ? (
            mode === "ALL_AT_ONCE" ? (
              <AllAtOnceQuiz
                questions={questions}
                answers={answers}
                score={score}
                onAnswerChange={handleAnswerChange}
                onCheckAnswers={checkAnswers}
                onResetTest={resetTest}
              />
            ) : (
              <StepByStepQuiz
                questions={questions}
                answers={answers}
                onAnswerChange={handleAnswerChange}
              />
            )
          ) : (
            <p>Por favor, sube un archivo con las preguntas...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
