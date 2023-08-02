declare global {
  // fix
  function setTimeout(callback: () => void, ms?: number | undefined): number;

  function setInterval(callback: () => void, ms?: number | undefined): number;
}

export {};
