<template>
  <div class="space-y-4 text-xs text-zinc-300">
    <div class="space-y-2">
      <p class="font-medium text-zinc-200">1. Alamat Server untuk macOS Finder:</p>
      <CopyBox :text="smbUrl" copy-key="mac-smb" />
    </div>

    <div class="space-y-2 bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-3">
      <p class="font-semibold text-zinc-200 mb-2">Langkah-langkah di Mac Finder:</p>
      <ol class="list-decimal list-inside space-y-1.5 text-zinc-400">
        <li>Buka <span class="text-zinc-200 font-medium">Finder</span>.</li>
        <li>Tekan tombol pintasan <span class="text-zinc-200 font-mono px-1.5 py-0.5 rounded bg-zinc-800">Cmd + K</span> (atau menu <em>Go &rarr; Connect to Server</em>).</li>
        <li>Tempel alamat server di atas, lalu klik <span class="text-zinc-200 font-medium">Connect</span>.</li>
        <li>Pilih <span class="text-zinc-200 font-medium">"Registered User"</span>, masukkan Username & Password Anda.</li>
        <li>Google Drive akan langsung ter-mount sebagai hardisk eksternal di Desktop & Finder Anda!</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import CopyBox from '~/components/ui/CopyBox.vue';

defineProps<{
  smbUrl: string;
}>();
</script>
