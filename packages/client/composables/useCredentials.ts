import { ref } from 'vue';
export interface CredentialsData { username: string; hasPassword: boolean; smbUrl: string; windowsPath: string; directWindowsPath: string }
export function useCredentials() {
  const { t } = useLanguage();
  const credentials = ref<CredentialsData | null>(null);
  const error = ref<string | null>(null);
  const fetchCredentials = async () => {
    error.value = null;
    try { credentials.value = (await $fetch<{ data: CredentialsData }>('/api/credentials')).data; }
    catch { error.value = t('Alamat koneksi tidak tersedia. Muat ulang halaman.', 'Connection address is unavailable. Reload the page.'); }
  };
  return { credentials, error, fetchCredentials };
}
