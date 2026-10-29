<template>
  <section class="auth-layout">
    <div class="auth-intro"><NuxtLink to="/" class="quiet-link">{{ t('Kembali ke beranda', 'Back to home') }}</NuxtLink><h1>{{ t('Selamat datang kembali.', 'Welcome back.') }}</h1><p>{{ t('Masuk untuk mengelola Drive dan akses perangkat Anda.', 'Sign in to manage your drives and device access.') }}</p></div>
    <div class="auth-panel"><h2>{{ t('Masuk ke DriveMesh', 'Sign in to DriveMesh') }}</h2><p>{{ t('Gunakan akun DriveMesh Anda.', 'Use your DriveMesh account.') }}</p>
      <form class="auth-form" @submit.prevent="submit">
        <label for="username">Username</label><input id="username" v-model="username" name="username" autocomplete="username" required autocapitalize="none" />
        <label for="password">Password</label><div class="password-field"><input id="password" v-model="password" name="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required /><button class="password-toggle" type="button" :aria-label="showPassword ? t('Sembunyikan password', 'Hide password') : t('Tampilkan password', 'Show password')" :aria-pressed="showPassword" aria-controls="password" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" :size="20" aria-hidden="true" /><Eye v-else :size="20" aria-hidden="true" /></button></div>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <button class="primary-link whitespace-nowrap" type="submit" :disabled="busy">{{ busy ? t('Sedang masuk…', 'Signing in…') : t('Masuk', 'Sign in') }}</button>
      </form>
      <p class="auth-switch">{{ t('Belum punya akun?', 'Don’t have an account?') }} <NuxtLink to="/register">{{ t('Daftar', 'Sign up') }}</NuxtLink></p>
    </div>
  </section>
</template>
<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next';
const { t } = useLanguage();
const showPassword = ref(false);
const username = ref(''), password = ref(''), error = ref(''), busy = ref(false);
async function submit() {
  busy.value = true; error.value = '';
  try { await $fetch('/api/auth/login', { method: 'POST', body: { username: username.value.trim().toLowerCase(), password: password.value } }); await navigateTo('/dashboard'); }
  catch (e: any) { error.value = e?.statusCode === 429 ? t('Terlalu banyak percobaan. Coba lagi nanti.', 'Too many attempts. Please try again later.') : e?.statusCode === 401 ? t('Username atau password salah.', 'Incorrect username or password.') : t('Tidak dapat masuk. Coba lagi.', 'Unable to sign in. Please try again.'); }
  finally { busy.value = false; }
}
</script>
