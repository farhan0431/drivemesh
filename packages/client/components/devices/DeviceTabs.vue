<template>
  <div class="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
          💻
        </div>
        <div>
          <h2 class="text-sm font-semibold text-zinc-100">3. Hubungkan ke Perangkat Anda</h2>
          <p class="text-xs text-zinc-400">Pilih jenis perangkat yang ingin Anda sambungkan langsung.</p>
        </div>
      </div>
    </div>

    <!-- Tabs Header -->
    <div class="flex border-b border-zinc-800">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        @click="activeTab = tab.id"
        class="flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors -mb-px"
        :class="
          activeTab === tab.id
            ? 'border-blue-500 text-blue-400 bg-blue-500/5'
            : 'border-transparent text-zinc-400 hover:text-zinc-200'
        "
      >
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="pt-2">
      <IosGuide v-if="activeTab === 'ios'" :smb-url="smbUrl" />
      <MacGuide v-else-if="activeTab === 'mac'" :smb-url="smbUrl" />
      <WindowsGuide v-else-if="activeTab === 'windows'" :windows-path="windowsPath" :username="username" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import IosGuide from './IosGuide.vue';
import MacGuide from './MacGuide.vue';
import WindowsGuide from './WindowsGuide.vue';

defineProps<{
  smbUrl: string;
  windowsPath: string;
  username: string;
}>();

const tabs = [
  { id: 'ios', label: '📱 iPhone / iPad Files' },
  { id: 'mac', label: '🍏 macOS Finder' },
  { id: 'windows', label: '🪟 Windows Explorer' },
];

const activeTab = ref('ios');
</script>
