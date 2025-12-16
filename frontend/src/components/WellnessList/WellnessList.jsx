import React from 'react';
import UseStore from '../../store/UseStore';
import { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import Background from '../Background/Background';

const WellnessList = () => {
    const { wellnessData } = UseStore();
    const [items, setItems] = useState(wellnessData?.items || []);
    console.log(items);

    const toggleItem = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };


    const completedCount = items.filter(item => item.completed).length;
    const totalCount = items.length;

    return (
        <div className="min-h-screen  p-8 ">
            <div className="w-120 max-w-2xl">
               
                <div className="bg-white rounded-2xl shadow-2xl  overflow-hidden mt-20">
                   
                    {/* Header */}
                    <div className="bg-linear-to-r from-purple-400 to-pink-200 p-8 text-white max-h-40 ">
                        <h1 className="text-2xl font-bold mb-2">My Checklist</h1>
                        <p className="text-purple-100 text-md">

                            {completedCount} of {totalCount} completed

                        </p>
                        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${totalCount ? (completedCount / totalCount) * 100 : 0}%` }}
                            />
                        </div>
                    </div>


                    <div className="p-6 space-y-3">
                        {items.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-lg">No tasks yet.</p>
                            </div>
                        ) : (
                            items.map(item => (
                                <div
                                    key={item.id}
                                    className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all"
                                >
                                    <button
                                        onClick={() => toggleItem(item.id)}
                                        className={`shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${item.completed
                                                ? 'bg-linear-to-r from-purple-500 to-pink-500 border-transparent'
                                                : 'border-gray-300 hover:border-purple-400'
                                            }`}
                                    >
                                        {item.completed && <Check size={16} className="text-white" strokeWidth={3} />}
                                    </button>

                                    <span
                                        className={`flex-1 transition-all ${item.completed
                                                ? 'text-gray-400 line-through'
                                                : 'text-green-900'
                                            }`}
                                    >
                                        {item.task}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer Message */}
                {completedCount === totalCount && totalCount > 0 && (
                    <div className="mt-6 text-center">
                        <p className="text-purple-600 text-lg font-medium animate-pulse">
                            🎉 Great job! All tasks completed!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WellnessList;
