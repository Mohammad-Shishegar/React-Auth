export interface Session {
  id: string;
  userId: string;

  accessToken: string;
  refreshToken: string;

  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;

  revoked: boolean;
}

export const sessions: Session[] = [];
