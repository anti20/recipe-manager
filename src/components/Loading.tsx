import React from "react";

export default function Loading() {
    return (
        <div className="loading" role="status" aria-live="polite" aria-busy="true">
            <div className="loading__spinner" aria-hidden="true" />
            <div>
                <p className="loading__title">Loading</p>
                <p className="loading__text">Please wait a moment.</p>
            </div>
        </div>
    );
}
