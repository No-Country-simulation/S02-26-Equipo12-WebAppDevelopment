export interface LoginResponse {
  message: string;
  result: Result;
}

export interface Result {
  rider: Rider;
  token: string;
}

export interface Rider {
  id: string;
  name: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
