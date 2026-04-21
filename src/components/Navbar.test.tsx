import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import Navbar from "./Navbar";

vi.mock("@/hooks/useUser", () => ({
  useUser: () => ({ user: null, logout: vi.fn() }),
}));

vi.mock("@/hooks/useCart", () => ({
  useCart: () => ({ totalItems: 0 }),
}));

vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        search_type_members: "Membres",
        search_type_ads: "Articles",
        search_members_placeholder: "Rechercher des membres",
        search_ads_placeholder: "Rechercher des articles",
        cart: "Panier",
        favorites: "Favoris",
        messages: "Messages",
        publish: "Publier",
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock("./NotificationDropdown", () => ({
  default: () => <div data-testid="notif" />,
}));

vi.mock("./LanguageSwitcher", () => ({
  default: () => <div data-testid="lang" />,
}));

vi.mock("./Categories", () => ({
  default: () => <div data-testid="categories" />,
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  DropdownMenuContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe("Navbar", () => {
  it("switches search placeholder when changing search type", async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText("Rechercher des membres")).toBeInTheDocument();

    const trigger = screen.getAllByRole("button", { name: /membres/i })[0];
    fireEvent.click(trigger);
    const articlesItem = await screen.findByRole("button", {
      name: "Articles",
    });
    fireEvent.click(articlesItem);

    expect(screen.getByPlaceholderText("Rechercher des articles")).toBeInTheDocument();
  });
});
