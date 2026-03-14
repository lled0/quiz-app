import React from "react";
import { render, screen } from "@testing-library/react";
import AnswerProgressBar from "./AnswerProgressBar";

describe("AnswerProgressBar", () => {
  it("displays the correct/total label", () => {
    render(
      <AnswerProgressBar questionsTotal={5} correctCount={3} wrongCount={1} />
    );
    expect(screen.getByText("3/5")).toBeInTheDocument();
  });

  it("shows 0/N when no answers have been given", () => {
    render(
      <AnswerProgressBar questionsTotal={4} correctCount={0} wrongCount={0} />
    );
    expect(screen.getByText("0/4")).toBeInTheDocument();
  });

  it("sets green segment width based on correct count", () => {
    const { container } = render(
      <AnswerProgressBar questionsTotal={4} correctCount={2} wrongCount={1} />
    );
    expect(container.querySelector(".bg-green-500")).toHaveStyle({ width: "50%" });
  });

  it("sets red segment width based on wrong count", () => {
    const { container } = render(
      <AnswerProgressBar questionsTotal={4} correctCount={2} wrongCount={1} />
    );
    expect(container.querySelector(".bg-red-500")).toHaveStyle({ width: "25%" });
  });

  it("fills the unanswered segment for remaining questions", () => {
    const { container } = render(
      <AnswerProgressBar questionsTotal={4} correctCount={1} wrongCount={1} />
    );
    // unanswered = 4 - 1 - 1 = 2 → 50%
    // The three inner segments are direct children of the flex container
    const segments = container.querySelectorAll(".flex.h-4 > div");
    expect(segments[1]).toHaveStyle({ width: "50%" });
  });

  it("fills the full bar green when all answers are correct", () => {
    const { container } = render(
      <AnswerProgressBar questionsTotal={3} correctCount={3} wrongCount={0} />
    );
    expect(container.querySelector(".bg-green-500")).toHaveStyle({ width: "100%" });
    expect(container.querySelector(".bg-red-500")).toHaveStyle({ width: "0%" });
  });
});
