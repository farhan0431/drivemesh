/** Create a safe, readable folder name that remains distinct on Windows and macOS. */
export function makeFolderName(displayName: string | null | undefined, email: string, usedNames: Iterable<string>): string {
  const fallback = email.split('@')[0] || 'Akun';
  const clean = (value: string) => Array.from(value.normalize('NFKC')
    .replace(/[\\/:*?"<>|\p{C}]/gu, ' ')
    .replace(/\s+/g, ' ').trim()).slice(0, 36).join('').replace(/[. ]+$/g, '');
  const label = clean(displayName || '') || clean(fallback) || 'Akun';
  const base = `Google Drive - ${label}`;
  const used = new Set(Array.from(usedNames, name => name.normalize('NFKC').toLocaleLowerCase('en-US')));
  let candidate = base, suffix = 2;
  while (used.has(candidate.normalize('NFKC').toLocaleLowerCase('en-US'))) candidate = `${base} (${suffix++})`;
  return candidate;
}
export function isSafeFolderName(name: string): boolean {
  return !!name && Array.from(name).length <= 64 && name !== '.' && name !== '..' && !/[\\/:*?"<>|\p{C}]/u.test(name) && !/[. ]$/.test(name);
}
