export default interface User {
    id: string,
    email: string,
    fullName: string
    employmentRate: number,
    employmentDate: string,
    status: string,
    permissions: string,
    hasPassword: boolean,
    hasValidSetPasswordLink: boolean,
}