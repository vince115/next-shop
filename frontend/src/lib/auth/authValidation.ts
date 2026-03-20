interface AuthUserShape {
  id: number;
  email: string;
  name: string;
  role: string;
}

export function isValidAuthUser(value: unknown): value is AuthUserShape {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.email === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.role === "string"
  );
}

export function parseStoredAuthUser(raw: string | null): AuthUserShape | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidAuthUser(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function hasUsableToken(token: string | null | undefined): token is string {
  return typeof token === "string" && token.trim().length > 0;
}
