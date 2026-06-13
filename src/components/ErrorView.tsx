import React from "react";

export default function ErrorView({ message }: { message: string }) {
    return (
        <div className="error-view">
            <div className="error-view__card">
                <div className="error-view__icon">!</div>
                <p>{message}</p>
            </div>
        </div>
    );
}
