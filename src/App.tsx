import React, { useState } from "react";
import "./App.css";

interface Question {
  pregunta: string;
  respuestas: Record<string, string>;
  correcta: string;
}

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");

  const shuffleArray = (array: any[]): any[] => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/json") {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          loadQuestions(data);
        } catch (error) {
          console.error("Error al procesar el archivo JSON:", error);
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid JSON file.");
    }
  };

  const loadQuestions = (data: Question[]) => {
    const shuffledQuestions = shuffleArray(data);

    const shuffledQuestionsWithAnswers = shuffledQuestions.map((question) => {
      return {
        ...question,
      };
    });

    setQuestions(shuffledQuestionsWithAnswers);
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };

  const checkAnswers = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correcta) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setChecked(true);
  };

  const resetTest = () => {
    setAnswers({});
    setScore(null);
    setChecked(false);
    setQuestions((prevQuestions) => shuffleArray(prevQuestions));
    window.scrollTo(0, 0);
  };

  const resetFile = () => {
    resetTest();
    setFileName("");
    setQuestions([]);
  };

  return (
    <div className="container">
      <h1>Quiz Test</h1>

      <div>
        {!fileName && (
          <input
            data-testid="file-input"
            type="file"
            accept="application/json"
            onChange={handleFileUpload}
          />
        )}
        {fileName && (
          <div className="file-container">
            <p>Fichero subido: {fileName}</p>
            <button onClick={resetFile}>Reset Fichero</button>
          </div>
        )}
      </div>

      {questions.length > 0 ? (
        <div>
          {questions.map((question, index) => (
            <div key={index} className="question">
              <h3>
                {index + 1}. {question.pregunta}
              </h3>
              <div className="options">
                {Object.entries(question.respuestas).map(([key, value]) => (
                  <div
                    key={key}
                    className={`option ${
                      checked
                        ? answers[index] === key
                          ? question.correcta === key
                            ? "correct"
                            : "incorrect"
                          : ""
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      id={`q${index}_${key}`}
                      name={`q${index}`}
                      value={key}
                      checked={answers[index] === key}
                      onChange={() => handleAnswerChange(index, key)}
                      disabled={checked}
                    />
                    <label htmlFor={`q${index}_${key}`}>{value}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="button-container">
            <button onClick={checkAnswers} disabled={checked}>
              Comprobar Respuestas
            </button>
            <button onClick={resetTest} disabled={!checked}>
              Reset Test
            </button>
            {score !== null && (
              <div>
                <h2>
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
}

export default App;
