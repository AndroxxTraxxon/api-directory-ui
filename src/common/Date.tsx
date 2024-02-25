import React from 'react';

interface DisplayProps {
    value?: string | null,
    placeholder?: string
}

export function DateDisplay ({value, placeholder = "Never"}: DisplayProps) {
    if (value){
        return new Date(value).toLocaleString();
    }
    return placeholder;
}