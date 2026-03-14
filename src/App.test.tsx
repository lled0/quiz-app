import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

const singleQuestion = [
  {
    pregunta: "¿Cuál es la capital de España?",
    respuestas: { A: "Madrid", B: "París", C: "Londres" },
    correcta: "A",
  },
];

const makeJsonFile = (data: object, name = "preguntas.json") =>
  new File([JSON.stringify(data)], name, { type: "application/json" });

const uploadFile = (file: File) => {
  fireEvent.change(screen.getByTestId("file-input"), {
    target: { files: [file] },
  });
};

describe("Initial state", () => {
  test("renders the quiz title", () => {
    render(<App />);
    expect(screen.getByText(/Quiz Test/i)).toBeInTheDocument();
  });

  test("shows the mode selector before a file is uploaded", () => {
    render(<App />);
    expect(screen.getByText("Classic")).toBeInTheDocument();
    expect(screen.getByText("Una a una")).toBeInTheDocument();
  });

  test("shows the upload prompt before a file is uploaded", () => {
    render(<App />);
    expect(screen.getByText(/Por favor, sube un archivo/i)).toBeInTheDocument();
  });
});

describe("File upload", () => {
  test("shows the file name and hides the mode selector after uploading", async () => {
    render(<App />);
    uploadFile(makeJsonFile(singleQuestion));
    await waitFor(() => {
      expect(screen.getByText(/Fichero subido: preguntas.json/i)).toBeInTheDocument();
      expect(screen.queryByText("Classic")).not.toBeInTheDocument();
    });
  });

  test("renders questions after a valid file is uploaded", async () => {
    render(<App />);
    uploadFile(makeJsonFile(singleQuestion));
    await waitFor(() => {
      expect(
        screen.getByText(/¿Cuál es la capital de España?/i)
      ).toBeInTheDocument();
    });
  });

  test("shows an alert when an invalid file type is uploaded", () => {
    window.alert = jest.fn();
    render(<App />);
    const invalidFile = new File(["not json"], "file.txt", { type: "text/plain" });
    uploadFile(invalidFile);
    expect(window.alert).toHaveBeenCalledWith("Por favor, sube un archivo JSON válido.");
  });

  test("returns to the upload screen after Reset Fichero is clicked", async () => {
    render(<App />);
    uploadFile(makeJsonFile(singleQuestion));
    await waitFor(() => screen.getByText(/Fichero subido/i));
    fireEvent.click(screen.getByText("Reset Fichero"));
    expect(screen.getByTestId("file-input")).toBeInTheDocument();
    expect(screen.getByText(/Por favor, sube un archivo/i)).toBeInTheDocument();
  });
});

describe("ALL_AT_ONCE mode", () => {
  test("checking answers displays the correct score", async () => {
    render(<App />);
    uploadFile(makeJsonFile(singleQuestion));
    await waitFor(() => screen.getByText(/¿Cuál es la capital de España?/i));

    fireEvent.click(await screen.findByLabelText(/Madrid/i));
    fireEvent.click(screen.getByText(/Comprobar Respuestas/i));

    await waitFor(() => {
      expect(screen.getByText(/Puntuación: 1 de 1/i)).toBeInTheDocument();
    });
  });

  test("Reset Test clears the score and re-enables Comprobar", async () => {
    render(<App />);
    uploadFile(makeJsonFile(singleQuestion));
    await waitFor(() => screen.getByText(/¿Cuál es la capital de España?/i));

    fireEvent.click(await screen.findByLabelText(/Madrid/i));
    fireEvent.click(screen.getByText(/Comprobar Respuestas/i));
    await waitFor(() => screen.getByText(/Puntuación/i));

    fireEvent.click(screen.getByText("Reset Test"));
    expect(screen.queryByText(/Puntuación/i)).not.toBeInTheDocument();
    expect(screen.getByText("Comprobar Respuestas")).not.toBeDisabled();
  });
});

