import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModeSelector from "./ModeSelector";

describe("ModeSelector", () => {
  it("renders both mode buttons", () => {
    render(<ModeSelector mode="ALL_AT_ONCE" onChange={jest.fn()} />);
    expect(screen.getByText("Classic")).toBeInTheDocument();
    expect(screen.getByText("Una a una")).toBeInTheDocument();
  });

  it("applies active styling to ALL_AT_ONCE button when selected", () => {
    render(<ModeSelector mode="ALL_AT_ONCE" onChange={jest.fn()} />);
    expect(screen.getByText("Classic")).toHaveClass("bg-blue-500");
    expect(screen.getByText("Una a una")).not.toHaveClass("bg-blue-500");
  });

  it("applies active styling to STEP_BY_STEP button when selected", () => {
    render(<ModeSelector mode="STEP_BY_STEP" onChange={jest.fn()} />);
    expect(screen.getByText("Una a una")).toHaveClass("bg-blue-500");
    expect(screen.getByText("Classic")).not.toHaveClass("bg-blue-500");
  });

  it("calls onChange with ALL_AT_ONCE when Classic is clicked", () => {
    const onChange = jest.fn();
    render(<ModeSelector mode="STEP_BY_STEP" onChange={onChange} />);
    fireEvent.click(screen.getByText("Classic"));
    expect(onChange).toHaveBeenCalledWith("ALL_AT_ONCE");
  });

  it("calls onChange with STEP_BY_STEP when Una a una is clicked", () => {
    const onChange = jest.fn();
    render(<ModeSelector mode="ALL_AT_ONCE" onChange={onChange} />);
    fireEvent.click(screen.getByText("Una a una"));
    expect(onChange).toHaveBeenCalledWith("STEP_BY_STEP");
  });
});
