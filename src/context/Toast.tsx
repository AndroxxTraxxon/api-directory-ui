import React, { createContext, useContext, useState, useCallback, useReducer } from 'react';
import './Toast.css';

const defaultMessageDuration = 3000; // milliseconds
const AUTO_DISMISS_MODES = ["dismissible", "pester"];
const CLOSEABLE_MODES = ["dismissible", "sticky"];

interface PartialToastMessage {
    title: string,
    message: string,
    variant?: "info" | "warning" | "error" | "success",
    mode?: "dismissible" | "pester" | "sticky"
}

interface ToastMessage extends PartialToastMessage {
    variant: "info" | "warning" | "error" | "success",
    mode: "dismissible" | "pester" | "sticky"
}

interface PostedToastMessage extends ToastMessage {
    id: number
}

interface IToastContext {
    publish(message: PartialToastMessage): void,
    retire(id: number): void
}

const ToastContext = createContext<IToastContext>({
    publish: (_) => undefined,
    retire: (_) => undefined
});

export function useToast() { return useContext(ToastContext); }

interface _ToastContainerProps {
    toasts: Array<PostedToastMessage>,
    removeToast(id: number): void
}

const ToastContainer = ({ toasts, removeToast }: _ToastContainerProps) => (
    <div className="toast-container">
        {toasts.map((toast) => (
            <div key={toast.id} className={`toast ${toast.variant}`}>
                {toast.message}
                {CLOSEABLE_MODES.includes(toast.mode) && <button onClick={() => removeToast(toast.id)}>Close</button>}
            </div>
        ))}
    </div>
);

interface IToastEvent{
    kind: "publish" | "retire",
}

interface IToastPublishEvent extends IToastEvent {
    kind: "publish",
    toast: PostedToastMessage
}

interface IToastRetireEvent extends IToastEvent {
    kind: "retire",
    id: number
}

type ToastEvent = IToastPublishEvent | IToastRetireEvent

function handleToastEvent(state: Array<PostedToastMessage>, action: ToastEvent){
    switch (action.kind) {
        case "publish":
            return [...state, action.toast];
        case "retire":
            return state.filter((toast) => toast.id !== action.id);
        default:
            return state;
    }
}

export function ToastProvider({ children }) {
    const [toasts, dispatchToastEvent] = useReducer(handleToastEvent, []);

    function retire(id: number){
        dispatchToastEvent({kind: "retire", id});
    }

    function publish({ title, message, mode = 'dismissible', variant = 'info' }: PartialToastMessage) {
        const toast: PostedToastMessage = { id: Date.now(), title, message, mode, variant };
        dispatchToastEvent({kind: "publish", toast})
        if (AUTO_DISMISS_MODES.includes(mode)) {
            setTimeout(() => {
                retire(toast.id);
            }, defaultMessageDuration);
        }
    }

    return (
        <ToastContext.Provider value={{ publish, retire }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={retire} />
        </ToastContext.Provider>
    );
};
