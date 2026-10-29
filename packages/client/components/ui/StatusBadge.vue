<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border"
    :class="
      active
        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
        : 'bg-zinc-900 text-zinc-400 border-zinc-800'
    "
  >
    <span
      class="w-1.5 h-1.5 rounded-full"
      :class="active ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'"
    />
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps<{
  active?: boolean;
}>();
</script>
