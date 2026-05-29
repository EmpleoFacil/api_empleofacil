export interface AuthUser {
  id: string;
  role: string;
  companyId?: string | null;
  candidateId?: string | null;
}
