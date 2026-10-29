<template>
  <div v-if="loading" class="page-message" role="status">{{ t('Memuat akun Anda…', 'Loading your account…') }}</div>
  <div v-else-if="error && !authData.authenticated" class="page-message" role="alert">{{ error }} <button class="text-button" @click="initialize">{{ t('Coba lagi', 'Try again') }}</button></div>
  <div v-else-if="authData.authenticated" class="dashboard">
    <div class="dashboard-heading"><div><h1>{{ t('Drive Anda', 'Your drives') }}</h1><p>{{ t('Kelola Google Drive dan sambungkan perangkat Anda.', 'Manage your Google drives and connect your devices.') }}</p></div><button class="secondary-button" @click="logout">{{ t('Keluar', 'Sign out') }}</button></div>
    <div v-if="notice" class="notice" role="status">{{ notice }}</div><div v-if="error || driveError" class="form-error" role="alert">{{ error || driveError }}</div>
    <div class="dashboard-grid">
      <section class="dashboard-main" aria-labelledby="drives-title">
        <div class="section-title"><div><h2 id="drives-title">{{ t('Google Drive terhubung', 'Connected Google drives') }}</h2><p>{{ t('Setiap akun Google muncul sebagai folder di share Anda.', 'Each Google account appears as a folder in your share.') }}</p></div><button class="primary-link compact" @click="connectGoogle">{{ t('Hubungkan Google Drive', 'Connect Google Drive') }}</button></div>
        <div v-if="drivesLoading" class="empty-state" role="status">{{ t('Memuat daftar Drive…', 'Loading drives…') }}</div>
        <div v-else-if="!drives.length" class="empty-state"><strong>{{ t('Belum ada Drive terhubung', 'No drives connected yet') }}</strong><p>{{ t('Hubungkan akun Google untuk menampilkannya di perangkat Anda.', 'Connect a Google account to show it on your devices.') }}</p></div>
        <ul v-else class="drive-list"><li v-for="drive in drives" :key="drive.id"><div class="drive-icon" aria-hidden="true">G</div><div class="drive-info"><strong>{{ drive.email }}</strong><span>Folder: {{ drive.folderName }}</span></div><div class="drive-controls"><span :class="drive.mounted ? 'status-ready' : 'status-offline'">{{ drive.mounted ? t('Siap', 'Ready') : t('Tidak terhubung', 'Not connected') }}</span><button v-if="!drive.mounted" class="text-button" :disabled="!!pending" @click="mount(drive)">{{ t('Coba lagi', 'Try again') }}</button><button class="text-button danger" :disabled="!!pending" @click="disconnect(drive)">{{ t('Putuskan', 'Disconnect') }}</button></div></li></ul>
      </section>
      <aside class="connection-panel" aria-labelledby="connection-title"><h2 id="connection-title">{{ t('Akses perangkat', 'Device access') }}</h2><p>{{ t('Gunakan username dan password yang sama dengan akun DriveMesh Anda.', 'Use the same username and password as your DriveMesh account.') }}</p><template v-if="credentials"><div class="connection-detail"><span>Username</span><strong>{{ credentials.username }}</strong></div><div class="connection-detail"><span>{{ t('Alamat server', 'Server address') }}</span><CopyBox :text="credentials.smbUrl" copy-key="smb" /></div><p class="security-note">{{ t('Gunakan password yang unik dan kuat untuk melindungi akses file Anda.', 'Use a strong, unique password to protect access to your files.') }}</p></template><p v-else-if="credentialsError" class="form-error">{{ credentialsError }}</p><p v-else>{{ t('Memuat alamat…', 'Loading address…') }}</p></aside>
    </div>
    <DeviceTabs v-if="credentials" :smb-url="credentials.smbUrl" :windows-path="credentials.directWindowsPath" :username="credentials.username" />
  </div>
</template>
<script setup lang="ts">
import DeviceTabs from '~/components/devices/DeviceTabs.vue';
import CopyBox from '~/components/ui/CopyBox.vue';
const { t } = useLanguage();
interface Drive { id: string; email: string; folderName: string; mounted: boolean }
const { authData, loading, error, fetchStatus, connectGoogle, logout } = useGoogleAuth();
const { credentials, error: credentialsError, fetchCredentials } = useCredentials();
const drives = ref<Drive[]>([]), drivesLoading = ref(false), driveError = ref(''), pending = ref('');
const route = useRoute();
const notice = computed(() => route.query.error === 'mount_failed' ? t('Drive terhubung, tetapi belum dapat dipasang. Coba lagi dari daftar.', 'Drive connected but could not be mounted. Try again from the list.') : route.query.error === 'google_failed' ? t('Google Drive tidak dapat dihubungkan. Pastikan akun belum terhubung ke pengguna lain, lalu coba lagi.', 'Unable to connect Google Drive. Make sure the account is not linked to another user, then try again.') : route.query.error === 'google_cancelled' ? t('Proses menghubungkan Google dibatalkan.', 'Google connection was cancelled.') : route.query.connected ? t('Google Drive berhasil dihubungkan.', 'Google Drive connected successfully.') : '');
async function refreshDrives() { drivesLoading.value = true; driveError.value = ''; try { drives.value = (await $fetch<{ data: Drive[] }>('/api/auth/drives')).data; } catch { driveError.value = t('Tidak dapat memuat daftar Drive. Muat ulang halaman.', 'Unable to load drives. Reload the page.'); } finally { drivesLoading.value = false; } }
async function initialize() { await fetchStatus(); if (error.value) return; if (!authData.value.authenticated) { await navigateTo('/login'); return; } await Promise.all([fetchCredentials(), refreshDrives()]); }
async function mount(drive: Drive) { pending.value = drive.id; driveError.value = ''; try { await $fetch(`/api/auth/drives/${drive.id}/mount`, { method: 'POST' }); await refreshDrives(); } catch { driveError.value = t('Drive belum dapat dipasang. Periksa layanan lalu coba lagi.', 'Unable to mount the drive. Check the service and try again.'); } finally { pending.value = ''; } }
async function disconnect(drive: Drive) { if (!window.confirm(t(`Putuskan ${drive.email} dari DriveMesh?`, `Disconnect ${drive.email} from DriveMesh?`))) return; pending.value = drive.id; driveError.value = ''; try { await $fetch(`/api/auth/drives/${drive.id}`, { method: 'DELETE' }); await refreshDrives(); } catch { driveError.value = t('Drive belum dapat diputuskan. Coba lagi.', 'Unable to disconnect the drive. Try again.'); } finally { pending.value = ''; } }
onMounted(initialize);
</script>
