<template>
  <div class="space-y-6">
    <!-- Hero Notice -->
    <div class="bg-blue-950/20 border border-blue-900/40 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-200">
      <div class="w-5 h-5 rounded-full bg-blue-900/60 flex items-center justify-center shrink-0 text-blue-300 font-bold">
        i
      </div>
      <div>
        <p class="font-medium text-blue-100">Stateless Streaming Gateway (Zero Local Storage)</p>
        <p class="text-blue-300/80 mt-0.5">
          Server ini hanya mengalirkan data on-the-fly dari Google Drive Anda ke iPhone, Mac, atau Windows. File Anda 100% aman tersimpan di cloud Google.
        </p>
      </div>
    </div>

    <!-- 1. Google OAuth Card -->
    <GoogleAuthCard
      :connected="authData.connected"
      :email="authData.email"
      :name="authData.name"
      :picture="authData.picture"
      :quota="authData.quota"
      @connect="connectGoogle"
      @disconnect="disconnectGoogle"
    />

    <!-- 2. Network Credentials Card -->
    <CredentialsCard
      :initial-username="credentials.username"
      :has-password="credentials.hasPassword"
      :saving="savingCredentials"
      :success-msg="credentialsMsg"
      @save="onSaveCredentials"
    />

    <!-- 3. Device Connection Tabs -->
    <DeviceTabs
      :smb-url="credentials.smbUrl"
      :windows-path="credentials.windowsPath"
      :username="credentials.username"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import GoogleAuthCard from '~/components/auth/GoogleAuthCard.vue';
import CredentialsCard from '~/components/credentials/CredentialsCard.vue';
import DeviceTabs from '~/components/devices/DeviceTabs.vue';
import { useGoogleAuth } from '~/composables/useGoogleAuth';
import { useCredentials } from '~/composables/useCredentials';

const { authData, fetchStatus: fetchAuth, connectGoogle, disconnectGoogle } = useGoogleAuth();
const {
  credentials,
  saving: savingCredentials,
  message: credentialsMsg,
  fetchCredentials,
  saveCredentials,
} = useCredentials();

const onSaveCredentials = async ({ username, password }: { username: string; password?: string }) => {
  await saveCredentials(username, password);
};

onMounted(async () => {
  await Promise.all([fetchAuth(), fetchCredentials()]);
});
</script>
