export interface Admin {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
    updated_at: string;
}

export interface InviteAdminData {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
}