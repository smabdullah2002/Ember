import React from 'react';
import Prism from './Prism';
import { Link } from 'react-router';

const Background = () => {
    return (
        <div style={{ width: '100%', height: '100vh', position: 'fixed' }} className=' inset-0 -z-10'>
            <Prism
                animationType="waves"
                timeScale={0.5}
                height={3}
                baseWidth={5}
                scale={2}
                hueShift={1}
                colorFrequency={2}
                noise={0}
                glow={1}
                // opacity={0}
            />
        </div>
    );
};

export default Background;