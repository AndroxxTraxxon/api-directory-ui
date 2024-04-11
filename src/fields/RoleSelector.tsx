import React from "react";
import { Field } from "react-final-form"

import Select from "react-select";
import { StoredApiRole } from "../models/common";

interface RoleSelectorProps {
    name: string,
    roles: Array<StoredApiRole>
}

export function ReactSelectAdapter({ input, ...rest }) {
    return <Select {...input} {...rest} />
}

export default function RoleSelector({
    name, roles
}: RoleSelectorProps) {
    return <Field
        name={name}
        label="Roles"
        placeholder="No Roles Selected..."
        component={ReactSelectAdapter}
        options={roles.map(role => ({
            label: `${role.namespace}::${role.name}`,
            value: role.id
        }))}
        isMulti
        searchable

    />;
}

interface NamespaceSelectorProps {
    name: string,
    namespaces: Array<string>
}


export function NamespaceSelector({
    name, namespaces
}: NamespaceSelectorProps) {
    return <Field
        name={name}
        label="Role Namespaces"
        component={ReactSelectAdapter}
        options={namespaces.map(ns=>({label: ns, value: ns}))}
        isMulti
        searchable
    />;
}