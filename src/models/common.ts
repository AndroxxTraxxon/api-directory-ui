export interface ApiRole {
    id?: string,
    namespace: string,
    name: string,
}

export interface StoredApiRole extends ApiRole{
    id: string,
    created_date: string,
    last_modified_date: string
}

export interface ApiService {
    api_name: string,
    version: string,
    forward_url: string,
    active: boolean,
    role_namespaces: string[],
    roles: ApiRole[],
    environment: string,
}

export interface PartialApiServiceUpdate {
    api_name?: string,
    version?: string,
    forward_url?: string,
    active?: boolean,
    role_namespaces?: string[],
    roles?: ApiRole[]
}

export interface StoredApiService extends ApiService {
    id: string,
    created_date: string,
    last_modified_date: string,
}

export type GatewayUser = {
    id: string,
    username: string,
    roles: Array<ApiRole>,
    created_date: string,
    last_modified_date: string,
    last_login: string,
    password_reset_at: string
}

export interface OptionEntry {
    label: string,
    value: string
}