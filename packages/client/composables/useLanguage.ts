type Language = 'id' | 'en';
export function useLanguage() {
  const route = useRoute();
  const cookie = useCookie<Language | null>('drivemesh_language', { default: () => null, sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });
  if (route.query.lang === 'en' && cookie.value !== 'en') cookie.value = 'en';
  const language = useState<Language>('drivemesh-language', () => route.query.lang === 'en' ? 'en' : cookie.value === 'en' ? 'en' : 'id');
  const t = (id: string, en: string) => language.value === 'en' ? en : id;
  const setLanguage = (value: Language) => {
    language.value = value;
    cookie.value = value;
    if (route.query.lang) { const query = { ...route.query }; delete query.lang; navigateTo({ path: route.path, query }, { replace: true }); }
  };
  return { language, t, setLanguage };
}
