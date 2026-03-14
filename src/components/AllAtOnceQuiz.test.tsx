import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AllAtOnceQuiz from "./AllAtOnceQuiz";

const mockQuestions = [
  { pregunta: "Pregunta 1", respuestas: { A: "Opción A", B: "Opción B" }, correcta: "A" },
  { pregunta: "Pregunta 2", respuestas: { A: "Sí", B: "No" }, correcta: "B" },
];

const defaultProps = {
  questions: mockQuestions,
  answers: {},
  score: null,
  onAnswerChange: jest.fn(),
  onCheckAnswers: jest.fn(),
  onResetTest: jest.fn(),
};

describe("AllAtOnceQuiz", () => {
  it("renders all questions", () => {
    render(<AllAtOnceQuiz {...defaultProps} />);
    expect(screen.getByText(/Pregunta 1/)).toBeInTheDocument();
    expect(screen.getByText(/Pregunta 2/)).toBeInTheDocument();
  });

  it("Comprobar button is enabled and Reset is disabled when score is null", () => {
    render(<AllAtOnceQuiz {...defaultProps} />);
    expect(screen.getByText("Comprobar Respuestas")).not.toBeDisabled();
    expect(screen.getByText("Reset Test")).toBeDisabled();
  });

  it("Comprobar button is disabled and Reset is enabled when score is set", () => {
    render(<AllAtOnceQuiz {...defaultProps} score={1} />);
    expect(screen.getByText("Comprobar Respuestas")).toBeDisabled();
    expect(screen.getByText("Reset Test")).not.toBeDisabled();
  });

  it("displays the score when not null", () => {
    render(<AllAtOnceQuiz {...defaultProps} score={1} />);
    expect(screen.getByText(/Puntuación: 1 de 2/)).toBeInTheDocument();
  });

  it("does not display the score when null", () => {
    render(<AllAtOnceQuiz {...defaultProps} />);
    expect(screen.queryByText(/Puntuación/)).not.toBeInTheDocument();
  });

  it("calls onCheckAnswers when Comprobar is clicked", () => {
    const onCheckAnswers = jest.fn();
    render(<AllAtOnceQuiz {...defaultProps} onCheckAnswers={onCheckAnswers} />);
    fireEvent.click(screen.getByText("Comprobar Respuestas"));
    expect(onCheckAnswers).toHaveBeenCalledTimes(1);
  });

  it("calls onResetTest when Reset is clicked", () => {
    const onResetTest = jest.fn();
    render(<AllAtOnceQuiz {...defaultProps} score={2} onResetTest={onResetTest} />);
    fireEvent.click(screen.getByText("Reset Test"));
    expect(onResetTest).toHaveBeenCalledTimes(1);
  });

  it("does not call onCheckAnswers when Comprobar is disabled", () => {
    const onCheckAnswers = jest.fn();
    render(
      <AllAtOnceQuiz {...defaultProps} score={1} onCheckAnswers={onCheckAnswers} />
    );
    fireEvent.click(screen.getByText("Comprobar Respuestas"));
    expect(onCheckAnswers).not.toHaveBeenCalled();
  });

  it("renders the correct total in the score label", () => {
    render(<AllAtOnceQuiz {...defaultProps} score={2} />);
    expect(screen.getByText(/de 2/)).toBeInTheDocument();
  });

  it("renders two identical questions with options in different positions as separate items", () => {
    const duplicateQuestions = [
      { pregunta: "Misma pregunta", respuestas: { A: "Opción A", B: "Opción B" }, correcta: "A" },
      { pregunta: "Misma pregunta", respuestas: { A: "Opción B", B: "Opción A" }, correcta: "B" },
    ];
    render(
      <AllAtOnceQuiz
        {...defaultProps}
        questions={duplicateQuestions}
      />
    );

    expect(screen.getAllByText(/Misma pregunta/)).toHaveLength(2);
    expect(screen.getAllByRole("radio")).toHaveLength(4);
  });

});
