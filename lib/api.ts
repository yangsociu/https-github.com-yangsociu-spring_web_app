import type { LoginRequest, RegisterRequest, AuthResponse, User, Game, GameApprovalRequest, ApprovalRequest } from "./types";

const API_BASE_URL = "http://localhost:8080/api/v1";

async function getAuthToken(): Promise<string | null> {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user: AuthResponse = JSON.parse(userStr);
      return user.token;
    }
  } catch (e) {
    console.error("Could not parse user from localStorage", e);
  }
  return null;
}

async function fetchWrapper(url: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    (headers as any)["Content-Type"] = "application/json";
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "An unknown error occurred" }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  if (response.headers.get("content-type")?.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

// Auth
export const registerUser = (data: RegisterRequest): Promise<AuthResponse> => {
  return fetchWrapper(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const loginUser = (data: LoginRequest): Promise<AuthResponse> => {
  return fetchWrapper(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Admin
export const getPendingUsers = (): Promise<User[]> => {
  return fetchWrapper(`${API_BASE_URL}/admin/pending`);
};

export const approveUser = (userId: number, status: "APPROVED" | "REJECTED"): Promise<string> => {
  const payload: ApprovalRequest = { userId, status };
  return fetchWrapper(`${API_BASE_URL}/admin/approve`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getPendingGames = (): Promise<Game[]> => {
  return fetchWrapper(`${API_BASE_URL}/admin/games/pending`);
};

export const approveGame = (gameId: number, status: "APPROVED" | "REJECTED"): Promise<string> => {
  const payload: GameApprovalRequest = { gameId, status };
  return fetchWrapper(`${API_BASE_URL}/admin/game-approve`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const getAdminAllUsers = (): Promise<User[]> => {
  return fetchWrapper(`${API_BASE_URL}/admin/users/all`);
};

export const getAdminAllGames = (): Promise<Game[]> => {
  return fetchWrapper(`${API_BASE_URL}/admin/games/all`);
};


// Games
export const getPublicGames = (): Promise<Game[]> => {
  return fetchWrapper(`${API_BASE_URL}/games/public`);
};

// New function to get a single game
export const getGameById = (id: number): Promise<Game> => {
  return fetchWrapper(`${API_BASE_URL}/games/${id}`);
}

export const createGame = (data: FormData): Promise<Game> => {
  return fetchWrapper(`${API_BASE_URL}/games/create`, {
    method: "POST",
    body: data,
  });
};

export const getMyGames = (): Promise<Game[]> => {
  return fetchWrapper(`${API_BASE_URL}/games/my-games`);
};
