
export interface IResponseHandler {
    status: number;
    message: string;
    data?: unknown;
    error?: string;
}

