<template>
  <section class="device-section"><h2>{{ t('Hubungkan perangkat', 'Connect a device') }}</h2><p>{{ t('Pilih perangkat dan gunakan akun DriveMesh Anda saat diminta.', 'Choose a device and use your DriveMesh account when prompted.') }}</p>
    <div class="device-tabs" role="tablist" :aria-label="t('Panduan perangkat', 'Device guides')"><button v-for="tab in tabs" :key="tab.id" role="tab" :aria-selected="activeTab === tab.id" :aria-controls="`guide-${tab.id}`" :id="`tab-${tab.id}`" :tabindex="activeTab === tab.id ? 0 : -1" @click="select(tab.id)" @keydown.left.prevent="move(-1)" @keydown.right.prevent="move(1)">{{ tab.label }}</button></div>
    <div class="device-guide" role="tabpanel" :id="`guide-${activeTab}`" :aria-labelledby="`tab-${activeTab}`">
      <template v-if="activeTab === 'ios'"><h3>{{ t('iPhone dan iPad', 'iPhone and iPad') }}</h3><ol><li>{{ t('Buka Files, lalu pilih Browse dan Connect to Server.', 'Open Files, then choose Browse and Connect to Server.') }}</li><li>{{ t('Masukkan alamat server di bawah.', 'Enter the server address below.') }}</li><li>{{ t('Pilih Registered User, masukkan akun DriveMesh Anda, lalu pilih folder DriveMesh.', 'Choose Registered User, enter your DriveMesh credentials, then select DriveMesh.') }}</li></ol><CopyBox :text="smbUrl" copy-key="ios-smb" /></template>
      <template v-else-if="activeTab === 'mac'"><h3>macOS Finder</h3><ol><li>{{ t('Di Finder, pilih Go lalu Connect to Server (⌘K).', 'In Finder, choose Go and then Connect to Server (⌘K).') }}</li><li>{{ t('Masukkan alamat server di bawah.', 'Enter the server address below.') }}</li><li>{{ t('Masuk sebagai Registered User dengan akun DriveMesh Anda, lalu pilih DriveMesh.', 'Sign in as a Registered User with your DriveMesh account, then select DriveMesh.') }}</li></ol><CopyBox :text="smbUrl" copy-key="mac-smb" /></template>
      <template v-else><h3>Windows Explorer</h3><ol><li>{{ t('Di File Explorer, pilih This PC lalu Map network drive.', 'In File Explorer, select This PC and then Map network drive.') }}</li><li>{{ t('Masukkan alamat folder di bawah dan pilih koneksi dengan kredensial berbeda.', 'Enter the folder address below and select connect using different credentials.') }}</li><li>{{ t(`Masuk dengan username ${username} dan password DriveMesh Anda.`, `Sign in with username ${username} and your DriveMesh password.`) }}</li></ol><CopyBox :text="windowsPath" copy-key="windows-path" /></template>
    </div>
  </section>
</template>
<script setup lang="ts">
import CopyBox from '~/components/ui/CopyBox.vue';
const { t } = useLanguage();
defineProps<{ smbUrl: string; windowsPath: string; username: string }>();
const tabs = [{ id: 'ios', label: 'iPhone / iPad' }, { id: 'mac', label: 'Mac' }, { id: 'windows', label: 'Windows' }];
const activeTab = ref('ios');
function select(id: string) { activeTab.value = id; }
function move(direction: number) { const i = tabs.findIndex(tab => tab.id === activeTab.value); activeTab.value = tabs[(i + direction + tabs.length) % tabs.length].id; nextTick(() => document.getElementById(`tab-${activeTab.value}`)?.focus()); }
</script>
