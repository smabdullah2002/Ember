import React, { useState } from 'react';
import { Play, Maximize2 } from 'lucide-react';

const VideoCard = ({ title, description, videoUrl, color }) => {
    const [isHovered, setIsHovered] = useState(false);

    const gradientClass = {
        purple: 'from-purple-400 via-pink-400 to-indigo-400',
        blue: 'from-blue-400 via-cyan-400 to-teal-400',
        green: 'from-green-400 via-emerald-400 to-teal-400',
    }[color];

    const borderClass = {
        purple: 'border-purple-200',
        blue: 'border-blue-200',
        green: 'border-green-200',
    }[color];

    const textClass = {
        purple: 'text-purple-600',
        blue: 'text-blue-600',
        green: 'text-green-600',
    }[color];

    const bgGradient = {
        purple: 'from-purple-50 to-pink-50',
        blue: 'from-blue-50 to-cyan-50',
        green: 'from-green-50 to-emerald-50',
    }[color];

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glow effect on hover */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${gradientClass} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>

            <div className={`relative bg-gradient-to-br ${bgGradient} rounded-3xl shadow-xl border ${borderClass} overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]`}>
                {/* Video Container */}
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                    <iframe
                        src={videoUrl}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>

                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Title with icon */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <h3 className={`text-2xl font-light ${textClass} mb-2 transition-colors duration-300`}>
                                {title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {description}
                            </p>
                        </div>

                        {/* Decorative icon */}
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-md opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110`}>
                            <Play className="w-6 h-6 text-white ml-0.5" />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className={`h-px bg-gradient-to-r ${gradientClass} opacity-20 my-4`}></div>

                    {/* Stats or additional info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradientClass}`}></div>
                            Relaxation
                        </span>
                        <span className="flex items-center gap-1">
                            <Maximize2 className="w-3 h-3" />
                            Fullscreen available
                        </span>
                    </div>
                </div>

                {/* Bottom gradient accent */}
                <div className={`h-1 bg-gradient-to-r ${gradientClass}`}></div>
            </div>
        </div>
    );
};

export default function SoothingVideoCards() {
    const videos = [
        {
            title: "5-Minute Meditation You Can Do Anywhere",
            videoUrl: "https://www.youtube.com/embed/inpok4MKVLM",
            color: "blue"
        },
        {
            title: "Feeling Full of Gratitude 10 Minute Guided Meditation",
            videoUrl: "https://www.youtube.com/embed/Od4uCoLe-ac",
            color: "purple"
        },
        {
            title: "Mystical Forest Serenity - Spiritual Healing Music",
            videoUrl: "https://www.youtube.com/embed/vbzlcSjNxqs?list=RDvbzlcSjNxqs",
            color: "green"
        }
    ];

    return (
        <div className="backdrop-blur-md bg-white/70 rounded-3xl shadow-2xl p-8 border border-purple-200/50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-4">
                        Peaceful Moments
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover tranquility through curated videos designed to calm your mind and soothe your soul
                    </p>
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {videos.map((video, index) => (
                        <VideoCard
                            key={index}
                            title={video.title}
                            description={video.description}
                            videoUrl={video.videoUrl}
                            color={video.color}
                        />
                    ))}
                </div>

                {/* Bottom decoration */}
                <div className="mt-16 flex justify-center">
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}