import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useAuthForm } from "./useAuthForm";

describe("useAuthForm", () => {
  it("updates fields and resets state", () => {
    const { result } = renderHook(() => useAuthForm());

    act(() => {
      result.current.setEmail("user@test.com");
      result.current.setPassword("secret123");
      result.current.setName("User Test");
      result.current.setError("error");
    });

    expect(result.current.values.email).toBe("user@test.com");
    expect(result.current.values.password).toBe("secret123");
    expect(result.current.values.name).toBe("User Test");
    expect(result.current.error).toBe("error");

    act(() => {
      result.current.reset();
    });

    expect(result.current.values).toEqual({ email: "", password: "", name: "" });
    expect(result.current.error).toBe("");
  });
});
