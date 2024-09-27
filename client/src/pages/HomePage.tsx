// src/pages/HomePage.tsx
import React from 'react';
import {useNavigate} from "react-router-dom";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const goToAdminPage = () => {
        navigate('/admin');
    };

    const goToOrderPage = () => {
        navigate('/orders');
    };

    return (
        <div>
            <h1>Home Page</h1>
            <button onClick={goToAdminPage}>Admin Page</button>
            <button onClick={goToOrderPage}>Order Page</button>
        </div>
    );
};

export default HomePage;