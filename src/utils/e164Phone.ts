/** ITU-T E.164: + e até 15 dígitos (código do país + número nacional). */
export const E164_MAX_DIGITS = 15;

export const E164_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

export const E164_PHONE_HTML_PATTERN = String.raw`\+[1-9]\d{7,14}`;

/**
 * Mantém apenas "+" no início e dígitos (máx. 15), no formato E.164.
 */
export const formatE164PhoneInput = (value: string): string => {
  const trimmed = value.trim();
  const digits = value.replace(/\D/g, "").slice(0, E164_MAX_DIGITS);

  if (!digits.length) {
    return trimmed === "+" ? "+" : "";
  }

  return `+${digits}`;
};

export const isValidE164Phone = (value: string): boolean =>
  E164_PHONE_REGEX.test(value.trim());
