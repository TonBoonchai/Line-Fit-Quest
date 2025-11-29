import ApiService from "../services/api.service";

export interface Battle {
  id: number;
  creatorId: number;
  inviteCode: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

export interface BattleRanking {
  userId: number;
  lineUserId: string;
  displayName: string;
  pictureUrl?: string;
  startingExp: number;
  currentExp: number;
  expGained: number;
}

export async function createBattleApi(lineUserId: string): Promise<Battle> {
  const response = await ApiService.post(`/battles/create/${lineUserId}`);
  return response.data.battle;
}

export async function joinBattleApi(
  inviteCode: string,
  lineUserId: string
): Promise<Battle> {
  const response = await ApiService.post(`/battles/join/${inviteCode}`, {
    lineUserId,
  });
  return response.data.battle;
}

export async function getActiveBattleApi(
  lineUserId: string
): Promise<Battle | null> {
  const response = await ApiService.get(`/battles/active/${lineUserId}`);
  return response.data.battle;
}

export async function getBattleRankingsApi(
  battleId: number
): Promise<BattleRanking[]> {
  const response = await ApiService.get(`/battles/rankings/${battleId}`);
  return response.data.rankings;
}

export async function leaveBattleApi(
  lineUserId: string,
  battleId: number
): Promise<{ success: boolean }> {
  const response = await ApiService.post(
    `/battles/leave/${lineUserId}/${battleId}`
  );
  return response.data;
}
