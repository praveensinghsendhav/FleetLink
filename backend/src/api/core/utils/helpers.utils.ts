
import { IResponseHandler } from "../../core/types/interfaces";

class Helpers {

    static responseHandler(status: number, message: string, data?: unknown, error?: string): IResponseHandler {
        return {
            status,
            message,
            data,
            error,
        };
    }
}

export default Helpers 