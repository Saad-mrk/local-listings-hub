import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Login from "./Login";

const loginMock = vi.fn();
const registerAndSendCodeMock = vi.fn();
const navigateMock = vi.fn();

vi.mock("@/hooks/useUser", () => ({
  useUser: () => ({
    login: loginMock,
    registerAndSendCode: registerAndSendCodeMock,
  }),
}));

vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("Login page", () => {
  beforeEach(() => {
    loginMock.mockReset();
    registerAndSendCodeMock.mockReset();
    navigateMock.mockReset();
  });

  it("shows validation error when login form is empty", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "sign_in" }));

    expect(screen.getByRole("alert")).toHaveTextContent("fill_all_fields");
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("submits login when form is valid", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("votre@email.com"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "secret123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "sign_in" }));

    expect(loginMock).toHaveBeenCalledWith("john@example.com", "john");
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
