import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ScrollToTopButton from "./ScrollToTopButton";

describe("ScrollToTopButton", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it("is not rendered when scroll position is at the top", () => {
    render(<ScrollToTopButton />);
    expect(
      screen.queryByRole("button", { name: /volver al inicio/i })
    ).not.toBeInTheDocument();
  });

  it("becomes visible when scrolled past 300px", () => {
    render(<ScrollToTopButton />);
    act(() => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 400,
      });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(
      screen.getByRole("button", { name: /volver al inicio/i })
    ).toBeInTheDocument();
  });

  it("hides again when scrolling back above 300px", () => {
    render(<ScrollToTopButton />);
    act(() => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 400,
      });
      window.dispatchEvent(new Event("scroll"));
    });
    act(() => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 100,
      });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(
      screen.queryByRole("button", { name: /volver al inicio/i })
    ).not.toBeInTheDocument();
  });

  it("calls window.scrollTo smoothly to the top when clicked", () => {
    window.scrollTo = jest.fn();
    render(<ScrollToTopButton />);
    act(() => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 400,
      });
      window.dispatchEvent(new Event("scroll"));
    });
    fireEvent.click(screen.getByRole("button", { name: /volver al inicio/i }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("removes the scroll event listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = render(<ScrollToTopButton />);
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
    removeEventListenerSpy.mockRestore();
  });
});
