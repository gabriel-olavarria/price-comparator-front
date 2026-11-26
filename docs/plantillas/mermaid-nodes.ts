const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

const icons = {
  react: `${DEVICON}/react/react-original.svg`,
  typescript: `${DEVICON}/typescript/typescript-original.svg`,
  axios: `${DEVICON}/axios/axios-plain.svg`,
} as const;

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function validateId(id: string): void {
  if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(id)) throw new Error(`ID de nodo no válido: ${id}`);
}

export function iconFile(id: string, filename: string, iconUrl: string): string {
  validateId(id);
  const label = `<div style='display:flex;align-items:center;gap:8px;white-space:nowrap;'><img src='${iconUrl}' width='20' height='20' /><span>${escapeHtml(filename)}</span></div>`;
  return `${id}["${label}"]:::file`;
}

export const reactFile = (id: string, filename: string) => iconFile(id, filename, icons.react);
export const typescriptFile = (id: string, filename: string) => iconFile(id, filename, icons.typescript);
export const axiosFile = (id: string, filename: string) => iconFile(id, filename, icons.axios);

export function textFile(id: string, filename: string): string {
  validateId(id);
  return `${id}["📄 ${escapeHtml(filename)}"]:::file`;
}
