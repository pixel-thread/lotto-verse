export function openApp(path: string) {
  const appUrl = `lottoverse://${path}`;
  const webUrl = `https://lotto-verse.vercel.app/${path}`;

  // Try opening Android app
  window.location.href = appUrl;

  // Fallback to web after delay
  setTimeout(() => {
    window.location.href = webUrl;
  }, 1200);
}
