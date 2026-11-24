import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchForm } from "./SearchForm";

describe("SearchForm", () => {
  it("actualiza el campo mientras el usuario escribe", async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={jest.fn()} />);

    const input = screen.getByRole("textbox", { name: /ciudad/i });
    await user.type(input, "Lima");

    expect(input).toHaveValue("Lima");
  });

  it("deshabilita el botón si el campo está vacío o solo tiene espacios", async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={jest.fn()} />);

    const button = screen.getByRole("button", { name: /buscar/i });
    expect(button).toBeDisabled();

    await user.type(screen.getByRole("textbox"), "   ");
    expect(button).toBeDisabled();
  });

  it("envía la ciudad sin espacios al hacer clic en Buscar", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchForm onSearch={onSearch} />);

    await user.type(screen.getByRole("textbox"), "  Buenos Aires ");
    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("Buenos Aires");
  });

  it("permite buscar presionando Enter", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchForm onSearch={onSearch} />);

    await user.type(screen.getByRole("textbox"), "Quito{Enter}");

    expect(onSearch).toHaveBeenCalledWith("Quito");
  });

  it("bloquea el botón mientras se está buscando", () => {
    render(<SearchForm onSearch={jest.fn()} isLoading />);

    expect(screen.getByRole("button", { name: /buscando/i })).toBeDisabled();
  });
});
