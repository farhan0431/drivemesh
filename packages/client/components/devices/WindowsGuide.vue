<template>
  <div class="space-y-4 text-xs text-zinc-300">
    <div class="space-y-2">
      <p class="font-medium text-zinc-200">1. Alamat Folder Jaringan Windows:</p>
      <CopyBox :text="windowsPath" copy-key="win-path" />
    </div>

    <div class="space-y-2 bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-3">
      <p class="font-semibold text-zinc-200 mb-2">Langkah-langkah di Windows File Explorer:</p>
      <ol class="list-decimal list-inside space-y-1.5 text-zinc-400">
        <li>Buka <span class="text-zinc-200 font-medium">File Explorer</span> (<span class="font-mono text-zinc-200">Win + E</span>).</li>
        <li>Klik kanan pada <span class="text-zinc-200 font-medium">This PC</span> lalu pilih <span class="text-zinc-200 font-medium">"Map network drive..."</span>.</li>
        <li>Pilih Drive Letter (misal: <span class="text-zinc-200 font-mono">Z:</span>) dan tempel alamat folder di atas.</li>
        <li>Centang opsi <span class="text-zinc-200 font-medium">"Connect using different credentials"</span>, lalu klik <span class="text-zinc-200 font-medium">Finish</span>.</li>
        <li>Saat jendela Windows Security muncul, masukkan Username & Password jaringan Anda, dan centang <em>"Remember my credentials"</em>.</li>
      </ol>
    </div>

    <div class="space-y-2">
      <p class="font-medium text-zinc-200">Atau Sekali Klik via Command Prompt (CMD):</p>
      <CopyBox :text="`net use Z: ${windowsPath} /user:${username}`" copy-key="win-cmd" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CopyBox from '~/components/ui/CopyBox.vue';

defineProps<{
  windowsPath: string;
  username: string;
}>();
</script>
