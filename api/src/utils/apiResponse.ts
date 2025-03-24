interface IApiResponse {
    success: boolean;
    message: string;
    data: object;
};

export class ApiResponse {
    static success(message: string, data: object): IApiResponse {
        return {
            success: true,
            message,
            data,
        };
    }

    static error(message: string, data: object): IApiResponse {
        return {
            success: false,
            message,
            data,
        };
    }
};