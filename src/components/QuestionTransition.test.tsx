import React from "react";
import { render, screen } from "@testing-library/react";
import QuestionTransition from "./QuestionTransition";

describe("QuestionTransition", () => {
  it("renders its children", () => {
    render(
      <QuestionTransition animationKey={0}>
        <p>Test content</p>
      </QuestionTransition>
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <QuestionTransition animationKey={1}>
        <span>First</span>
        <span>Second</span>
      </QuestionTransition>
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("accepts a string animationKey", () => {
    render(
      <QuestionTransition animationKey="step-1">
        <p>Content</p>
      </QuestionTransition>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
