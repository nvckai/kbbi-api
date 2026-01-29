// Minimal Vercel request/response types to avoid external type dependency
export interface VercelRequest {
  query: Record<string, string | string[]>;
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: unknown;
}

export interface VercelResponse {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => VercelResponse;
  json: (body: unknown) => VercelResponse;
  end: () => void;
}

export type NextHandler = (req: VercelRequest, res: VercelResponse) => Promise<void> | void;
