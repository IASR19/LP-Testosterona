function isAppleMobile() {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;
  const iOSDevice = /iPad|iPhone|iPod/i.test(ua);
  const iPadOs = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  return iOSDevice || iPadOs;
}

/**
 * Dispara o download do ebook e leva ao grupo do WhatsApp.
 *
 * - iOS: duas abas no mesmo gesto de toque (Drive não baixa via iframe).
 *   WhatsApp abre por último para ficar em foco.
 * - Demais: download em nova aba + a aba atual vai para o WhatsApp.
 */
export function downloadThenRedirect(
  downloadUrl: string,
  redirectUrl: string,
  delayMs = 1200,
) {
  if (isAppleMobile()) {
    window.open(downloadUrl, "_blank", "noopener,noreferrer");

    // Segundo open síncrono (ainda no gesto do usuário) — evita bloqueio de popup
    // e deixa o WhatsApp como última aba em foco no Safari.
    const whatsappTab = window.open(redirectUrl, "_blank", "noopener,noreferrer");
    whatsappTab?.focus();
    return;
  }

  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    window.location.assign(redirectUrl);
  }, delayMs);
}
