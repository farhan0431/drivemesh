import { ref } from 'vue';

export interface CredentialsData {
  username: string;
  hasPassword: boolean;
  serverDomain: string;
  serverHost: string;
  serverIp: string;
  smbUrl: string;
  windowsPath: string;
  webdavUrl: string;
}

export function useCredentials() {
  const credentials = ref<CredentialsData>({
    username: 'drivemesh',
    hasPassword: false,
    serverDomain: 'drivemesh.farhan-dev.my.id',
    serverHost: 'drivemesh.farhan-dev.my.id',
    serverIp: '103.49.239.82',
    smbUrl: 'smb://drivemesh.farhan-dev.my.id/gdrive',
    windowsPath: '\\\\drivemesh.farhan-dev.my.id\\gdrive',
    webdavUrl: 'https://drivemesh.farhan-dev.my.id/webdav',
  });
  const loading = ref(false);
  const saving = ref(false);
  const message = ref<string | null>(null);

  const fetchCredentials = async () => {
    loading.value = true;
    try {
      const res = await $fetch<{ success: boolean; data: CredentialsData }>('/api/credentials');
      if (res && res.success) {
        credentials.value = res.data;
      }
    } catch (err) {
      console.error('Error fetching credentials:', err);
    } finally {
      loading.value = false;
    }
  };

  const saveCredentials = async (username: string, password?: string) => {
    saving.value = true;
    message.value = null;
    try {
      const res = await $fetch<{ success: boolean; message: string; error?: string }>('/api/credentials', {
        method: 'POST',
        body: { username, password },
      });
      if (res.success) {
        message.value = res.message;
        await fetchCredentials();
        return true;
      } else {
        alert(res.error || 'Gagal menyimpan kredensial');
        return false;
      }
    } catch (err: unknown) {
      alert('Gagal menyimpan: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return false;
    } finally {
      saving.value = false;
    }
  };

  return {
    credentials,
    loading,
    saving,
    message,
    fetchCredentials,
    saveCredentials,
  };
}
