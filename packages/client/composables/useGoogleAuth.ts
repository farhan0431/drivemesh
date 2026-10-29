import { ref } from 'vue';

export interface QuotaInfo {
  limitBytes: number;
  usageBytes: number;
  usagePercent: number;
  limitFormatted: string;
  usageFormatted: string;
}

export interface GoogleAuthData {
  connected: boolean;
  email?: string;
  name?: string;
  picture?: string;
  quota?: QuotaInfo;
  mountStatus?: {
    active: boolean;
    mountPoint: string;
    protocol: string;
  };
}

export function useGoogleAuth() {
  const authData = ref<GoogleAuthData>({ connected: false });
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchStatus = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await $fetch<{ success: boolean; data: GoogleAuthData }>('/api/auth/status');
      if (res && res.success) {
        authData.value = res.data;
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat status Google';
    } finally {
      loading.value = false;
    }
  };

  const connectGoogle = async () => {
    try {
      const res = await $fetch<{ success: boolean; url: string; error?: string }>('/api/auth/google/url');
      if (res.success && res.url) {
        window.location.href = res.url;
      } else if (res.error) {
        alert(res.error);
      }
    } catch (err: unknown) {
      alert('Gagal memulai otorisasi Google: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const disconnectGoogle = async () => {
    if (!confirm('Apakah Anda yakin ingin memutuskan akses Google Drive?')) return;
    try {
      await $fetch('/api/auth/disconnect', { method: 'POST' });
      await fetchStatus();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    authData,
    loading,
    error,
    fetchStatus,
    connectGoogle,
    disconnectGoogle,
  };
}
