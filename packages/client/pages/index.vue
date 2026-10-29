<template>
  <section class="landing">
    <div class="landing-copy"><h1>{{ t('Semua Drive Anda, terasa dekat.', 'All your drives, close at hand.') }}</h1><p class="intro-copy">{{ t('Hubungkan Google Drive ke Finder, Explorer, dan perangkat Anda.', 'Connect Google Drive to Finder, Explorer, and your devices.') }}</p><div class="hero-actions"><NuxtLink class="primary-link" to="/register">{{ t('Buat akun', 'Create account') }}</NuxtLink><NuxtLink class="quiet-link" to="/login">{{ t('Sudah punya akun? Masuk', 'Already have an account? Sign in') }}</NuxtLink></div></div>
    <div class="landing-object" :aria-label="t('Cara kerja DriveMesh', 'How DriveMesh works')"><div class="object-title">DriveMesh <span>{{ t('Ruang file Anda', 'Your file space') }}</span></div><div class="object-row"><span>01</span><strong>{{ t('Buat akun', 'Create an account') }}</strong><span>Username & password</span></div><div class="object-row"><span>02</span><strong>{{ t('Hubungkan Drive', 'Connect your drives') }}</strong><span>{{ t('Satu atau lebih akun Google', 'One or more Google accounts') }}</span></div><div class="object-row"><span>03</span><strong>{{ t('Buka di perangkat', 'Open on your devices') }}</strong><span>{{ t('Finder, Explorer, atau Files', 'Finder, Explorer, or Files') }}</span></div></div>
  </section>
  <section class="landing-bottom"><h2>{{ t('Satu tempat untuk Drive Anda.', 'One place for your drives.') }}</h2><p>{{ t('Masuk ke DriveMesh, hubungkan akun Google, lalu akses folder Drive melalui file sharing di perangkat Anda.', 'Sign in to DriveMesh, connect your Google accounts, and access Drive folders through file sharing on your devices.') }}</p></section>
</template>

<script setup lang="ts">const { t } = useLanguage();</script>
