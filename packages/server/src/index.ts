import { createApp } from './app';
import { config } from './config';
import { initDatabase } from './database/connection';
import { AccountModel } from './models/account.model';
import { sambaService } from './services/samba.service';
import { mountService } from './services/mount.service';
async function bootstrap() {
  try {
    if (!config.databaseUrl) throw new Error('DATABASE_URL wajib diatur');
    if (config.masterKey.length < 32 || config.masterKey === 'drivemesh-enterprise-vault-secure-master-key-32b!') throw new Error('MASTER_KEY harus berupa rahasia unik minimal 32 karakter');
    if (config.env === 'production' && !process.env.DOMAIN) throw new Error('DOMAIN wajib diatur');
    if (!/^\/[a-zA-Z0-9_/-]+$/.test(config.mountPoint) || config.mountPoint.includes('..')) throw new Error('MOUNT_POINT tidak valid');
    await initDatabase();
    sambaService.ensureGroup();
    sambaService.writeConfig([]);
    for (const account of await AccountModel.all()) {
      if (!account.smb_enabled) continue;
      sambaService.ensureUser(account); mountService.prepareAccount(account);
      for (const drive of await AccountModel.drives(account.id)) {
        try { await mountService.mountDrive(account, drive); }
        catch (error) { console.error(`Gagal memulihkan mount ${drive.id}`, error); }
      }
    }
    sambaService.writeConfig(await AccountModel.all()); sambaService.start();
    createApp().listen(config.port, config.listenHost, () => console.log(`DriveMesh API listening on port ${config.port}`));
  } catch (error) { console.error('Fatal initialization error:', error); process.exit(1); }
}
bootstrap();
