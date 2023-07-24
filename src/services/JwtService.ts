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
    EmploymentDate: string,
    Status: string,
    Permissions: string,
    HasPassword: boolean,
    hasValidSetPasswordLink: boolean,
    exp: number
}
export function GetTokenPayload(token: string | null): TokenPayload | null {
    if (token === null) {
        return null;
    }
    return JSON.parse(atob(token.split('.')[1]));
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
        employmentDate: payload.EmploymentDate,
        status: payload.Status,
        permissions: payload.Permissions,
        hasValidSetPasswordLink: payload.HasPassword,
        hasPassword: payload.HasPassword
    };
}

export function IsTokenExpiredInMinute(token: string | null): boolean {
    if (token) {
        let tokenPayload = GetTokenPayload(token);
        return !!(tokenPayload && tokenPayload.exp < (Date.now() + 60000) / 1000);
    } else {
        return false;
    }
}

export function FetchUserFromToken() {
    let token = GetAccessToken();
    if (token === null) {
        return null;
    }
    return GetUserFromToken(token);
}