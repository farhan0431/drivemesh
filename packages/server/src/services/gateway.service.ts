import { Account, AccountModel, Drive } from '../models/account.model';
import { mountService } from './mount.service';
import { sambaService } from './samba.service';
import { pool } from '../database/connection';
import { gdriveService } from './gdrive.service';
let queue: Promise<unknown> = Promise.resolve();
export function exclusive<T>(operation: () => Promise<T>): Promise<T> {
  const next = queue.then(operation, operation); queue = next.catch(() => undefined); return next;
}
export async function setupAccount(account: Account, password: string): Promise<void> {
  await exclusive(async () => {
    sambaService.ensureUser(account); mountService.prepareAccount(account); sambaService.setPassword(account, password);
    await AccountModel.setEnabled(account.id, true);
    try { sambaService.writeConfig(await AccountModel.all()); }
    catch (error) { await AccountModel.setEnabled(account.id, false); sambaService.disableUser(account); throw error; }
  });
}
export async function connectDrive(account: Account, code: string, verifier: string): Promise<boolean> {
  return exclusive(async () => {
    const drive = await gdriveService.connect(code, verifier, account.id);
    try {
      if (mountService.isMounted(account, drive)) { sambaService.closeShare(account); mountService.unmount(account, drive); }
      await mountService.mountDrive(account, drive);
      return true;
    } catch (error) { console.error('Drive mount failed', drive.id); return false; }
  });
}
export async function mountConnectedDrive(account: Account, drive: Drive): Promise<void> {
  await exclusive(async () => {
    const current = await AccountModel.drive(drive.id, account.id);
    if (!current) throw new Error('Drive tidak ditemukan');
    if (mountService.isMounted(account, current)) { sambaService.closeShare(account); mountService.unmount(account, current); }
    await mountService.mountDrive(account, current);
  });
}
export async function removeDrive(account: Account, drive: Drive): Promise<void> {
  await exclusive(async () => {
    // Close existing SMB handles before the mount disappears.
    sambaService.closeShare(account);
    mountService.unmount(account, drive);
    try { await gdriveService.revoke(drive); } catch { console.warn('Google token revocation failed for drive', drive.id); }
    await pool.query('DELETE FROM connected_drives WHERE id=$1 AND account_id=$2', [drive.id, account.id]);
  });
}
