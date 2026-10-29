import { ref } from 'vue';

export function useCopy() {
  const copiedKey = ref<string | null>(null);

  const copyToClipboard = async (text: string, key = 'default') => {
    try {
      await navigator.clipboard.writeText(text);
      copiedKey.value = key;
      setTimeout(() => {
        if (copiedKey.value === key) {
          copiedKey.value = null;
        }
      }, 2000);
      return true;
    } catch (err) {
      console.error('Failed to copy text:', err);
      return false;
    }
  };

  return {
    copiedKey,
    copyToClipboard,
  };
}
