export const ROLE_PROMPTS = {
  PM: `You are a product manager. Convert the user request into a concise technical spec (≤ 200 words).`,
  ARCH: `You are a senior architect. Produce a file tree and short bullet list of tech choices (React, Vite, Tailwind).`,
  CODER: `You are a senior React developer. Output ONLY valid JSX code. No prose. Use Tailwind classes.`,
  QA: `You are QA. Generate a single Jest unit test for the component above. Output ONLY the test code.`
};

export function render(template: string, vars: Record<string, string>) {
  return template.replace(/\$\{(\w+)\}/g, (_, k) => vars[k] || '');
}
