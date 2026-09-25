import type { Readable } from 'node:stream';
import { randomUUID } from 'node:crypto';
import type { StorageProvider } from '../config/storage';
import { BadRequestError } from '../errors/appErrors';

/**
 * Upload payload structure representing streaming multipart input
 */
export interface UploadPayload {
  stream: Readable | any;
  filename?: string;
  mimetype?: string;
  encoding?: string;
}

/**
 * Result structure produced upon successful stream persistence
 */
export interface UploadResult {
  fileId: string;
  filename: string;
  sizeBytes: number;
  storedPath: string;
  uploadedAt: string;
}

/**
 * CsvUploadService - Patched for incident BUG-142
 */
export class CsvUploadService {
  private allowedMimeTypes = new Set([
    'text/csv',
    'application/vnd.ms-excel',
    'text/plain',
  ]);

  // Storage backend dependency
  constructor(private storage: StorageProvider) {}

  /**
   * Validates upload metadata and guarantees safe filename resolution */
  public validateUpload(file: Partial<UploadPayload> | undefined): { sanitizedFilename: string; verifiedMime: string } {
    if (!file || !file.stream) {
      throw new BadRequestError('Upload payload is missing required file stream');
    }

    // Defensive resolution: fallback to UUID if filename is omitted or blank
    const rawFilename = file.filename?.trim();
    const fallbackId = typeof randomUUID === 'function' ? randomUUID() : Math.random().toString(36).substring(2, 12);
    const sanitizedFilename = rawFilename && rawFilename.length > 0
      ? rawFilename.replace(/\.\./g, '__').replace(/[^a-zA-Z0-9._-]/g, '_')
      : `upload_${fallbackId}.csv`;

    const verifiedMime = file.mimetype && this.allowedMimeTypes.has(file.mimetype)
      ? file.mimetype
      : 'text/csv';

    return { sanitizedFilename, verifiedMime };
  }

  public async processFileStream(file: UploadPayload): Promise<UploadResult> {
    const { sanitizedFilename, verifiedMime } = this.validateUpload(file);
    const fallbackId = typeof randomUUID === 'function' ? randomUUID() : Math.random().toString(36).substring(2, 12);
    const fileId = fallbackId;
    const storedPath = `ingest/${fileId}_${sanitizedFilename}`;

    const bytesWritten = await this.storage.saveStream(storedPath, file.stream, verifiedMime);

    return {
      fileId,
      filename: sanitizedFilename,
      sizeBytes: bytesWritten,
      storedPath,
      uploadedAt: new Date().toISOString(),
    };
  }
}
