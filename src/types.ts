export type UserFromToken = {
  sub?: string;
  given_name?: string;
  email?: string;
  nickname?: string;
  name?: string;
  picture?: string;
  updated_at?: string[];
  email_verified?: number;
};

export type User = {
  id: string;
  no: number;
  email: string;
  email_verified: boolean;
  name: string;
  username?: string;
  given_name?: string;
  family_name?: string;
  gender: "male" | "female";
  ic_number?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  nickname?: string;
  avatar_url?: string;
  address?: {
    line_1?: string;
    line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  date_of_birth?: Date;
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
};

export type MaybeShadowUser = User & {
  shadow: boolean;
  pastoral_status: string | null;
};
