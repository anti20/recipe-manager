import React from "react";
import { Link } from "react-router-dom";

export default function HomeButton() {
    return (
        <nav className="home-button">
            <Link to="/" className="button button--secondary">
                Back to recipes
            </Link>
        </nav>
    );
}
