import React from "react";

export default function ErrorView({ message, style }: { message: string; style?: React.CSSProperties }) {
    return (
        <div className="error-view" style={style}>
            <div className="error-view__card">
                <div className="error-view__icon">!</div>
                <p>{message}</p>
            </div>
        </div>
    );
}
