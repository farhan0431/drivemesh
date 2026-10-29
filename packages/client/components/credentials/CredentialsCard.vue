<template>
  <div class="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
          🔑
        </div>
        <div>
          <h2 class="text-sm font-semibold text-zinc-100">2. Kredensial Login Jaringan (SMB)</h2>
          <p class="text-xs text-zinc-400">Digunakan saat diminta login di iPhone Files, Mac Finder, atau Windows Explorer.</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-3 pt-1">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="text-xs text-zinc-300 font-medium">Username Jaringan</label>
          <input
            v-model="usernameInput"
            type="text"
            required
            placeholder="Contoh: farhan"
            class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs text-zinc-300 font-medium">
            Password Jaringan
            <span v-if="hasPassword" class="text-zinc-500 font-normal">(Kosongkan jika tak ingin diubah)</span>
          </label>
          <input
            v-model="passwordInput"
            type="password"
            :placeholder="hasPassword ? '••••••••••••' : 'Buat password baru'"
            class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
      </div>

      <div class="flex items-center justify-between pt-1">
        <span v-if="successMsg" class="text-xs text-emerald-400 font-medium">
          {{ successMsg }}
        </span>
        <span v-else />

        <button
          type="submit"
          :disabled="saving"
          class="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium transition-colors disabled:opacity-50"
        >
          {{ saving ? 'Menyimpan...' : 'Simpan Kredensial' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  initialUsername: string;
  hasPassword: boolean;
  saving?: boolean;
  successMsg?: string | null;
}>();

const emit = defineEmits<{
  (e: 'save', payload: { username: string; password?: string }): void;
}>();

const usernameInput = ref(props.initialUsername);
const passwordInput = ref('');

watch(
  () => props.initialUsername,
  (val) => {
    usernameInput.value = val;
  }
);

const handleSubmit = () => {
  emit('save', {
    username: usernameInput.value.trim(),
    password: passwordInput.value ? passwordInput.value : undefined,
  });
  passwordInput.value = '';
};
</script>