describe("Shuffle behavior", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("clicking the correct answer by text scores correctly after options are reshuffled", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0);
    render(<App />);
    uploadFile(makeJsonFile(singleQuestion));
    await waitFor(() => screen.getByText(/¿Cuál es la capital de España?/i));

    // Math.random=0 moves Madrid from key A to key C
    // finding by label text still selects the right answer
    fireEvent.click(await screen.findByLabelText(/Madrid/i));
    fireEvent.click(screen.getByText(/Comprobar Respuestas/i));

    await waitFor(() => {
      expect(screen.getByText(/Puntuación: 1 de 1/i)).toBeInTheDocument();
    });
  });

  test("clicking the option now at the original correct key scores wrong after shuffle", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0);
    render(<App />);
    uploadFile(makeJsonFile(singleQuestion));
    await waitFor(() => screen.getByText(/¿Cuál es la capital de España?/i));

    // Math.random=0 puts París at key A (the original correct key)
    // clicking París should give 0/1
    fireEvent.click(await screen.findByLabelText(/París/i));
    fireEvent.click(screen.getByText(/Comprobar Respuestas/i));

    await waitFor(() => {
      expect(screen.getByText(/Puntuación: 0 de 1/i)).toBeInTheDocument();
    });
  });
});

describe("Duplicate questions with shuffled options", () => {
  const duplicateQuestions = [
    {
      pregunta: "Misma pregunta",
      respuestas: { A: "Madrid", B: "París", C: "Londres" },
      correcta: "A",
    },
    {
      pregunta: "Misma pregunta",
      respuestas: { A: "Madrid", B: "París", C: "Londres" },
      correcta: "A",
    },
  ];

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("scores both correct when the right answer is selected in each question", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0);
    render(<App />);
    uploadFile(makeJsonFile(duplicateQuestions));
    await waitFor(() => screen.getAllByText(/Misma pregunta/i));

    // Math.random=0 moves Madrid to key C for both questions
    const madridInputs = await screen.findAllByLabelText(/Madrid/i);
    fireEvent.click(madridInputs[0]);
    fireEvent.click(madridInputs[1]);
    fireEvent.click(screen.getByText(/Comprobar Respuestas/i));

    await waitFor(() => {
      expect(screen.getByText(/Puntuación: 2 de 2/i)).toBeInTheDocument();
    });
  });

  test("scores both wrong when the wrong answer is selected in each question", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0);
    render(<App />);
    uploadFile(makeJsonFile(duplicateQuestions));
    await waitFor(() => screen.getAllByText(/Misma pregunta/i));

    // Math.random=0 puts París at key A for both questions (not the correct answer)
    const parisInputs = await screen.findAllByLabelText(/París/i);
    fireEvent.click(parisInputs[0]);
    fireEvent.click(parisInputs[1]);
    fireEvent.click(screen.getByText(/Comprobar Respuestas/i));

    await waitFor(() => {
      expect(screen.getByText(/Puntuación: 0 de 2/i)).toBeInTheDocument();
    });
  });
});

describe("STEP_BY_STEP mode", () => {
  test("loads questions and shows the progress bar", async () => {
    render(<App />);
    fireEvent.click(screen.getByText("Una a una"));
    uploadFile(makeJsonFile(singleQuestion));
    await waitFor(() => {
      expect(screen.getByText(/Pregunta 1 de 1/i)).toBeInTheDocument();
    });
  });

  test("shows final score after answering all questions", async () => {
    render(<App />);
    fireEvent.click(screen.getByText("Una a una"));
    uploadFile(makeJsonFile(singleQuestion));
    await waitFor(() => screen.getByText(/¿Cuál es la capital de España?/i));

    fireEvent.click(await screen.findByLabelText(/Madrid/i));
    fireEvent.click(screen.getByText("Mostrar todas"));

    expect(screen.getByText(/Puntuación final: 1 de 1/i)).toBeInTheDocument();
  });
});
