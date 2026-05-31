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

  async upload(
    file: Express.Multer.File,
    fileName: string,
    folder?: string,
  ): Promise<string> {
    const filePath = folder ? `${folder}/${fileName}` : fileName;

      const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype });
      const res = await fetch(
      `${this.supabaseUrl}/storage/v1/object/${this.bucket}/${filePath}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.serviceRoleKey}`,
          'Content-Type': file.mimetype,
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
