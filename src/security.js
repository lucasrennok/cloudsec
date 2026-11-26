// Pequeno módulo de utilidades de segurança usado pela página e coberto por
// testes. São funções puras — fáceis de testar e sem dependências de DOM.

/** Escapa caracteres especiais para evitar injeção de HTML (XSS básico). */
export function escapeHtml(input) {
  if (typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Cabeçalhos de segurança HTTP que a aplicação deve sempre enviar. */
export const REQUIRED_SECURITY_HEADERS = [
  "content-security-policy",
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "strict-transport-security",
];

/** Verifica se um conjunto de cabeçalhos cobre todos os exigidos. */
export function hasAllSecurityHeaders(headers = {}) {
  const present = new Set(Object.keys(headers).map((h) => h.toLowerCase()));
  return REQUIRED_SECURITY_HEADERS.every((h) => present.has(h));
}

/**
 * Calcula a força de uma senha (0 a 4) a partir de critérios simples:
 * tamanho, letras minúsculas/maiúsculas, números e símbolos.
 */
export function passwordScore(password) {
  if (typeof password !== "string" || password.length === 0) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const STRENGTH_LABELS = ["Muito fraca", "Fraca", "Razoável", "Boa", "Forte"];

/** Rótulo legível para a força da senha. */
export function passwordStrengthLabel(password) {
  return STRENGTH_LABELS[passwordScore(password)];
}

/** Uma senha é considerada aceitável a partir do score 3. */
export function isStrongPassword(password) {
  return passwordScore(password) >= 3;
}
