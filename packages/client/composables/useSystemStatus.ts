import { ref } from 'vue';

export interface SystemStatusData {
  smbService: boolean;
  webdavService: boolean;
  mountActive: boolean;
  sslActive: boolean;
  domain: string;
}

export function useSystemStatus() {
  const status = ref<SystemStatusData>({
    smbService: true,
    webdavService: true,
    mountActive: false,
    sslActive: true,
    domain: 'drivemesh.farhan-dev.my.id',
  });
  const loading = ref(false);

  const fetchStatus = async () => {
    loading.value = true;
    try {
      const res = await $fetch<{ success: boolean; data: SystemStatusData }>('/api/status');
      if (res && res.success) {
        status.value = res.data;
      }
    } catch {
      // Keep defaults if offline
    } finally {
      loading.value = false;
    }
  };

  return {
    status,
    loading,
    fetchStatus,
  };
}
