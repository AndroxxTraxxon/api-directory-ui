import { Thing } from "./common"

export type GatewayUser = {
    id: Thing,
    username: string,
    scopes: Array<string>,
    created_date: string,
    last_modified_date: string,
    last_login: string,
    password_reset_at: string
}