import React from 'react';
import Sidebar from '../../components/Header/Sidebar/Sidebar';
import { Outlet } from 'react-router';
import Background from '../../components/Background/Background';

const Root_2 = () => {
    return (
        <div>
            <Background />
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 ml-64 p-6">
                    <Outlet />
                </div>
            </div>


        </div>
    );
};

export default Root_2;