<template>
  <div class="space-y-4 text-xs text-zinc-300">
    <div class="space-y-2">
      <p class="font-medium text-zinc-200">1. Alamat Server untuk Aplikasi "Files" iPhone / iPad:</p>
      <CopyBox :text="smbUrl" copy-key="ios-smb" />
    </div>

    <div class="space-y-2 bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-3">
      <p class="font-semibold text-zinc-200 mb-2">Langkah-langkah di iPhone / iPad:</p>
      <ol class="list-decimal list-inside space-y-1.5 text-zinc-400">
        <li>Buka aplikasi <span class="text-zinc-200 font-medium">Files</span> bawaan iOS.</li>
        <li>Pada tab <span class="text-zinc-200 font-medium">Browse</span>, tekan icon lingkaran titik tiga (<span class="text-zinc-200 font-medium">...</span>) di pojok kanan atas.</li>
        <li>Pilih opsi <span class="text-zinc-200 font-medium">"Connect to Server"</span>.</li>
        <li>Masukkan alamat server di atas, lalu tekan <span class="text-zinc-200 font-medium">Connect</span>.</li>
        <li>Pilih <span class="text-zinc-200 font-medium">"Registered User"</span>, lalu masukkan <strong>Username & Password</strong> jaringan yang sudah Anda simpan di Bagian 2. Selesai!</li>
      </ol>
    </div>

    <div v-if="qrCodeDataUrl" class="flex items-center gap-4 bg-zinc-950/40 border border-zinc-800/40 rounded-lg p-3">
      <img :src="qrCodeDataUrl" alt="QR Code" class="w-20 h-20 bg-white p-1 rounded-md shrink-0" />
      <div class="space-y-1">
        <p class="font-medium text-zinc-200">Scan QR Code dengan Kamera iPhone</p>
        <p class="text-zinc-400">Arahkan kamera iPhone untuk cepat menyalin alamat koneksi server.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import QRCode from 'qrcode';
import CopyBox from '~/components/ui/CopyBox.vue';

const props = defineProps<{
  smbUrl: string;
}>();

const qrCodeDataUrl = ref<string>('');

const generateQR = async () => {
  try {
    qrCodeDataUrl.value = await QRCode.toDataURL(props.smbUrl, {
      margin: 1,
      width: 160,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error(err);
  }
};

onMounted(generateQR);
watch(() => props.smbUrl, generateQR);
</script>
