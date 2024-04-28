export class AuthLoginDto {
  email: string;
  password: string;
}

export class AuthRegisterDto {
  email: string;
  password: string;
  fullName: string;
  community_code: string;
}
