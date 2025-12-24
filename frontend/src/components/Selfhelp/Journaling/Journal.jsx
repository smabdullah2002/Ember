import React from 'react';
import { BookOpen, PenLine, Sparkles, Calendar, X } from 'lucide-react';

const Journal = () => {
    const [entries, setEntries] = React.useState([]);
    const [newEntry, setNewEntry] = React.useState('');
    const [newTitle, setNewTitle] = React.useState([]);
    const [title, setTitle] = React.useState('');
    const [selectedEntry, setSelectedEntry] = React.useState(null);
    const [showModal, setShowModal] = React.useState(false);
    
    const getCurrentDate = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };
    
    return (
        <div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8'>
            <div className='max-w-7xl mx-auto'>
                {/* Header */}
                <div className='text-center mb-10'>
                    <div className='flex items-center justify-center gap-3 mb-3'>
                        <div className='w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center'>
                            <BookOpen className='w-6 h-6 text-white' />
                        </div>
                        <h1 className="text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            My Journal
                        </h1>
                    </div>
                    <p className="text-gray-600">Capture your thoughts, dreams, and reflections</p>
                </div>

                {/* Main Content */}
                <div className='flex flex-col lg:flex-row gap-8'>
                    {/* Entries Section */}
                    <div className='flex-1 w-1/2'>
                        <div className='backdrop-blur-md bg-white/70 rounded-3xl shadow-2xl border border-purple-200/50 p-8'>
                            <div className='flex items-center gap-3 mb-6'>
                                <Sparkles className='w-5 h-5 text-purple-600' />
                                <h2 className="text-2xl font-light text-gray-800">Your Entries</h2>
                            </div>

                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {entries.length === 0 ? (
                                    <div className='flex flex-col items-center justify-center py-16 text-center'>
                                        <div className='w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4'>
                                            <BookOpen className='w-10 h-10 text-purple-400' />
                                        </div>
                                        <p className="text-gray-500 mb-2">No entries yet</p>
                                        <p className="text-gray-400 text-sm">Start journaling to see your entries here</p>
                                    </div>
                                ) : (
                                    entries.map((entry, index) => (
                                        <div 
                                            key={index} 
                                            className="group relative animate-fade-in cursor-pointer"
                                            onClick={() => {
                                                setSelectedEntry({ entry, title: newTitle[index], index });
                                                setShowModal(true);
                                            }}
                                        >
                                            {/* Glow effect */}
                                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-10 blur transition-opacity duration-300"></div>
                                            
                                            <div className="relative bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-purple-100 transition-all duration-300 hover:shadow-lg">
                                                {/* Title and Date */}
                                                <div className='flex items-start justify-between mb-3'>
                                                    <h3 className='text-lg font-medium text-gray-800 flex-1'>
                                                        {newTitle[index] || 'Untitled Entry'}
                                                    </h3>
                                                    <div className='flex items-center gap-1 text-xs text-gray-500'>
                                                        <Calendar className='w-3 h-3' />
                                                        {getCurrentDate()}
                                                    </div>
                                                </div>
                                                
                                                {/* Divider */}
                                                <div className='h-px bg-gradient-to-r from-purple-200 via-pink-200 to-transparent mb-3'></div>
                                                
                                                {/* Entry Content - Truncated */}
                                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed line-clamp-3 break-words overflow-hidden">
                                                    {entry}
                                                </p>
                                                
                                                {/* Read more indicator */}
                                                {entry.length > 150 && (
                                                    <p className='text-purple-600 text-sm mt-2 font-medium'>
                                                        Click to read more...
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Write Section */}
                    <div className='flex-1 w-1/2'>
                        <div className='backdrop-blur-md bg-white/70 rounded-3xl shadow-2xl border border-purple-200/50 p-8 sticky top-8'>
                            <div className='flex items-center gap-3 mb-6'>
                                <PenLine className='w-5 h-5 text-purple-600' />
                                <h2 className="text-2xl font-light text-gray-800">New Entry</h2>
                            </div>

                            {/* Title Input */}
                            <div className='mb-4'>
                                <label className='text-sm text-gray-600 mb-2 block'>Entry Title</label>
                                <input
                                    type='text'
                                    className="w-full p-4 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                                    placeholder='Give your entry a title...'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {/* Entry Textarea */}
                            <div className='mb-6 '>
                                <label className='text-sm text-gray-600 mb-2 block'>Your Thoughts</label>
                                <textarea
                                    className="w-full h-64 p-4 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 placeholder-gray-400 custom-scrollbar"
                                    placeholder='What is on your mind today?'
                                    value={newEntry}
                                    onChange={(e) => setNewEntry(e.target.value)}
                                ></textarea>
                            </div>

                            {/* Add Button */}
                            <button
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-6 py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                disabled={newEntry.trim() === ''}
                                onClick={() => {
                                    if (newEntry.trim() !== '') {
                                        setEntries([newEntry, ...entries]);
                                        setNewTitle([title || 'Untitled Entry', ...newTitle]);
                                        setTitle('');
                                        setNewEntry('');
                                    }
                                }}
                            >
                                <PenLine className='w-5 h-5' />
                                Add Entry
                            </button>

                            {/* Entry count */}
                            <div className='mt-6 text-center'>
                                <p className='text-sm text-gray-500'>
                                    {entries.length} {entries.length === 1 ? 'entry' : 'entries'} saved
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for full entry view */}
            {showModal && selectedEntry && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
                    onClick={() => setShowModal(false)}
                >
                    <div 
                        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex items-center justify-between">
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center'>
                                    <BookOpen className='w-5 h-5 text-white' />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-light text-white">
                                        {selectedEntry.title || 'Untitled Entry'}
                                    </h3>
                                    <p className='text-white/80 text-sm flex items-center gap-1 mt-1'>
                                        <Calendar className='w-3 h-3' />
                                        {getCurrentDate()}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all duration-200"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto max-h-[calc(80vh-120px)] custom-scrollbar">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg break-words">
                                {selectedEntry.entry}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(243, 232, 255, 0.3);
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, rgb(192, 132, 252), rgb(244, 114, 182));
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, rgb(168, 85, 247), rgb(236, 72, 153));
                }
                
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default Journal;