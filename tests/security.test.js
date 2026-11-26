import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  hasAllSecurityHeaders,
  REQUIRED_SECURITY_HEADERS,
  passwordScore,
  passwordStrengthLabel,
  isStrongPassword,
} from "../src/security.js";

describe("escapeHtml", () => {
  it("escapa caracteres perigosos", () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    );
  });
  it("retorna string vazia para entradas não-string", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(42)).toBe("");
  });
});

describe("hasAllSecurityHeaders", () => {
  it("true quando todos os cabeçalhos estão presentes (case-insensitive)", () => {
    const headers = {};
    for (const h of REQUIRED_SECURITY_HEADERS) headers[h.toUpperCase()] = "x";
    expect(hasAllSecurityHeaders(headers)).toBe(true);
  });
  it("false quando falta algum", () => {
    expect(hasAllSecurityHeaders({ "x-frame-options": "DENY" })).toBe(false);
  });
});

describe("passwordScore", () => {
  it("0 para vazio ou inválido", () => {
    expect(passwordScore("")).toBe(0);
    expect(passwordScore(undefined)).toBe(0);
  });
  it("cresce com a complexidade", () => {
    expect(passwordScore("abc")).toBe(0);
    expect(passwordScore("abcdefgh")).toBe(1);
    expect(passwordScore("Abcdef1!xyz9")).toBe(4);
  });
  it("nunca passa de 4", () => {
    expect(passwordScore("Abcdefgh1234!@#$XYZ")).toBe(4);
  });
});

describe("passwordStrengthLabel", () => {
  it("rotula corretamente os extremos", () => {
    expect(passwordStrengthLabel("")).toBe("Muito fraca");
    expect(passwordStrengthLabel("Abcdef1!xyz9")).toBe("Forte");
  });
});

describe("isStrongPassword", () => {
  it("aceita a partir do score 3", () => {
    expect(isStrongPassword("Abcdef1!xyz9")).toBe(true);
    expect(isStrongPassword("abcdefgh")).toBe(false);
  });
});
