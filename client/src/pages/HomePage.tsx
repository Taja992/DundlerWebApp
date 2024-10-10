// src/pages/HomePage.tsx
import {useNavigate} from "react-router-dom";
import React from "react";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const goToAdminPage = () => {
        navigate('/admin');
    };

    const goToOrderPage = () => {
        navigate('/customer');
    };

    return (
        <div>
            <h1>Home Page</h1>
            <div className="space-x-3">
            <button onClick={goToAdminPage}>Admin Page</button>
            <button onClick={goToOrderPage}>Customer Page</button>
            </div>
        </div>
    );
};

export default HomePage;