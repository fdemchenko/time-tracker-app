import User from "../models/User";

export function SetAccessToken(accessToken: string) {
    localStorage.setItem("accessToken", accessToken);
}
export function GetAccessToken(): string | null {
    return localStorage.getItem("accessToken");
}
export function RemoveAccessToken() {
    localStorage.removeItem("accessToken");
}

export interface TokenPayload {
    Id: string,
    Email: string,
    FullName: string
    EmploymentRate: string,
    Status: string,
    Permissions: string,
    exp: number
}
export function GetTokenPayload(token: string | null): TokenPayload | null {
    if (token === null) {
        return null;
    }
    let tokenPayload: TokenPayload = JSON.parse(atob(token.split('.')[1]));
    if (tokenPayload.exp < Date.now() / 1000) {
        localStorage.removeItem("accessToken");
        return null;
    }
    return tokenPayload;
}

export function GetUserFromToken(token: string): User | null {
    let payload = GetTokenPayload(token);
    if (payload === null) {
        return null;
    }
    return {
        id: payload.Id,
        email: payload.Email,
        fullName: payload.FullName,
        employmentRate: Number(payload.EmploymentRate),
        status: payload.Status,
        permissions: payload.Permissions
    };
}