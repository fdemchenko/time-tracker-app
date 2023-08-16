export interface Vacation {
    id: string,
    userId: string,
    start: string,
    end: string,
    comment: string | null,
    isApproved: boolean,
    approverId: string,
    approverComment: string | null
}