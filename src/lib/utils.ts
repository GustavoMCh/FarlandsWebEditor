export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Intentar con API moderna
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('❌ Clipboard API falló:', err);
  }

  // Fallback: execCommand
  return fallbackCopyTextToClipboard(text);
};

// Función síncrona → devuelve boolean
const fallbackCopyTextToClipboard = (text: string): boolean => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-999999px';
  document.body.appendChild(textarea);
  textarea.focus({ preventScroll: true });
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    if (!successful) throw new Error('execCommand falló');
    return true;
  } catch (err) {
    console.error('❌ Falló copiar al portapapeles', err);
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
};