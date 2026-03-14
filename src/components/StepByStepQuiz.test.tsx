import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StepByStepQuiz from "./StepByStepQuiz";

const twoQuestions = [
  { pregunta: "Pregunta 1", respuestas: { A: "Opción A", B: "Opción B" }, correcta: "A" },
  { pregunta: "Pregunta 2", respuestas: { A: "Sí", B: "No" }, correcta: "B" },
];

describe("StepByStepQuiz", () => {
  it("renders only the first question initially", () => {
    render(
      <StepByStepQuiz questions={twoQuestions} answers={{}} onAnswerChange={jest.fn()} />
    );
    expect(screen.getByRole("heading", { name: /Pregunta 1/ })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Pregunta 2/ })).not.toBeInTheDocument();
  });

  it("does not show Siguiente button before answering", () => {
    render(
      <StepByStepQuiz questions={twoQuestions} answers={{}} onAnswerChange={jest.fn()} />
    );
    expect(screen.queryByText("Siguiente")).not.toBeInTheDocument();
  });

  it("shows Siguiente button after answering a non-last question", () => {
    render(
      <StepByStepQuiz
        questions={twoQuestions}
        answers={{ 0: "A" }}
        onAnswerChange={jest.fn()}
      />
    );
    expect(screen.getByText("Siguiente")).toBeInTheDocument();
  });

  it("navigates to the next question on Siguiente click", () => {
    render(
      <StepByStepQuiz
        questions={twoQuestions}
        answers={{ 0: "A" }}
        onAnswerChange={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText("Siguiente"));
    expect(screen.getByRole("heading", { name: /Pregunta 2/ })).toBeInTheDocument();
  });

  it("shows Mostrar todas button after answering the last question", () => {
    render(
      <StepByStepQuiz
        questions={twoQuestions}
        answers={{ 0: "A", 1: "B" }}
        onAnswerChange={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText("Siguiente"));
    expect(screen.getByText("Mostrar todas")).toBeInTheDocument();
  });

  it("does not show Siguiente on the last question", () => {
    render(
      <StepByStepQuiz
        questions={twoQuestions}
        answers={{ 0: "A", 1: "B" }}
        onAnswerChange={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText("Siguiente"));
    expect(screen.queryByText("Siguiente")).not.toBeInTheDocument();
  });

  it("shows all questions and final score after Mostrar todas click", () => {
    render(
      <StepByStepQuiz
        questions={twoQuestions}
        answers={{ 0: "A", 1: "B" }}
        onAnswerChange={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText("Siguiente"));
    fireEvent.click(screen.getByText("Mostrar todas"));
    expect(screen.getByText(/Pregunta 1/)).toBeInTheDocument();
    expect(screen.getByText(/Pregunta 2/)).toBeInTheDocument();
    expect(screen.getByText(/Puntuación final: 2 de 2/)).toBeInTheDocument();
  });

  it("counts only correct answers in final score", () => {
    render(
      <StepByStepQuiz
        questions={twoQuestions}
        answers={{ 0: "B", 1: "B" }}
        onAnswerChange={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText("Siguiente"));
    fireEvent.click(screen.getByText("Mostrar todas"));
    expect(screen.getByText(/Puntuación final: 1 de 2/)).toBeInTheDocument();
  });

  it("shows the progress bar with the current question number", () => {
    render(
      <StepByStepQuiz questions={twoQuestions} answers={{}} onAnswerChange={jest.fn()} />
    );
    expect(screen.getByText(/Pregunta 1 de 2/)).toBeInTheDocument();
  });

  it("updates the progress bar when navigating to the next question", () => {
    render(
      <StepByStepQuiz
        questions={twoQuestions}
        answers={{ 0: "A" }}
        onAnswerChange={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText("Siguiente"));
    expect(screen.getByText(/Pregunta 2 de 2/)).toBeInTheDocument();
  });

  it("calls onAnswerChange with the correct index and key when an option is selected", () => {
    const onAnswerChange = jest.fn();
    render(
      <StepByStepQuiz
        questions={twoQuestions}
        answers={{}}
        onAnswerChange={onAnswerChange}
      />
    );
    fireEvent.click(screen.getByLabelText("Opción A"));
    expect(onAnswerChange).toHaveBeenCalledWith(0, "A");
  });

  it("shows the AnswerProgressBar with correct counts", () => {
    render(
      <StepByStepQuiz
        questions={twoQuestions}
        answers={{ 0: "A" }}
        onAnswerChange={jest.fn()}
      />
    );
    expect(screen.getByText("1/2")).toBeInTheDocument();
  });
});
