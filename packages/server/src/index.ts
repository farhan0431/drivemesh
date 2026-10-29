import { createApp } from './app';
import { config } from './config';
import { initDatabase } from './database/connection';
import { sambaService } from './services/samba.service';
import { mountService } from './services/mount.service';

async function bootstrap() {
  try {
    console.log('--- Starting DriveMesh Gateway Engine ---');

    // 1. Initialize PostgreSQL
    await initDatabase();

    // 2. Configure Samba
    sambaService.ensureSambaConfig();

    // 3. Attempt initial mount if token exists
    mountService.mountDrive().catch((err) => {
      console.warn('Initial mount skipped:', err.message);
    });

    // 4. Start HTTP Server
    const app = createApp();
    app.listen(config.port, '0.0.0.0', () => {
      console.log(`🚀 DriveMesh Server listening on http://0.0.0.0:${config.port}`);
      console.log(`🌐 Public Domain: https://${config.domain}`);
      console.log(`📁 Mount Target: ${config.mountPoint}`);
    });
  } catch (error) {
    console.error('Fatal initialization error:', error);
    process.exit(1);
  }
}

bootstrap();
