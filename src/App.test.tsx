import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

const mockFile = new File(
  [
    JSON.stringify([
      {
        pregunta: "¿Cuál es la capital de España?",
        respuestas: {
          A: "Madrid",
          B: "París",
          C: "Londres",
        },
        correcta: "A",
      },
    ]),
  ],
  "preguntas.json",
  { type: "application/json" }
);

test("renders the quiz title", () => {
  render(<App />);
  const titleElement = screen.getByText(/Quiz Test/i);
  expect(titleElement).toBeInTheDocument();
});

test("checking answers displays the correct score", async () => {
  render(<App />);

  const fileInput = screen.getByTestId("file-input");
  fireEvent.change(fileInput, { target: { files: [mockFile] } });

  await waitFor(() => {
    const questionElement = screen.getByText(/¿Cuál es la capital de España?/i);
    expect(questionElement).toBeInTheDocument();
  });

  const answerButton = await screen.findByLabelText(/Madrid/i);
  fireEvent.click(answerButton);

  const checkButton = screen.getByText(/Comprobar Respuestas/i);
  fireEvent.click(checkButton);

  await waitFor(() => {
    const scoreElement = screen.getByText(/Puntuación: 1 de 1/i);
    expect(scoreElement).toBeInTheDocument();
  });
});
