// Global module declarations for non-TS assets used in the project.
// Kept minimal to satisfy the tsconfig "files" entry and common imports.
//
// The vite/client reference brings in `ImportMetaEnv` (so `import.meta.env.DEV`
// type-checks in modules that gate dev-only branches such as translation-store).
/// <reference types="vite/client" />

declare module '*.json' {
  const value: unknown;
  export default value;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}
