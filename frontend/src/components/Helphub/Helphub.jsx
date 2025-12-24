import React, { useState } from 'react';
import { Phone, MapPin, Clock, Mail, Heart, Users, Building2, Stethoscope, MessageCircle, ExternalLink, Search } from 'lucide-react';

const MentalHealthHub = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const resources = [
        {
            id: 1,
            category: 'hospital',
            name: 'National Institute of Mental Health (NIMH)',
            location: 'Sher-e-Bangla Nagar, Dhaka',
            phone: '+8809118171',
            emergency: '999',
            hours: '24/7 Emergency',
            services: ['Emergency Care', 'Counseling', 'Psychiatric Treatment'],
            description: 'Government specialized mental health hospital providing comprehensive psychiatric care.'
        },
        {
            id: 2,
            category: 'hospital',
            name: 'Pinel Mental Health Care Center',
            location: 'House 7, Road 9A, Dhanmondi, Dhaka',
            phone: '+8801681006726',
            hours: '9:00 AM - 5:00 PM',
            services: ['Clinical Psychology', 'Child Psychology', 'Therapy'],
            description: 'Private mental health center with experienced psychologists and psychiatrists.'
        },
        {
            id: 3,
            category: 'hotline',
            name: 'Kaan Pete Roi (KPR)',
            phone: '+88 09612 119911',
            hours: '5:00 PM - 10:00 PM (Daily)',
            services: ['Emotional Support', 'Crisis Counseling', 'Anonymous'],
            description: 'Free emotional support helpline for anyone going through difficult times.',
            website: 'https://kaanpeteroi.org/'
        },
        {
            id: 5,
            category: 'ngo',
            name: 'Moner Bondhu',
            location: 'Dhaka, Bangladesh',
            phone: '01981-000920',
            hours: '10:00 AM - 8:00 PM',
            services: ['Mental Health Awareness', 'Support Groups', 'Counseling'],
            description: 'NGO working to reduce stigma around mental health in Bangladesh.',
            website: 'https://www.monerbondhu.org'
        },
        {
            id: 6,
            category: 'hospital',
            name: 'BRAC-KU Wellness Centre',
            location: 'BRAC University, Dhaka',
            phone: '01844-520616',
            email: 'wellnesscentre@bracu.ac.bd',
            hours: '9:00 AM - 5:00 PM (Weekdays)',
            services: ['Student Counseling', 'Mental Health Support', 'Workshops'],
            description: 'University-based mental health services for students and community.'
        },
        {
            id: 7,
            category: 'hospital',
            name: 'Sir Salimullah Medical College Hospital',
            location: 'Mitford, Dhaka',
            phone: ' +88010616 ',
            hours: 'OPD: 9:00 AM - 2:00 PM',
            services: ['Psychiatric Ward', 'Outpatient Services', 'Emergency Care'],
            description: 'Government medical college hospital with psychiatric department.'
        },
        {
            id: 10,
            category: 'hospital',
            name: 'Square Hospital Mental Health Department',
            location: '18/F, Bir Uttam Qazi Nuruzzaman Sarak, Dhaka',
            phone: '02-8159457',
            hours: '9:00 AM - 9:00 PM',
            services: ['Psychiatry', 'Clinical Psychology', 'Therapy Sessions'],
            description: 'Private hospital with dedicated mental health professionals.'
        }
    ];

    const categories = [
        { id: 'all', label: 'All Resources', icon: Heart },
        { id: 'hospital', label: 'Hospitals & Clinics', icon: Building2 },
        { id: 'hotline', label: 'Helplines', icon: Phone },
        { id: 'ngo', label: 'NGOs & Support', icon: Users }
    ];

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center animate-pulse">
                            <Heart className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 mb-3">
                        Mental Health Hub
                    </h1>
                    <p className="text-gray-600 text-lg mb-2">
                        Bangladesh Mental Health Resources & Support
                    </p>
                    <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                        You are not alone. Reach out to these resources for support, guidance, and care.
                    </p>
                </div>
                 <div className="mt-12 mb-10 text-center backdrop-blur-md bg-white/70 rounded-3xl shadow-xl border border-teal-200/50 p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Remember</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Seeking help is a sign of strength, not weakness. Mental health is just as important as physical health.
                        These resources are here to support you on your journey to wellness.
                    </p>
                    <div className="flex justify-center gap-2 mt-6">
                        <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>

                {/* Emergency Banner */}
                <div className="backdrop-blur-md bg-red-100/70 border border-red-300 rounded-2xl p-6 mb-8 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                            <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-red-800 mb-1">Emergency Support</h3>
                            <p className="text-red-700 text-sm mb-2">If you're in crisis, please reach out immediately:</p>
                            <div className="flex flex-wrap gap-4">
                                <a href="tel:999" className="text-red-900 font-bold text-lg hover:underline">
                                    📞 National Emergency: 999
                                </a>
                                <a href="tel:10999" className="text-red-900 font-bold text-lg hover:underline">
                                    📞 Mental Health Crisis: 10999
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="backdrop-blur-md bg-white/70 rounded-3xl shadow-xl border border-teal-200/50 p-6 mb-8">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, location, or service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all duration-300"
                        />
                    </div>

                    {/* Category Filters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 ${selectedCategory === cat.id
                                            ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg scale-105'
                                            : 'bg-white/50 text-gray-700 hover:bg-white/80 hover:shadow-md'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium text-sm">{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600 text-center">
                        Found <span className="font-semibold text-teal-600">{filteredResources.length}</span> resources
                    </p>
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredResources.map((resource) => (
                        <div
                            key={resource.id}
                            className="group relative animate-fade-in"
                        >
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>

                            <div className="relative backdrop-blur-md bg-white/80 rounded-3xl shadow-xl border border-teal-200/50 p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                                {/* Category Badge */}
                                <div className="absolute top-6 right-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${resource.category === 'hospital' ? 'bg-blue-100 text-blue-700' :
                                            resource.category === 'hotline' ? 'bg-green-100 text-green-700' :
                                                'bg-purple-100 text-purple-700'
                                        }`}>
                                        {resource.category === 'hospital' ? '🏥 Hospital' :
                                            resource.category === 'hotline' ? '📞 Helpline' : '🤝 NGO'}
                                    </span>
                                </div>

                                {/* Header */}
                                <h3 className="text-2xl font-semibold text-gray-800 mb-3 pr-24">
                                    {resource.name}
                                </h3>

                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {resource.description}
                                </p>

                                {/* Services */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {resource.services.map((service, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 text-xs rounded-full border border-teal-200"
                                        >
                                            {service}
                                        </span>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-teal-200 via-blue-200 to-transparent mb-4"></div>

                                {/* Contact Info */}
                                <div className="space-y-3">
                                    {resource.location && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700 text-sm">{resource.location}</span>
                                        </div>
                                    )}

                                    {resource.phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-teal-600 flex-shrink-0" />
                                            <a
                                                href={`tel:${resource.phone.replace(/[^0-9+]/g, '')}`}
                                                className="text-teal-700 font-semibold hover:text-teal-900 transition-colors"
                                            >
                                                {resource.phone}
                                            </a>
                                        </div>
                                    )}

                                    {resource.emergency && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-red-600 flex-shrink-0 animate-pulse" />
                                            <a
                                                href={`tel:${resource.emergency}`}
                                                className="text-red-700 font-bold hover:text-red-900 transition-colors"
                                            >
                                                Emergency: {resource.emergency}
                                            </a>
                                        </div>
                                    )}

                                    {resource.email && (
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-4 h-4 text-teal-600 flex-shrink-0" />
                                            <a
                                                href={`mailto:${resource.email}`}
                                                className="text-gray-700 hover:text-teal-700 transition-colors text-sm"
                                            >
                                                {resource.email}
                                            </a>
                                        </div>
                                    )}

                                    {resource.hours && (
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-teal-600 flex-shrink-0" />
                                            <span className="text-gray-700 text-sm">{resource.hours}</span>
                                        </div>
                                    )}

                                    {resource.website && (
                                        <div className="flex items-center gap-3">
                                            <ExternalLink className="w-4 h-4 text-teal-600 flex-shrink-0" />
                                            <a
                                                href={resource.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-teal-700 hover:text-teal-900 transition-colors text-sm hover:underline"
                                            >
                                                Visit Website
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredResources.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-600 text-lg mb-2">No resources found</p>
                        <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 text-center backdrop-blur-md bg-white/70 rounded-3xl shadow-xl border border-teal-200/50 p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Remember</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Seeking help is a sign of strength, not weakness. Mental health is just as important as physical health.
                        These resources are here to support you on your journey to wellness.
                    </p>
                    <div className="flex justify-center gap-2 mt-6">
                        <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>

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
                    animation: fade-in 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default MentalHealthHub;