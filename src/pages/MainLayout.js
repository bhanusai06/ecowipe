import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import { ToastContainer } from '../components/common/Toast';

const MainLayout = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1 pt-16">
                <Outlet />
            </main>
            <Footer />
            <ToastContainer />
        </div>
    );
};

export default MainLayout;
