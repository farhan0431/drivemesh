<template>
  <div class="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm">
    <code class="font-mono text-zinc-300 truncate select-all">{{ text }}</code>
    <button
      type="button"
      @click="handleCopy"
      class="ml-3 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors shrink-0"
    >
      <Check v-if="isCopied" class="w-3.5 h-3.5 text-emerald-400" />
      <Copy v-else class="w-3.5 h-3.5 text-zinc-400" />
      <span>{{ isCopied ? 'Tersalin' : 'Salin' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Copy, Check } from 'lucide-vue-next';
import { useCopy } from '~/composables/useCopy';

const props = defineProps<{
  text: string;
  copyKey?: string;
}>();

const { copiedKey, copyToClipboard } = useCopy();
const id = props.copyKey || props.text;
const isCopied = computed(() => copiedKey.value === id);

const handleCopy = () => {
  copyToClipboard(props.text, id);
};
</script>
