import {api} from "@/shared/lib/axios";

export const userApi = {
    register: (data: {email: string; password: string; name: string;}) =>
        api.post("auth/register", data),

    login: (data: {email: string; password: string; name: string;}) =>
        api.post("auth/login", data),
}