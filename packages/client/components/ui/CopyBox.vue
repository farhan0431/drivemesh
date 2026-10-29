<template><div class="copy-box"><code>{{ text }}</code><button type="button" @click="handleCopy">{{ isCopied ? t('Tersalin', 'Copied') : t('Salin', 'Copy') }}</button></div></template>
<script setup lang="ts">
import { computed } from 'vue';
const { t } = useLanguage();
import { useCopy } from '~/composables/useCopy';
const props = defineProps<{ text: string; copyKey?: string }>();
const { copiedKey, copyToClipboard } = useCopy();
const id = props.copyKey || props.text;
const isCopied = computed(() => copiedKey.value === id);
const handleCopy = () => copyToClipboard(props.text, id);
</script>
