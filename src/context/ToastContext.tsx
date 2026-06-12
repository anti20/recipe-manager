import React from "react";

type ToastContextValue = {
    showToast: (message: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [message, setMessage] = React.useState<string | null>(null);
    const timeoutId = React.useRef<number | undefined>(undefined);

    function showToast(message: string) {
        setMessage(message);

        if (timeoutId.current) {
            window.clearTimeout(timeoutId.current);
        }

        timeoutId.current = window.setTimeout(() => {
            setMessage(null);
        }, 1500);
    }

    React.useEffect(() => {
        return () => {
            if (timeoutId.current) {
                window.clearTimeout(timeoutId.current);
            }
        };
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {message && <p className="toast toast--success">{message}</p>}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = React.useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used inside ToastProvider");
    }

    return context;
}
