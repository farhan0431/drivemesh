<template>
  <div class="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2.5">
        <div class="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
          G
        </div>
        <h2 class="text-sm font-semibold text-zinc-100">1. Otorisasi Akun Google Drive</h2>
      </div>
      <span
        v-if="connected"
        class="text-xs px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-mono"
      >
        Terhubung
      </span>
      <span
        v-else
        class="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono"
      >
        Belum Terhubung
      </span>
    </div>

    <!-- Connected State -->
    <div v-if="connected" class="space-y-4">
      <div class="flex items-center justify-between bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-3">
        <div class="flex items-center gap-3">
          <img
            v-if="picture"
            :src="picture"
            alt="Profile"
            class="w-9 h-9 rounded-full border border-zinc-700"
          />
          <div v-else class="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 text-xs font-semibold">
            {{ email ? email[0].toUpperCase() : 'U' }}
          </div>
          <div>
            <p class="text-xs font-medium text-zinc-200">{{ name || 'Akun Google' }}</p>
            <p class="text-xs text-zinc-400 font-mono">{{ email }}</p>
          </div>
        </div>

        <button
          type="button"
          @click="$emit('disconnect')"
          class="text-xs px-3 py-1.5 rounded-lg border border-red-900/60 text-red-400 hover:bg-red-950/40 transition-colors"
        >
          Putuskan
        </button>
      </div>

      <!-- Quota Display -->
      <div v-if="quota" class="space-y-1.5">
        <div class="flex justify-between text-xs font-mono text-zinc-400">
          <span>Kapasitas Digunakan</span>
          <span>{{ quota.usageFormatted }} / {{ quota.limitFormatted }} ({{ quota.usagePercent }}%)</span>
        </div>
        <div class="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
          <div
            class="bg-blue-500 h-full rounded-full transition-all duration-500"
            :style="{ width: `${Math.min(quota.usagePercent, 100)}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Disconnected State -->
    <div v-else class="py-2 space-y-3">
      <p class="text-xs text-zinc-400 leading-relaxed">
        Beri otorisasi agar DriveMesh dapat mengalirkan file Google Drive Anda ke perangkat lokal (iPhone, Mac, Windows). Tidak ada file yang disimpan di server ini.
      </p>
      <button
        type="button"
        @click="$emit('connect')"
        class="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-sm"
      >
        <span>Masuk dengan Google</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuotaInfo } from '~/composables/useGoogleAuth';

defineProps<{
  connected: boolean;
  email?: string;
  name?: string;
  picture?: string;
  quota?: QuotaInfo;
}>();

defineEmits<{
  (e: 'connect'): void;
  (e: 'disconnect'): void;
}>();
</script>
