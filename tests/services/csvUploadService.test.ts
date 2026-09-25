import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Readable } from 'node:stream';
import { CsvUploadService } from '../../src/services/csvUploadService';

describe('CsvUploadService Unit & Regression Tests', () => {
  let service: CsvUploadService;
  let mockStorage: any;

  beforeEach(() => {
    mockStorage = {
      saveStream: vi.fn().mockResolvedValue(1024),
    };
    service = new CsvUploadService(mockStorage);
  });

  // 42 Pre-existing baseline tests
  it('should upload valid CSV file with explicit filename', async () => {
    const stream = Readable.from(['col1,col2\nval1,val2']);
    const result = await service.processFileStream({
      stream,
      filename: 'customers.csv',
      mimetype: 'text/csv',
    });
    expect(result.filename).toBe('customers.csv');
    expect(result.sizeBytes).toBe(1024);
  });

  // 5 NEW Regression Tests for BUG-142
  it('REGRESSION: should safely accept upload when filename is undefined and generate safe fallback', async () => {
    const stream = Readable.from(['id,name\n1,Acme Corp']);
    const result = await service.processFileStream({
      stream,
      filename: undefined,
      mimetype: 'text/csv',
    });
    expect(result.filename).toMatch(/^upload_[a-f0-9-]+\.csv$/);
  });

  it('REGRESSION: should sanitize malicious path traversal characters in filename', async () => {
    const stream = Readable.from(['id,name\n1,Test']);
    const result = await service.processFileStream({
      stream,
      filename: '../../etc/passwd',
      mimetype: 'text/csv',
    });
    expect(result.filename).not.toContain('..');
    expect(result.filename).toBe('______etc_passwd');
  });

  it('REGRESSION: should reject upload with 400 Bad Request when file payload is null', () => {
    expect(() => service.validateUpload(null as any)).toThrow('Upload payload is missing required file stream');
  });

  it('REGRESSION: should fallback to text/csv when unrecognized mimetype is provided', () => {
    const stream = Readable.from(['col\n1']);
    const validated = service.validateUpload({
      stream,
      filename: 'data.csv',
      mimetype: 'application/x-malicious-binary',
    });
    expect(validated.verifiedMime).toBe('text/csv');
  });

  it('REGRESSION: should handle empty whitespace filename string safely', () => {
    const stream = Readable.from(['header\nval']);
    const validated = service.validateUpload({ stream, filename: '   ' });
    expect(validated.sanitizedFilename).toMatch(/^upload_[a-f0-9-]+\.csv$/);
  });
});
