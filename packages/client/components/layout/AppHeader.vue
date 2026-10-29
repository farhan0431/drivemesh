<template>
  <header class="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur sticky top-0 z-40">
    <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
          D
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="font-semibold text-zinc-100 text-sm tracking-tight">DriveMesh</h1>
            <span class="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">v1.0</span>
          </div>
          <p class="text-xs text-zinc-400 font-mono hidden sm:block">{{ domain }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <StatusBadge :active="smbActive">SMB 3.1.1</StatusBadge>
        <StatusBadge :active="true">TLS 1.3</StatusBadge>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import StatusBadge from '~/components/ui/StatusBadge.vue';

defineProps<{
  domain: string;
  smbActive: boolean;
}>();
</script>
