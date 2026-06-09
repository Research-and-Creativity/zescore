export interface User {
  id: string;
  name: string;
  role: "admin" | "participant";
  email?: string;
}

export interface Team {
  id: string;
  name: string;
  standNumber: number;
  memberCount?: number;
  totalScore?: number;
  voteCount?: number;
}

export interface ScoreCategory {
  innovation: number;
  presentation: number;
  technical: number;
}

export interface ScoreEntry {
  id: string;
  teamId: string;
  teamName: string;
  standNumber: number;
  judgeNidn?: string;
  studentNim?: string;
  type: "dosen" | "mahasiswa";
  scores?: ScoreCategory;
  votedAt: string;
}

export interface DashboardStats {
  totalTeams: number;
  totalVotes: number;
  totalJudges: number;
  averageScore: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
