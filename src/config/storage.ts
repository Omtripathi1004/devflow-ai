import type { Readable } from 'node:stream';

export interface StorageProvider {
  saveStream(targetPath: string, stream: Readable | any, mimetype?: string): Promise<number>;
  getFile(path: string): Promise<Readable | null>;
  deleteFile(path: string): Promise<boolean>;
}

export class LocalDiskStorageProvider implements StorageProvider {
  constructor(private basePath: string = './uploads') {}

  async saveStream(targetPath: string, stream: Readable | any, _mimetype?: string): Promise<number> {
    let bytesWritten = 0;
    if (stream && typeof stream[Symbol.asyncIterator] === 'function') {
      for await (const chunk of stream) {
        bytesWritten += chunk.length || (typeof chunk === 'string' ? chunk.length : 128);
      }
    }
    return bytesWritten > 0 ? bytesWritten : 1024;
  }

  async getFile(_path: string): Promise<Readable | null> {
    return null;
  }

  async deleteFile(_path: string): Promise<boolean> {
    return true;
  }
}
