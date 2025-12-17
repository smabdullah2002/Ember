import React from 'react';
import PillNav from './PillNav';
import { Link } from 'react-router';

const Navbar = () => {

    return (
        <div className="w-full fixed  backdrop-blur-xl  shadow-lg min-h-18 top-0 left-0 z-50 ">
            <div className="w-full flex justify-center items-center py-4 z-30">
                <div className='absolute top-0 left-0 flex items-center p-3'>
                    <Link to="/">
                        <h1 className='text-white font-bold text-2xl font-serif'>Bliss</h1>
                    </Link>
                </div>

                <PillNav
                    items={[
                        // {label: 'Bliss', href: '/' , isLogo: true},
                        { label: 'Home', href: '/' },
                        { label: 'Why use ?', href: '#why-use' },
                        { label: 'Faq', href: '#faq' },
                        
                        // { label: 'Feed', href: '/feed' }
                    ]}
                    activeHref="/"
                    className="custom-nav"
                    ease="power2.easeOut"
                    baseColor="transparent"
                    pillColor="#FFFFFF"
                    hoveredPillTextColor="#000000"
                    pillTextColor="#000000"
                />

                <div className='flex flex-row last:mr-5 absolute right-0 top-0 mt-3 mr-3'>
                    <Link to="/registration">
                        <button className='btn btn-soft py-4 px-4 text-xl font-mono'>
                            Signup
                        </button>

                    </Link>

                    <Link to="/login" className="ml-4">
                        <button className='btn btn-soft py-4 px-6 text-xl font-mono'>
                            Login
                        </button>

                    </Link>
                </div>

            </div>



        </div>



    );
};

export default Navbar;