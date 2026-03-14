import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Question from "./Question";

const mockQuestion = {
  pregunta: "¿Cuál es la capital de España?",
  respuestas: { A: "Madrid", B: "París", C: "Londres" },
  correcta: "A",
};

describe("Question", () => {
  it("renders the question text and all answer options", () => {
    render(
      <Question
        question={mockQuestion}
        index={0}
        selectedAnswer=""
        onAnswerChange={jest.fn()}
        checked={false}
      />
    );
    expect(screen.getByText(/¿Cuál es la capital de España?/)).toBeInTheDocument();
    expect(screen.getByText("Madrid")).toBeInTheDocument();
    expect(screen.getByText("París")).toBeInTheDocument();
    expect(screen.getByText("Londres")).toBeInTheDocument();
  });

  it("shows the correct question number based on index", () => {
    render(
      <Question
        question={mockQuestion}
        index={2}
        selectedAnswer=""
        onAnswerChange={jest.fn()}
        checked={false}
      />
    );
    expect(screen.getByText(/3\./)).toBeInTheDocument();
  });

  it("calls onAnswerChange with the correct index and key when an option is clicked", () => {
    const onAnswerChange = jest.fn();
    render(
      <Question
        question={mockQuestion}
        index={0}
        selectedAnswer=""
        onAnswerChange={onAnswerChange}
        checked={false}
      />
    );
    fireEvent.click(screen.getByLabelText("Madrid"));
    expect(onAnswerChange).toHaveBeenCalledWith(0, "A");
  });

  it("disables all radio inputs when checked=true", () => {
    render(
      <Question
        question={mockQuestion}
        index={0}
        selectedAnswer="A"
        onAnswerChange={jest.fn()}
        checked={true}
      />
    );
    screen.getAllByRole("radio").forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("enables all radio inputs when checked=false", () => {
    render(
      <Question
        question={mockQuestion}
        index={0}
        selectedAnswer=""
        onAnswerChange={jest.fn()}
        checked={false}
      />
    );
    screen.getAllByRole("radio").forEach((input) => {
      expect(input).not.toBeDisabled();
    });
  });

  it("highlights the selected answer with a ring when not checked", () => {
    render(
      <Question
        question={mockQuestion}
        index={0}
        selectedAnswer="B"
        onAnswerChange={jest.fn()}
        checked={false}
      />
    );
    expect(screen.getByText("París").closest("div")).toHaveClass("ring-2");
  });

  it("does not highlight unselected options with a ring", () => {
    render(
      <Question
        question={mockQuestion}
        index={0}
        selectedAnswer="B"
        onAnswerChange={jest.fn()}
        checked={false}
      />
    );
    expect(screen.getByText("Madrid").closest("div")).not.toHaveClass("ring-2");
  });

  it("shows green background on correct answer when checked and answered correctly", () => {
    render(
      <Question
        question={mockQuestion}
        index={0}
        selectedAnswer="A"
        onAnswerChange={jest.fn()}
        checked={true}
      />
    );
    expect(screen.getByText("Madrid").closest("div")).toHaveClass("bg-green-500");
  });

  it("shows red background on wrong selected answer and green on correct when checked", () => {
    render(
      <Question
        question={mockQuestion}
        index={0}
        selectedAnswer="B"
        onAnswerChange={jest.fn()}
        checked={true}
      />
    );
    expect(screen.getByText("París").closest("div")).toHaveClass("bg-red-500");
    expect(screen.getByText("Madrid").closest("div")).toHaveClass("bg-green-500");
  });

  it("shows no color highlight on options when not checked", () => {
    render(
      <Question
        question={mockQuestion}
        index={0}
        selectedAnswer=""
        onAnswerChange={jest.fn()}
        checked={false}
      />
    );
    expect(screen.getByText("Madrid").closest("div")).not.toHaveClass("bg-green-500");
    expect(screen.getByText("Madrid").closest("div")).not.toHaveClass("bg-red-500");
  });
});
