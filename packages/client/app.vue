<template>
  <NuxtLayout :domain="status.domain" :smb-active="status.smbService">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSystemStatus } from '~/composables/useSystemStatus';

const { status, fetchStatus } = useSystemStatus();

onMounted(() => {
  fetchStatus();
});
</script>
