import { ref } from 'vue';
export interface AccountStatus { authenticated: boolean; username?: string }
export function useGoogleAuth() {
  const { t } = useLanguage();
  const authData = ref<AccountStatus>({ authenticated: false });
  const loading = ref(true);
  const error = ref<string | null>(null);
  const fetchStatus = async () => {
    loading.value = true; error.value = null;
    try { const res = await $fetch<{ success: boolean; data: AccountStatus }>('/api/auth/status'); authData.value = res.data; }
    catch { error.value = t('Tidak dapat memuat status akun. Periksa koneksi dan coba lagi.', 'Unable to load account status. Check your connection and try again.'); }
    finally { loading.value = false; }
  };
  const connectGoogle = async () => {
    error.value = null;
    try { const res = await $fetch<{ url: string }>('/api/auth/google/url'); window.location.assign(res.url); }
    catch { error.value = t('Tidak dapat membuka Google. Pastikan layanan dan konfigurasi OAuth tersedia.', 'Unable to open Google. Check the service and OAuth configuration.'); }
  };
  const logout = async () => {
    error.value = null;
    try { await $fetch('/api/auth/logout', { method: 'POST' }); await navigateTo('/login'); }
    catch { error.value = t('Tidak dapat keluar. Coba lagi.', 'Unable to sign out. Please try again.'); }
  };
  return { authData, loading, error, fetchStatus, connectGoogle, logout };
}
