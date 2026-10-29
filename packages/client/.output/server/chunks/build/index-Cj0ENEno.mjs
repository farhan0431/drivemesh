import { defineComponent, mergeProps, unref, ref, watch, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import QRCode from 'qrcode';
import { Check, Copy } from 'lucide-vue-next';

const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "GoogleAuthCard",
  __ssrInlineRender: true,
  props: {
    connected: { type: Boolean },
    email: {},
    name: {},
    picture: {},
    quota: {}
  },
  emits: ["connect", "disconnect"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-sm" }, _attrs))}><div class="flex items-center justify-between mb-4"><div class="flex items-center gap-2.5"><div class="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300"> G </div><h2 class="text-sm font-semibold text-zinc-100">1. Otorisasi Akun Google Drive</h2></div>`);
      if (__props.connected) {
        _push(`<span class="text-xs px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-mono"> Terhubung </span>`);
      } else {
        _push(`<span class="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono"> Belum Terhubung </span>`);
      }
      _push(`</div>`);
      if (__props.connected) {
        _push(`<div class="space-y-4"><div class="flex items-center justify-between bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-3"><div class="flex items-center gap-3">`);
        if (__props.picture) {
          _push(`<img${ssrRenderAttr("src", __props.picture)} alt="Profile" class="w-9 h-9 rounded-full border border-zinc-700">`);
        } else {
          _push(`<div class="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 text-xs font-semibold">${ssrInterpolate(__props.email ? __props.email[0].toUpperCase() : "U")}</div>`);
        }
        _push(`<div><p class="text-xs font-medium text-zinc-200">${ssrInterpolate(__props.name || "Akun Google")}</p><p class="text-xs text-zinc-400 font-mono">${ssrInterpolate(__props.email)}</p></div></div><button type="button" class="text-xs px-3 py-1.5 rounded-lg border border-red-900/60 text-red-400 hover:bg-red-950/40 transition-colors"> Putuskan </button></div>`);
        if (__props.quota) {
          _push(`<div class="space-y-1.5"><div class="flex justify-between text-xs font-mono text-zinc-400"><span>Kapasitas Digunakan</span><span>${ssrInterpolate(__props.quota.usageFormatted)} / ${ssrInterpolate(__props.quota.limitFormatted)} (${ssrInterpolate(__props.quota.usagePercent)}%)</span></div><div class="w-full bg-zinc-800 h-2 rounded-full overflow-hidden"><div class="bg-blue-500 h-full rounded-full transition-all duration-500" style="${ssrRenderStyle({ width: `${Math.min(__props.quota.usagePercent, 100)}%` })}"></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="py-2 space-y-3"><p class="text-xs text-zinc-400 leading-relaxed"> Beri otorisasi agar DriveMesh dapat mengalirkan file Google Drive Anda ke perangkat lokal (iPhone, Mac, Windows). Tidak ada file yang disimpan di server ini. </p><button type="button" class="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-sm"><span>Masuk dengan Google</span></button></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/GoogleAuthCard.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "CredentialsCard",
  __ssrInlineRender: true,
  props: {
    initialUsername: {},
    hasPassword: { type: Boolean },
    saving: { type: Boolean },
    successMsg: {}
  },
  emits: ["save"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const usernameInput = ref(props.initialUsername);
    const passwordInput = ref("");
    watch(
      () => props.initialUsername,
      (val) => {
        usernameInput.value = val;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4" }, _attrs))}><div class="flex items-center justify-between"><div class="flex items-center gap-2.5"><div class="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300"> \u{1F511} </div><div><h2 class="text-sm font-semibold text-zinc-100">2. Kredensial Login Jaringan (SMB)</h2><p class="text-xs text-zinc-400">Digunakan saat diminta login di iPhone Files, Mac Finder, atau Windows Explorer.</p></div></div></div><form class="space-y-3 pt-1"><div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><div class="space-y-1"><label class="text-xs text-zinc-300 font-medium">Username Jaringan</label><input${ssrRenderAttr("value", usernameInput.value)} type="text" required placeholder="Contoh: farhan" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"></div><div class="space-y-1"><label class="text-xs text-zinc-300 font-medium"> Password Jaringan `);
      if (__props.hasPassword) {
        _push(`<span class="text-zinc-500 font-normal">(Kosongkan jika tak ingin diubah)</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><input${ssrRenderAttr("value", passwordInput.value)} type="password"${ssrRenderAttr("placeholder", __props.hasPassword ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : "Buat password baru")} class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"></div></div><div class="flex items-center justify-between pt-1">`);
      if (__props.successMsg) {
        _push(`<span class="text-xs text-emerald-400 font-medium">${ssrInterpolate(__props.successMsg)}</span>`);
      } else {
        _push(`<span></span>`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(__props.saving) ? " disabled" : ""} class="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium transition-colors disabled:opacity-50">${ssrInterpolate(__props.saving ? "Menyimpan..." : "Simpan Kredensial")}</button></div></form></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/credentials/CredentialsCard.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
function useCopy() {
  const copiedKey = ref(null);
  const copyToClipboard = async (text, key = "default") => {
    try {
      await (void 0).clipboard.writeText(text);
      copiedKey.value = key;
      setTimeout(() => {
        if (copiedKey.value === key) {
          copiedKey.value = null;
        }
      }, 2e3);
      return true;
    } catch (err) {
      console.error("Failed to copy text:", err);
      return false;
    }
  };
  return {
    copiedKey,
    copyToClipboard
  };
}
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "CopyBox",
  __ssrInlineRender: true,
  props: {
    text: {},
    copyKey: {}
  },
  setup(__props) {
    const props = __props;
    const { copiedKey } = useCopy();
    const id = props.copyKey || props.text;
    const isCopied = computed(() => copiedKey.value === id);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm" }, _attrs))}><code class="font-mono text-zinc-300 truncate select-all">${ssrInterpolate(__props.text)}</code><button type="button" class="ml-3 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors shrink-0">`);
      if (isCopied.value) {
        _push(ssrRenderComponent(unref(Check), { class: "w-3.5 h-3.5 text-emerald-400" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Copy), { class: "w-3.5 h-3.5 text-zinc-400" }, null, _parent));
      }
      _push(`<span>${ssrInterpolate(isCopied.value ? "Tersalin" : "Salin")}</span></button></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/CopyBox.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "IosGuide",
  __ssrInlineRender: true,
  props: {
    smbUrl: {}
  },
  setup(__props) {
    const props = __props;
    const qrCodeDataUrl = ref("");
    const generateQR = async () => {
      try {
        qrCodeDataUrl.value = await QRCode.toDataURL(props.smbUrl, {
          margin: 1,
          width: 160,
          color: {
            dark: "#000000",
            light: "#ffffff"
          }
        });
      } catch (err) {
        console.error(err);
      }
    };
    watch(() => props.smbUrl, generateQR);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4 text-xs text-zinc-300" }, _attrs))}><div class="space-y-2"><p class="font-medium text-zinc-200">1. Alamat Server untuk Aplikasi &quot;Files&quot; iPhone / iPad:</p>`);
      _push(ssrRenderComponent(_sfc_main$5, {
        text: __props.smbUrl,
        "copy-key": "ios-smb"
      }, null, _parent));
      _push(`</div><div class="space-y-2 bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-3"><p class="font-semibold text-zinc-200 mb-2">Langkah-langkah di iPhone / iPad:</p><ol class="list-decimal list-inside space-y-1.5 text-zinc-400"><li>Buka aplikasi <span class="text-zinc-200 font-medium">Files</span> bawaan iOS.</li><li>Pada tab <span class="text-zinc-200 font-medium">Browse</span>, tekan icon lingkaran titik tiga (<span class="text-zinc-200 font-medium">...</span>) di pojok kanan atas.</li><li>Pilih opsi <span class="text-zinc-200 font-medium">&quot;Connect to Server&quot;</span>.</li><li>Masukkan alamat server di atas, lalu tekan <span class="text-zinc-200 font-medium">Connect</span>.</li><li>Pilih <span class="text-zinc-200 font-medium">&quot;Registered User&quot;</span>, lalu masukkan <strong>Username &amp; Password</strong> jaringan yang sudah Anda simpan di Bagian 2. Selesai!</li></ol></div>`);
      if (qrCodeDataUrl.value) {
        _push(`<div class="flex items-center gap-4 bg-zinc-950/40 border border-zinc-800/40 rounded-lg p-3"><img${ssrRenderAttr("src", qrCodeDataUrl.value)} alt="QR Code" class="w-20 h-20 bg-white p-1 rounded-md shrink-0"><div class="space-y-1"><p class="font-medium text-zinc-200">Scan QR Code dengan Kamera iPhone</p><p class="text-zinc-400">Arahkan kamera iPhone untuk cepat menyalin alamat koneksi server.</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/devices/IosGuide.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "MacGuide",
  __ssrInlineRender: true,
  props: {
    smbUrl: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4 text-xs text-zinc-300" }, _attrs))}><div class="space-y-2"><p class="font-medium text-zinc-200">1. Alamat Server untuk macOS Finder:</p>`);
      _push(ssrRenderComponent(_sfc_main$5, {
        text: __props.smbUrl,
        "copy-key": "mac-smb"
      }, null, _parent));
      _push(`</div><div class="space-y-2 bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-3"><p class="font-semibold text-zinc-200 mb-2">Langkah-langkah di Mac Finder:</p><ol class="list-decimal list-inside space-y-1.5 text-zinc-400"><li>Buka <span class="text-zinc-200 font-medium">Finder</span>.</li><li>Tekan tombol pintasan <span class="text-zinc-200 font-mono px-1.5 py-0.5 rounded bg-zinc-800">Cmd + K</span> (atau menu <em>Go \u2192 Connect to Server</em>).</li><li>Tempel alamat server di atas, lalu klik <span class="text-zinc-200 font-medium">Connect</span>.</li><li>Pilih <span class="text-zinc-200 font-medium">&quot;Registered User&quot;</span>, masukkan Username &amp; Password Anda.</li><li>Google Drive akan langsung ter-mount sebagai hardisk eksternal di Desktop &amp; Finder Anda!</li></ol></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/devices/MacGuide.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "WindowsGuide",
  __ssrInlineRender: true,
  props: {
    windowsPath: {},
    username: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4 text-xs text-zinc-300" }, _attrs))}><div class="space-y-2"><p class="font-medium text-zinc-200">1. Alamat Folder Jaringan Windows:</p>`);
      _push(ssrRenderComponent(_sfc_main$5, {
        text: __props.windowsPath,
        "copy-key": "win-path"
      }, null, _parent));
      _push(`</div><div class="space-y-2 bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-3"><p class="font-semibold text-zinc-200 mb-2">Langkah-langkah di Windows File Explorer:</p><ol class="list-decimal list-inside space-y-1.5 text-zinc-400"><li>Buka <span class="text-zinc-200 font-medium">File Explorer</span> (<span class="font-mono text-zinc-200">Win + E</span>).</li><li>Klik kanan pada <span class="text-zinc-200 font-medium">This PC</span> lalu pilih <span class="text-zinc-200 font-medium">&quot;Map network drive...&quot;</span>.</li><li>Pilih Drive Letter (misal: <span class="text-zinc-200 font-mono">Z:</span>) dan tempel alamat folder di atas.</li><li>Centang opsi <span class="text-zinc-200 font-medium">&quot;Connect using different credentials&quot;</span>, lalu klik <span class="text-zinc-200 font-medium">Finish</span>.</li><li>Saat jendela Windows Security muncul, masukkan Username &amp; Password jaringan Anda, dan centang <em>&quot;Remember my credentials&quot;</em>.</li></ol></div><div class="space-y-2"><p class="font-medium text-zinc-200">Atau Sekali Klik via Command Prompt (CMD):</p>`);
      _push(ssrRenderComponent(_sfc_main$5, {
        text: `net use Z: ${__props.windowsPath} /user:${__props.username}`,
        "copy-key": "win-cmd"
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/devices/WindowsGuide.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DeviceTabs",
  __ssrInlineRender: true,
  props: {
    smbUrl: {},
    windowsPath: {},
    username: {}
  },
  setup(__props) {
    const tabs = [
      { id: "ios", label: "\u{1F4F1} iPhone / iPad Files" },
      { id: "mac", label: "\u{1F34F} macOS Finder" },
      { id: "windows", label: "\u{1FA9F} Windows Explorer" }
    ];
    const activeTab = ref("ios");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4" }, _attrs))}><div class="flex items-center justify-between"><div class="flex items-center gap-2.5"><div class="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300"> \u{1F4BB} </div><div><h2 class="text-sm font-semibold text-zinc-100">3. Hubungkan ke Perangkat Anda</h2><p class="text-xs text-zinc-400">Pilih jenis perangkat yang ingin Anda sambungkan langsung.</p></div></div></div><div class="flex border-b border-zinc-800"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button type="button" class="${ssrRenderClass([
          activeTab.value === tab.id ? "border-blue-500 text-blue-400 bg-blue-500/5" : "border-transparent text-zinc-400 hover:text-zinc-200",
          "flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors -mb-px"
        ])}"><span>${ssrInterpolate(tab.label)}</span></button>`);
      });
      _push(`<!--]--></div><div class="pt-2">`);
      if (activeTab.value === "ios") {
        _push(ssrRenderComponent(_sfc_main$4, { "smb-url": __props.smbUrl }, null, _parent));
      } else if (activeTab.value === "mac") {
        _push(ssrRenderComponent(_sfc_main$3, { "smb-url": __props.smbUrl }, null, _parent));
      } else if (activeTab.value === "windows") {
        _push(ssrRenderComponent(_sfc_main$2, {
          "windows-path": __props.windowsPath,
          username: __props.username
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/devices/DeviceTabs.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
function useGoogleAuth() {
  const authData = ref({ connected: false });
  const loading = ref(false);
  const error = ref(null);
  const fetchStatus = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await $fetch("/api/auth/status");
      if (res && res.success) {
        authData.value = res.data;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Gagal memuat status Google";
    } finally {
      loading.value = false;
    }
  };
  const connectGoogle = async () => {
    try {
      const res = await $fetch("/api/auth/google/url");
      if (res.success && res.url) {
        (void 0).location.href = res.url;
      } else if (res.error) {
        alert(res.error);
      }
    } catch (err) {
      alert("Gagal memulai otorisasi Google: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };
  const disconnectGoogle = async () => {
    if (!confirm("Apakah Anda yakin ingin memutuskan akses Google Drive?")) return;
    try {
      await $fetch("/api/auth/disconnect", { method: "POST" });
      await fetchStatus();
    } catch (err) {
      console.error(err);
    }
  };
  return {
    authData,
    loading,
    error,
    fetchStatus,
    connectGoogle,
    disconnectGoogle
  };
}
function useCredentials() {
  const credentials = ref({
    username: "drivemesh",
    hasPassword: false,
    serverDomain: "drivemesh.farhan-dev.my.id",
    serverHost: "drivemesh.farhan-dev.my.id",
    serverIp: "103.49.239.82",
    smbUrl: "smb://drivemesh.farhan-dev.my.id/gdrive",
    windowsPath: "\\\\drivemesh.farhan-dev.my.id\\gdrive",
    webdavUrl: "https://drivemesh.farhan-dev.my.id/webdav"
  });
  const loading = ref(false);
  const saving = ref(false);
  const message = ref(null);
  const fetchCredentials = async () => {
    loading.value = true;
    try {
      const res = await $fetch("/api/credentials");
      if (res && res.success) {
        credentials.value = res.data;
      }
    } catch (err) {
      console.error("Error fetching credentials:", err);
    } finally {
      loading.value = false;
    }
  };
  const saveCredentials = async (username, password) => {
    saving.value = true;
    message.value = null;
    try {
      const res = await $fetch("/api/credentials", {
        method: "POST",
        body: { username, password }
      });
      if (res.success) {
        message.value = res.message;
        await fetchCredentials();
        return true;
      } else {
        alert(res.error || "Gagal menyimpan kredensial");
        return false;
      }
    } catch (err) {
      alert("Gagal menyimpan: " + (err instanceof Error ? err.message : "Unknown error"));
      return false;
    } finally {
      saving.value = false;
    }
  };
  return {
    credentials,
    loading,
    saving,
    message,
    fetchCredentials,
    saveCredentials
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { authData, connectGoogle, disconnectGoogle } = useGoogleAuth();
    const {
      credentials,
      saving: savingCredentials,
      message: credentialsMsg,
      saveCredentials
    } = useCredentials();
    const onSaveCredentials = async ({ username, password }) => {
      await saveCredentials(username, password);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="bg-blue-950/20 border border-blue-900/40 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-200"><div class="w-5 h-5 rounded-full bg-blue-900/60 flex items-center justify-center shrink-0 text-blue-300 font-bold"> i </div><div><p class="font-medium text-blue-100">Stateless Streaming Gateway (Zero Local Storage)</p><p class="text-blue-300/80 mt-0.5"> Server ini hanya mengalirkan data on-the-fly dari Google Drive Anda ke iPhone, Mac, atau Windows. File Anda 100% aman tersimpan di cloud Google. </p></div></div>`);
      _push(ssrRenderComponent(_sfc_main$7, {
        connected: unref(authData).connected,
        email: unref(authData).email,
        name: unref(authData).name,
        picture: unref(authData).picture,
        quota: unref(authData).quota,
        onConnect: unref(connectGoogle),
        onDisconnect: unref(disconnectGoogle)
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$6, {
        "initial-username": unref(credentials).username,
        "has-password": unref(credentials).hasPassword,
        saving: unref(savingCredentials),
        "success-msg": unref(credentialsMsg),
        onSave: onSaveCredentials
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        "smb-url": unref(credentials).smbUrl,
        "windows-path": unref(credentials).windowsPath,
        username: unref(credentials).username
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Cj0ENEno.mjs.map
