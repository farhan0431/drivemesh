<template><NuxtLayout><section class="page-message"><h1>{{ error.statusCode === 404 ? t('Halaman tidak ditemukan', 'Page not found') : t('Terjadi kesalahan', 'Something went wrong') }}</h1><p>{{ t('Silakan kembali ke beranda dan coba lagi.', 'Please return home and try again.') }}</p><button class="primary-link" type="button" @click="clearError({ redirect: '/' })">{{ t('Kembali ke beranda', 'Back to home') }}</button></section></NuxtLayout></template>
<script setup lang="ts">
const { language, t } = useLanguage();
useHead({ htmlAttrs: { lang: language } });
defineProps<{ error: { statusCode: number } }>();
</script>
