import React from "react";
import { render, screen } from "@testing-library/react";
import ProgressBar from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders the current and total question numbers", () => {
    render(<ProgressBar current={3} total={10} />);
    expect(screen.getByText(/Pregunta 3 de 10/)).toBeInTheDocument();
  });

  it("displays the correct rounded percentage", () => {
    render(<ProgressBar current={1} total={4} />);
    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("rounds percentage to the nearest integer", () => {
    render(<ProgressBar current={1} total={3} />);
    expect(screen.getByText("33%")).toBeInTheDocument();
  });

  it("sets the bar width to match the calculated percentage", () => {
    const { container } = render(<ProgressBar current={2} total={4} />);
    const bar = container.querySelector(".bg-blue-500");
    expect(bar).toHaveStyle({ width: "50%" });
  });

  it("shows 100% when current equals total", () => {
    render(<ProgressBar current={5} total={5} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("shows 0% when current is 0", () => {
    render(<ProgressBar current={0} total={5} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
