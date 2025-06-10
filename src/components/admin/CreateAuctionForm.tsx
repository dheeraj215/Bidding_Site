import React, { useState } from 'react';
import { Plus, Upload, X, MapPin, Calendar, DollarSign } from 'lucide-react';
import { AuctionItem } from '../../types';

interface CreateAuctionFormProps {
  onCreateAuction: (auctionData: Omit<AuctionItem, 'id' | 'currentPrice' | 'status' | 'createdAt'>) => void;
}

export const CreateAuctionForm: React.FC<CreateAuctionFormProps> = ({ onCreateAuction }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    startingPrice: '',
    startTime: '',
    endTime: '',
    location: {
      area: '',
      city: '',
      state: '',
      pincode: ''
    },
    details: {
      type: '',
      area: '',
      bedrooms: '',
      bathrooms: '',
      parking: '',
      floor: '',
      facing: '',
      age: '',
      condition: ''
    },
    amenities: [] as string[],
    images: [] as string[]
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const categories = [
    'Real Estate',
    'Automobiles',
    'Luxury Items',
    'Electronics',
    'Art & Collectibles',
    'Jewelry',
    'Furniture',
    'Other'
  ];

  const sampleImages = [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const auctionData: Omit<AuctionItem, 'id' | 'currentPrice' | 'status' | 'createdAt'> = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      startingPrice: parseInt(formData.startingPrice),
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      location: formData.location,
      details: {
        ...formData.details,
        area: formData.details.area ? parseInt(formData.details.area) : undefined,
        bedrooms: formData.details.bedrooms ? parseInt(formData.details.bedrooms) : undefined,
        bathrooms: formData.details.bathrooms ? parseInt(formData.details.bathrooms) : undefined,
        parking: formData.details.parking ? parseInt(formData.details.parking) : undefined
      },
      amenities: formData.amenities,
      images: formData.images.length > 0 ? formData.images : [sampleImages[0]],
      createdBy: 'admin'
    };

    onCreateAuction(auctionData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      startingPrice: '',
      startTime: '',
      endTime: '',
      location: { area: '', city: '', state: '', pincode: '' },
      details: {
        type: '', area: '', bedrooms: '', bathrooms: '', parking: '',
        floor: '', facing: '', age: '', condition: ''
      },
      amenities: [],
      images: []
    });
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const addImage = () => {
    if (imageUrl.trim() && !formData.images.includes(imageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
      setImageUrl('');
    }
  };

  const addSampleImage = (url: string) => {
    if (!formData.images.includes(url)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
  };

  const removeImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Create New Auction</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter auction title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the item being auctioned"
          />
        </div>

        {/* Pricing and Timing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Starting Price ($)
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.startingPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, startingPrice: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Start Time
            </label>
            <input
              type="datetime-local"
              required
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              End Time
            </label>
            <input
              type="datetime-local"
              required
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              value={formData.location.area}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                location: { ...prev.location, area: e.target.value }
              }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Area"
            />
            <input
              type="text"
              value={formData.location.city}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                location: { ...prev.location, city: e.target.value }
              }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City"
            />
            <input
              type="text"
              value={formData.location.state}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                location: { ...prev.location, state: e.target.value }
              }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="State"
            />
            <input
              type="text"
              value={formData.location.pincode}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                location: { ...prev.location, pincode: e.target.value }
              }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Pincode"
            />
          </div>
        </div>

        {/* Details */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Additional Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={formData.details.type}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                details: { ...prev.details, type: e.target.value }
              }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type (e.g., Apartment, Car)"
            />
            <input
              type="number"
              value={formData.details.area}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                details: { ...prev.details, area: e.target.value }
              }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Area (sq ft)"
            />
            <input
              type="text"
              value={formData.details.condition}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                details: { ...prev.details, condition: e.target.value }
              }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Condition"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Images
          </h4>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter image URL"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Or choose from sample images:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sampleImages.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Sample ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => addSampleImage(url)}
                    />
                    <button
                      type="button"
                      onClick={() => addSampleImage(url)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {formData.images.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Images:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Selected ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Amenities/Features</h4>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add amenity or feature"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
            />
            <button
              type="button"
              onClick={addAmenity}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add
            </button>
          </div>
          
          {formData.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium"
          >
            Create Auction
          </button>
        </div>
      </form>
    </div>
  );
};