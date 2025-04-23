import axios from 'axios';

const BASE_URL = 'https://demo-polymer.meusalt.com.br/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface RecognizeResponse {
    message: string;
    data?: {
        barcode_label: {
            etiqueta: string;
            status: string;
        };
        recognition: any;
    };
    errors?: Record<string, string[]>;
}

export interface RecognizeRequest {
    user_id: number;
    position_id: number;
    recognition_type: 1 | 2 | 3;
}

export const recognizeBarcode = async (
    barcode: string,
    data: RecognizeRequest
): Promise<RecognizeResponse> => {
    try {
        const response = await api.post<RecognizeResponse>(
            `/barcode-labels/${barcode}/recognize`,
            data
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        }
        throw error;
    }
};

export default api;