export interface UserType {
  user_id: number;
  username: string;
  email: string | null;
  password: string | null;
  profile_picture: string | null;
  date_registered: Date;
}
