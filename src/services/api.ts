import axios from 'axios';

export const BASE_URL = "https://demo-polymer.meusalt.com.br/api";

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interface para usuários
export interface User {
    id: number;
    name: string;
}

// Cache para lista de usuários
let usersCache: User[] | null = null;

// Função para obter usuários da API
export const getUsers = async (): Promise<User[]> => {
    try {
        // Se já temos os usuários em cache, retorna-os
        if (usersCache && usersCache.length > 0) {
            return usersCache;
        }

        // Caso contrário, busca da API
        const response = await api.get<User[]>("/barcode-labels/users");
        usersCache = response.data;
        return usersCache;
    } catch (error: any) {
        console.error("Erro ao buscar usuários:", error);
        return [];
    }
};

export interface RecognizeResponse {
    message: string;
    data?: {
        barcode_label: {
            etiqueta: string;
            status: string;
            material?: string;
            descricaoMaterial?: string;
            op?: string;
            qm?: string;
            qtde?: string;
            positionId?: string;
            endereco?: string;
            descricaoEndereco?: string;
            location?: string;
        };
        recognition: any;
    };
    errors?: Record<string, string[]>;
}

export interface RecognizeRequest {
    user_id: number;
    position_id: number;
    recognition_type: 1 | 2 | 3; // 1=entrada, 2=saída, 3=movimentação
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
        return {
            message: "Erro de conexão com o servidor"
        };
    }
};