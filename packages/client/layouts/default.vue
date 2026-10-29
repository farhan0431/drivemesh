<template><div class="site-shell"><AppHeader /><main class="main-content"><slot /></main><AppFooter /></div></template>
<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue';
import AppFooter from '~/components/layout/AppFooter.vue';
</script>
