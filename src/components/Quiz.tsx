import React, { useState } from "react";
import Question from "./Question";

interface QuestionQuiz {
  pregunta: string;
  respuestas: Record<string, string>;
  correcta: string;
}

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionQuiz[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>("");

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
    return array.sort(() => Math.random() - 0.5);
  };

  const loadQuestions = (data: QuestionQuiz[]) => {
    setQuestions(shuffleArray(data));
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };

  const checkAnswers = () => {
    const correctCount = questions.filter(
      (question, index) => answers[index] === question.correcta
    ).length;
    setScore(correctCount);
  };

  const reset = () => {
    setAnswers({});
    setScore(null);
  };

  const resetTest = () => {
    reset();
    setQuestions(shuffleArray(questions));
    window.scrollTo(0, 0);
  };

  const resetFile = () => {
    setFileName("");
    setQuestions([]);
    reset();
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen flex flex-col items-center p-5">
      <h1 className="text-blue-500 text-4xl text-center">Quiz Test</h1>

      <div className="py-5">
        {!fileName ? (
          <input
            type="file"
            accept="application/json"
            onChange={handleFileUpload}
            data-testid="file-input"
            className="py-2 px-4 bg-white border rounded-lg"
          />
        ) : (
          <div className="flex gap-2 items-center">
            <p>Fichero subido: {fileName}</p>
            <button
              onClick={resetFile}
              className="bg-blue-500 text-white py-2 px-6 rounded-lg"
            >
              Reset Fichero
            </button>
          </div>
        )}
      </div>

      {questions.length > 0 ? (
        <div>
          {questions.map((question, index) => (
            <Question
              key={question.pregunta}
              question={question}
              index={index}
              selectedAnswer={answers[index] || ""}
              onAnswerChange={handleAnswerChange}
              checked={score !== null}
            />
          ))}
          <div className="flex gap-2 items-center mt-4">
            <button
              onClick={checkAnswers}
              disabled={score !== null}
              className="bg-blue-500 text-white py-3 px-6 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Comprobar Respuestas
            </button>
            <button
              onClick={resetTest}
              disabled={score === null}
              className="bg-blue-500 text-white py-3 px-6 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Reset Test
            </button>
            {score !== null && (
              <div>
                <h2 className="text-xl text-gray-800 mt-4 text-center">
                  Puntuación: {score} de {questions.length}
                </h2>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Por favor, sube un archivo con las preguntas...</p>
      )}
    </div>
  );
};

export default Quiz;
