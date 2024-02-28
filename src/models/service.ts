import { Thing } from "./common";

interface AuthDetails {
    method: string;
    required_headers: string[];
}

interface RateLimiting {
    requests: number;
    interval: string;
}

interface ContactInfo {
    team: string;
    email: string;
}

interface SLADetails {
    uptime_percentage: number;
    response_time_ms: number;
}

interface SecurityRequirements {
    protocols: string[];
    compliance_standards: string[];
}

interface CachingPolicy {
    enabled: boolean;
    duration: string;
}

interface DeploymentInfo {
    platform: string;
    container_info?: string;
}

interface ErrorHandling {
    status_codes: number[];
    custom_payloads?: string[];
}

interface Metadata {
    key: string;
    value: string;
}

export interface ApiService {
    id: Thing;
    api_name: string;
    forward_url: string;
    active: boolean;
    version: string;
    gateway_scopes: string[];
    contact_info: ContactInfo;
    environment: string;
    created_date?: string;
    last_modified_date?: string;
    auth_details?: AuthDetails;
    rate_limiting?: RateLimiting;
    health_check_url?: string;
    documentation_url?: string;
    sla?: SLADetails;
    security_requirements?: SecurityRequirements;
    data_formats?: string[];
    ip_whitelist?: string[];
    ip_blacklist?: string[];
    caching_policy?: CachingPolicy;
    load_balancing_strategy?: string;
    custom_headers?: string[];
    dependencies?: string[];
    deployment_info?: DeploymentInfo;
    error_handling?: ErrorHandling;
    metadata?: Metadata[];
}

export interface PartialApiServiceUpdate {
    id?: string;
    api_name?: string;
    forward_url?: string;
    active?: boolean;
    version?: string;
    auth_details?: AuthDetails;
    rate_limiting?: RateLimiting;
    health_check_url?: string;
    documentation_url?: string;
    contact_info?: ContactInfo;
    sla?: SLADetails;
    security_requirements?: SecurityRequirements;
    data_formats?: string[];
    ip_whitelist?: string[];
    ip_blacklist?: string[];
    caching_policy?: CachingPolicy;
    load_balancing_strategy?: string;
    custom_headers?: string[];
    dependencies?: string[];
    environment?: string;
    deployment_info?: DeploymentInfo;
    error_handling?: ErrorHandling;
    metadata?: Metadata[];
}