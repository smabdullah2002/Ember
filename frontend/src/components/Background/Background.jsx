import React from 'react';
import Prism from './Prism';
import { Link } from 'react-router';

const Background = () => {
    return (
        <div style={{ width: '100%', height: '100vh', position: 'fixed' }} className=' inset-0 -z-10'>
            <Prism
                animationType="rotate"
                timeScale={0.4}
                height={3.5}
                baseWidth={5.5}
                scale={3}
                hueShift={0}
                colorFrequency={1}
                noise={0}
                glow={0.7}
            />
        </div>
    );
};

export default Background;