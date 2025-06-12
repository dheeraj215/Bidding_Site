import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Eye, Edit, Trash2, Save, X, AlertTriangle } from 'lucide-react';
import { AuctionItem } from '../../types';

interface AuctionManagementProps {
  auctions: AuctionItem[];
  onUpdateAuction: (auctionId: string, updates: Partial<AuctionItem>) => void;
  onDeleteAuction: (auctionId: string) => void;
}

export const AuctionManagement: React.FC<AuctionManagementProps> = ({ 
  auctions, 
  onUpdateAuction, 
  onDeleteAuction 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<AuctionItem>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'upcoming':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'expired':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (auction: AuctionItem) => {
    setEditingId(auction.id);
    setEditForm({
      title: auction.title,
      description: auction.description,
      startingPrice: auction.startingPrice,
      category: auction.category,
      endTime: auction.endTime,
    });
  };

  const handleSave = () => {
    if (editingId && editForm) {
      onUpdateAuction(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (auctionId: string) => {
    onDeleteAuction(auctionId);
    setDeleteConfirm(null);
  };

  const handleView = (auction: AuctionItem) => {
    setViewingId(auction.id);
  };

  const viewingAuction = auctions.find(a => a.id === viewingId);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Manage Auctions</h3>
          <p className="text-sm text-gray-500 mt-1">View, edit, and manage all your auctions</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Starting Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auctions.map((auction) => (
                <tr key={auction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-lg object-cover"
                        src={auction.images[0]}
                        alt={auction.title}
                      />
                      <div className="ml-4">
                        {editingId === auction.id ? (
                          <input
                            type="text"
                            value={editForm.title || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                            className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1 max-w-xs"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {auction.title}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          {auction.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(auction.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(auction.status)}`}>
                        {auction.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === auction.id ? (
                      <input
                        type="number"
                        value={editForm.startingPrice || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, startingPrice: Number(e.target.value) }))}
                        className="border border-gray-300 rounded px-2 py-1 w-24"
                      />
                    ) : (
                      formatCurrency(auction.startingPrice)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(auction.currentPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingId === auction.id ? (
                      <input
                        type="datetime-local"
                        value={editForm.endTime ? new Date(editForm.endTime.getTime() - editForm.endTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, endTime: new Date(e.target.value) }))}
                        className="border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      <div>
                        <div>{auction.endTime.toLocaleDateString()}</div>
                        <div className="text-xs">{auction.endTime.toLocaleTimeString()}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === auction.id ? (
                      <div className="flex space-x-2">
                        <button 
                          onClick={handleSave}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Save changes"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={handleCancel}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          title="Cancel editing"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleView(auction)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(auction)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Edit auction"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm(auction.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete auction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {auctions.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions yet</h3>
            <p className="text-gray-500">Create your first auction to get started.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this auction? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingAuction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Auction Details</h3>
              <button
                onClick={() => setViewingId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <img
                  src={viewingAuction.images[0]}
                  alt={viewingAuction.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">{viewingAuction.title}</h4>
                <p className="text-gray-600 mt-1">{viewingAuction.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{viewingAuction.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(viewingAuction.status)}`}>
                    {viewingAuction.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Starting Price</p>
                  <p className="font-medium">{formatCurrency(viewingAuction.startingPrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Price</p>
                  <p className="font-medium">{formatCurrency(viewingAuction.currentPrice)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {viewingAuction.location.area}, {viewingAuction.location.city}, {viewingAuction.location.state}
                </p>
              </div>
              
              {viewingAuction.amenities.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {viewingAuction.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};