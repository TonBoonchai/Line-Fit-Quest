import ApiService from "../services/api.service";

export interface User {
  id: number;
  lineUserId: string;
  displayName: string;
  pictureUrl?: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  health: number;
  energy: number;
  exp: number;
  rank: number;
  nextLevelExp: number;
}

export async function initUserApi(
  lineUserId: string,
  displayName: string,
  pictureUrl?: string
): Promise<User> {
  const response = await ApiService.post("/users/init", {
    lineUserId,
    displayName,
    pictureUrl,
  });
  return response.data.user;
}

export async function getUserApi(lineUserId: string): Promise<User> {
  const response = await ApiService.get(`/users/${lineUserId}`);
  return response.data.user;
}
