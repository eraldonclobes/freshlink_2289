import React from 'react';
import { MapPin, Phone, Share2, Star, Clock, CheckCircle } from 'lucide-react';

const VendorHeroSection = ({ vendor, onWhatsAppContact, onDirections, onShare }) => {
  const defaultVendor = {
    name: "Raj Mishra",
    description: "My clients describe my training style as motivating and life-changing.",
    location: "San Francisco, CA",
    rating: 5.0,
    reviewCount: 351,
    experience: "2+",
    isVerified: true,
    completedSessions: 351,
    yearsExperience: "2+",
    joinedDate: "April 2021",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  };

  const vendorData = vendor || defaultVendor;

  return (
    <div className="relative">
      {/* Gradient Background */}
      <div className="h-48 bg-gradient-to-r from-orange-200 via-pink-200 to-purple-300"></div>
      
      {/* Content Container */}
      <div className="relative -mt-24 px-4 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={vendorData.avatar}
                alt={vendorData.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {vendorData.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {vendorData.name}
                  </h1>
                  <p className="text-gray-600 mb-3 max-w-md">
                    {vendorData.description}
                  </p>
                  
                  {/* Location and Rating */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{vendorData.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-900">{vendorData.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Joined {vendorData.joinedDate}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-8">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {vendorData.completedSessions}
                      </div>
                      <div className="text-sm text-gray-500">Completed Sessions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {vendorData.yearsExperience}
                      </div>
                      <div className="text-sm text-gray-500">Years Experience</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 min-w-fit">
                  <button
                    onClick={onWhatsAppContact}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Message
                  </button>
                  <button
                    onClick={() => {}}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Book a session
                  </button>
                  <button
                    onClick={onShare}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorHeroSection;