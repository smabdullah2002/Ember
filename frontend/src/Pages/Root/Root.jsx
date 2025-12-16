import React from 'react';
import Navbar from '../../components/Header/Navbar/Navbar';
import { Outlet } from 'react-router';
import Background from '../../components/Background/Background';


const Root = () => {
    return (
        <div>
            <Background />
            <Navbar/>
            <Outlet />
        </div>
    );
};

export default Root;