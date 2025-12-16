import React from 'react';
import {create} from 'zustand';

const UseStore =create((set)=>(
    {
        wellnessData:[],
        setWellnessData:(data)=>set({wellnessData:data})
    }
))

export default UseStore;