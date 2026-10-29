<template>
  <section class="auth-layout">
    <div class="auth-intro"><NuxtLink to="/" class="quiet-link">{{ t('Kembali ke beranda', 'Back to home') }}</NuxtLink><h1>{{ t('Ruang untuk semua Drive Anda.', 'A place for all your drives.') }}</h1><p>{{ t('Buat akun, lalu sambungkan Google Drive yang ingin Anda akses.', 'Create an account, then connect the Google drives you want to access.') }}</p></div>
    <div class="auth-panel"><h2>{{ t('Daftar akun', 'Create an account') }}</h2><p>{{ t('Username dan password ini juga digunakan di Finder dan Explorer.', 'Use the same username and password in Finder and Explorer.') }}</p>
      <form class="auth-form" @submit.prevent="submit">
        <label for="username">Username</label><input id="username" v-model="username" name="username" autocomplete="username" required minlength="3" maxlength="20" pattern="[a-z][a-z0-9_]{2,19}" autocapitalize="none" aria-describedby="username-help" />
        <small id="username-help">{{ t('3–20 karakter, huruf kecil, angka, atau garis bawah. Awali dengan huruf; jangan awali dengan dm atau gunakan nama sistem seperti root.', '3–20 lowercase letters, numbers, or underscores. Start with a letter; do not start with dm or use a system name such as root.') }}</small>
        <label for="password">Password</label><div class="password-field"><input id="password" v-model="password" name="password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" required minlength="6" aria-describedby="password-help" /><button class="password-toggle" type="button" :aria-label="showPassword ? t('Sembunyikan password', 'Hide password') : t('Tampilkan password', 'Show password')" :aria-pressed="showPassword" aria-controls="password" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" :size="20" aria-hidden="true" /><Eye v-else :size="20" aria-hidden="true" /></button></div>
        <small id="password-help">{{ t('Minimal 6 karakter. Gunakan password yang unik.', 'At least 6 characters. Use a unique password.') }}</small>
        <label for="confirm">{{ t('Ulangi password', 'Confirm password') }}</label><div class="password-field"><input id="confirm" v-model="confirm" name="confirm" :type="showConfirm ? 'text' : 'password'" autocomplete="new-password" required /><button class="password-toggle" type="button" :aria-label="showConfirm ? t('Sembunyikan ulangi password', 'Hide confirmation password') : t('Tampilkan ulangi password', 'Show confirmation password')" :aria-pressed="showConfirm" aria-controls="confirm" @click="showConfirm = !showConfirm"><EyeOff v-if="showConfirm" :size="20" aria-hidden="true" /><Eye v-else :size="20" aria-hidden="true" /></button></div>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <button class="primary-link whitespace-nowrap" type="submit" :disabled="busy">{{ busy ? t('Membuat akun…', 'Creating account…') : t('Buat akun', 'Create account') }}</button>
      </form>
      <p class="auth-legal">{{ t('Dengan membuat akun, Anda menyetujui', 'By creating an account, you agree to the') }} <NuxtLink to="/terms">{{ t('Ketentuan Layanan', 'Terms of Service') }}</NuxtLink> {{ t('dan memahami', 'and acknowledge the') }} <NuxtLink to="/privacy">{{ t('Kebijakan Privasi', 'Privacy Policy') }}</NuxtLink>.</p>
      <p class="auth-switch">{{ t('Sudah punya akun?', 'Already have an account?') }} <NuxtLink to="/login">{{ t('Masuk', 'Sign in') }}</NuxtLink></p>
    </div>
  </section>
</template>
<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next';
const { t } = useLanguage();
const showPassword = ref(false), showConfirm = ref(false);
const username = ref(''), password = ref(''), confirm = ref(''), error = ref(''), busy = ref(false);
async function submit() {
  error.value = ''; if (password.value !== confirm.value) { error.value = t('Password belum sama.', 'Passwords do not match.'); return; }
  busy.value = true;
  try { await $fetch('/api/auth/register', { method: 'POST', body: { username: username.value.trim().toLowerCase(), password: password.value } }); await navigateTo('/dashboard'); }
  catch (e: any) { error.value = e?.statusCode === 409 ? t('Username tidak tersedia.', 'Username is unavailable.') : e?.statusCode === 429 ? t('Terlalu banyak percobaan. Coba lagi nanti.', 'Too many attempts. Please try again later.') : e?.statusCode === 400 ? t('Periksa username dan password Anda.', 'Please check your username and password.') : t('Akun tidak dapat dibuat. Coba lagi.', 'Unable to create an account. Please try again.'); }
  finally { busy.value = false; }
}
</script>
