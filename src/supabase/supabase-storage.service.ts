import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseStorageService {
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;
  private readonly bucket: string;
  private readonly documentsBucket: string;

  constructor(private readonly config: ConfigService) {
    this.supabaseUrl = this.config.get<string>('SUPABASE_URL')!;
    this.serviceRoleKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY')!;
    this.bucket = this.config.get<string>('SUPABASE_STORAGE_BUCKET')!;
    this.documentsBucket = this.config.get<string>('SUPABASE_DOCUMENTS_BUCKET') || 'candidate-documents';
  }

  private get storageBaseUrl(): string {
    return `${this.supabaseUrl.replace(/\/+$/, '')}/storage/v1`;
  }

  private get serviceHeaders() {
    return {
      Authorization: `Bearer ${this.serviceRoleKey}`,
      apikey: this.serviceRoleKey,
    };
  }

  private async ensureBucketExists(): Promise<void> {
    const bucketRes = await fetch(`${this.supabaseUrl}/storage/v1/bucket/${this.bucket}`, {
      headers: { Authorization: `Bearer ${this.serviceRoleKey}` },
    });

    if (bucketRes.ok) return;

    if (bucketRes.status !== 404) {
      const detail = await bucketRes.text();
      throw new Error(`Supabase bucket check failed: ${detail}`);
    }

    const createRes = await fetch(`${this.supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.bucket,
        name: this.bucket,
        public: true,
        file_size_limit: 2097152,
        allowed_mime_types: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
      }),
    });

    if (!createRes.ok) {
      const detail = await createRes.text();
      throw new Error(`Supabase bucket create failed: ${detail}`);
    }
  }

  async upload(
    file: Express.Multer.File,
    fileName: string,
    folder?: string,
  ): Promise<string> {
    await this.ensureBucketExists();

    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype });
    const res = await fetch(
      `${this.supabaseUrl}/storage/v1/object/${this.bucket}/${filePath}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.serviceRoleKey}`,
          'Content-Type': file.mimetype,
          'x-upsert': 'true',
        },
        body: blob,
      },
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Supabase upload failed: ${err}`);
    }

    return `${this.supabaseUrl}/storage/v1/object/public/${this.bucket}/${filePath}`;
  }

  async remove(fileName: string, folder?: string): Promise<void> {
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    const res = await fetch(
      `${this.storageBaseUrl}/object/${encodeURIComponent(this.bucket)}`,
      {
        method: 'DELETE',
        headers: { ...this.serviceHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefixes: [filePath] }),
      },
    );
    if (!res.ok && res.status !== 404) {
      const detail = await res.text();
      throw new Error(`Supabase file delete failed: ${detail}`);
    }
  }

  private async ensureDocumentsBucketExists(): Promise<void> {
    const bucketUrl = `${this.storageBaseUrl}/bucket/${encodeURIComponent(this.documentsBucket)}`;
    const bucketRes = await fetch(bucketUrl, { headers: this.serviceHeaders });
    const options = {
      public: false,
      file_size_limit: 10 * 1024 * 1024,
      allowed_mime_types: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
      ],
    };

    if (bucketRes.ok) {
      const updateRes = await fetch(bucketUrl, {
        method: 'PUT',
        headers: { ...this.serviceHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });
      if (!updateRes.ok) {
        const detail = await updateRes.text();
        throw new Error(`Supabase documents bucket update failed: ${detail}`);
      }
      return;
    }

    if (bucketRes.status !== 404) {
      const detail = await bucketRes.text();
      throw new Error(`Supabase documents bucket check failed: ${detail}`);
    }

    const createRes = await fetch(`${this.storageBaseUrl}/bucket`, {
      method: 'POST',
      headers: { ...this.serviceHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: this.documentsBucket, name: this.documentsBucket, ...options }),
    });
    if (!createRes.ok) {
      const detail = await createRes.text();
      throw new Error(`Supabase documents bucket create failed: ${detail}`);
    }
  }

  async uploadDocument(
    file: Express.Multer.File,
    fileName: string,
    candidateId: string,
    mimeType: string,
  ): Promise<string> {
    await this.ensureDocumentsBucketExists();
    const filePath = `${candidateId}/${fileName}`;
    const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
    const res = await fetch(
      `${this.storageBaseUrl}/object/${encodeURIComponent(this.documentsBucket)}/${encodedPath}`,
      {
        method: 'POST',
        headers: {
          ...this.serviceHeaders,
          'Content-Type': mimeType,
          'x-upsert': 'true',
        },
        body: new Blob([new Uint8Array(file.buffer)], { type: mimeType }),
      },
    );
    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`Supabase document upload failed: ${detail}`);
    }
    return `storage://${filePath}`;
  }

  async createSignedDocumentUrl(storageReference: string): Promise<string> {
    const filePath = storageReference.slice('storage://'.length);
    if (!/^[a-f0-9-]{36}\/[a-f0-9-]{36}\.(pdf|doc|docx|jpg|jpeg|png)$/i.test(filePath)) {
      throw new Error('Invalid private document reference.');
    }
    const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
    const res = await fetch(
      `${this.storageBaseUrl}/object/sign/${encodeURIComponent(this.documentsBucket)}/${encodedPath}`,
      {
        method: 'POST',
        headers: { ...this.serviceHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresIn: 60 * 60 }),
      },
    );
    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`Supabase document signing failed: ${detail}`);
    }
    const data = await res.json() as { signedURL?: string };
    if (!data.signedURL) {
      throw new Error('Supabase returned no signed document URL.');
    }
    return data.signedURL.startsWith('http')
      ? data.signedURL
      : `${this.storageBaseUrl}${data.signedURL}`;
  }

  async removeDocumentFile(storageReference: string): Promise<void> {
    if (!storageReference.startsWith('storage://')) return;
    const filePath = storageReference.slice('storage://'.length);
    if (!/^[a-f0-9-]{36}\/[a-f0-9-]{36}\.(pdf|doc|docx|jpg|jpeg|png)$/i.test(filePath)) return;
    const res = await fetch(`${this.storageBaseUrl}/object/${encodeURIComponent(this.documentsBucket)}`, {
      method: 'DELETE',
      headers: { ...this.serviceHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefixes: [filePath] }),
    });
    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`Supabase document delete failed: ${detail}`);
    }
  }
}
