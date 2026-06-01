import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseStorageService {
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.supabaseUrl = this.config.get<string>('SUPABASE_URL')!;
    this.serviceRoleKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY')!;
    this.bucket = this.config.get<string>('SUPABASE_STORAGE_BUCKET')!;
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
}
