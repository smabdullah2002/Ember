import React from 'react';
import { Link } from 'react-router';

const Join = () => {
    return (

        <div className="min-h-[50vh]">
            <div className="relative flex items-center justify-center mt-20 mb-20">
                <img
                    src="bg_2.avif"
                    alt=""
                    className="w-[100vh] h-[50vh] object-cover rounded-2xl"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-2xl text-white font-semibold">
                        Begin your journey to better mental health with Ember today.
                    </h1>
                 <Link  to="/registration">
                  <button className="mt-15 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-md font-semibold text-lg transition">
                            Join Now
                    </button>
                 </Link>
                       
                
            </div>
        </div>
        </div >

    );
};

export default Join;