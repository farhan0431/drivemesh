<template><NuxtLayout><NuxtPage /></NuxtLayout></template>
<script setup lang="ts">
const { language } = useLanguage();
useHead({ htmlAttrs: { lang: language } });
</script>
