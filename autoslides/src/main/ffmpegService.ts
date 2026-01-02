
import path from 'path';
import fs from 'fs';
import log from 'electron-log';

export class FFmpegService {
  private ffmpegPath: string | null = null;

  constructor() {
    this.initializeFfmpegPath();
  }

  private initializeFfmpegPath(): void {
    try {
      // In packaged app, check extraResource first
      if (process.resourcesPath) {
        // Try extraResource path first (packaged app)
        const ffmpegBinary = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
        const extraResourcePath = path.join(process.resourcesPath, 'ffmpeg-static', ffmpegBinary);
        log.info('Checking extraResource path:', extraResourcePath);
        log.info('Platform:', process.platform);
        log.info('Resources path:', process.resourcesPath);

        if (fs.existsSync(extraResourcePath)) {
          this.ffmpegPath = extraResourcePath;
          log.info('FFmpeg path (extraResource):', this.ffmpegPath);
          return;
        } else {
          log.info('extraResource path does not exist');
        }
      }

      // Fallback to ffmpeg-static npm package (development)
      // Use dynamic require to avoid module resolution errors in packaged app
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ffmpegStatic = require('ffmpeg-static');
      this.ffmpegPath = ffmpegStatic;
      log.info('FFmpeg path (npm package):', this.ffmpegPath);
    } catch (error) {
      log.error('ffmpeg-static not available:', error);
      this.ffmpegPath = null;
    }
  }

  getFfmpegPath(): string | null {
    return this.ffmpegPath;
  }

  isAvailable(): boolean {
    return this.ffmpegPath !== null;
  }

  getPlatformInfo(): { platform: string; ffmpegPath: string | null } {
    return {
      platform: process.platform,
      ffmpegPath: this.ffmpegPath
    };
  }
}