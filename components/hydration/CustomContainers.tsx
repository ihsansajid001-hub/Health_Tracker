'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Coffee, Wine, Droplets } from 'lucide-react';

interface Container {
  id: string;
  name: string;
  volume: number; // in ml
  icon: string;
  color: string;
  isDefault: boolean;
}

const defaultContainers: Container[] = [
  { id: 'glass', name: 'Glass', volume: 250, icon: '🥛', color: 'bg-orange-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700', isDefault: true },
  { id: 'bottle', name: 'Water Bottle', volume: 500, icon: '🍼', color: 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700', isDefault: true },
  { id: 'large-bottle', name: 'Large Bottle', volume: 750, icon: '🍾', color: 'bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700', isDefault: true },
  { id: 'liter', name: '1 Liter', volume: 1000, icon: '🧴', color: 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700', isDefault: true },
];

interface Props {
  onContainerSelect?: (container: Container) => void;
  selectedContainer?: Container | null;
}

export default function CustomContainers({ onContainerSelect, selectedContainer }: Props) {
  const [containers, setContainers] = useState<Container[]>(defaultContainers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContainer, setEditingContainer] = useState<Container | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    volume: 250,
    icon: '🥤',
    color: 'bg-orange-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
  });

  const iconOptions = ['🥛', '🍼', '🍾', '🧴', '🥤', '☕', '🍵', '🧋', '🥃', '🍷', '🍺', '💧'];
  const colorOptions = [
    { name: 'Blue', value: 'bg-orange-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' },
    { name: 'Green', value: 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700' },
    { name: 'Purple', value: 'bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700' },
    { name: 'Orange', value: 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700' },
    { name: 'Pink', value: 'bg-pink-100 dark:bg-pink-900/20 border-pink-300 dark:border-pink-700' },
    { name: 'Yellow', value: 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700' },
    { name: 'Red', value: 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700' },
    { name: 'Gray', value: 'bg-gray-100 dark:bg-gray-900/20 border-gray-300 dark:border-gray-700' },
  ];

  useEffect(() => {
    // Load custom containers from localStorage
    const saved = localStorage.getItem('customContainers');
    if (saved) {
      try {
        const customContainers = JSON.parse(saved);
        setContainers([...defaultContainers, ...customContainers]);
      } catch (error) {
        console.error('Failed to load custom containers:', error);
      }
    }
  }, []);

  const saveCustomContainers = (newContainers: Container[]) => {
    const customContainers = newContainers.filter(c => !c.isDefault);
    localStorage.setItem('customContainers', JSON.stringify(customContainers));
  };

  const handleAddContainer = () => {
    if (!formData.name.trim() || formData.volume <= 0) return;

    const newContainer: Container = {
      id: Date.now().toString(),
      name: formData.name,
      volume: formData.volume,
      icon: formData.icon,
      color: formData.color,
      isDefault: false
    };

    const updatedContainers = [...containers, newContainer];
    setContainers(updatedContainers);
    saveCustomContainers(updatedContainers);
    
    setFormData({ name: '', volume: 250, icon: '🥤', color: colorOptions[0].value });
    setShowAddForm(false);
  };

  const handleEditContainer = (container: Container) => {
    setEditingContainer(container);
    setFormData({
      name: container.name,
      volume: container.volume,
      icon: container.icon,
      color: container.color
    });
    setShowAddForm(true);
  };

  const handleUpdateContainer = () => {
    if (!editingContainer || !formData.name.trim() || formData.volume <= 0) return;

    const updatedContainer: Container = {
      ...editingContainer,
      name: formData.name,
      volume: formData.volume,
      icon: formData.icon,
      color: formData.color
    };

    const updatedContainers = containers.map(c => 
      c.id === editingContainer.id ? updatedContainer : c
    );
    
    setContainers(updatedContainers);
    saveCustomContainers(updatedContainers);
    
    setEditingContainer(null);
    setFormData({ name: '', volume: 250, icon: '🥤', color: colorOptions[0].value });
    setShowAddForm(false);
  };

  const handleDeleteContainer = (containerId: string) => {
    const container = containers.find(c => c.id === containerId);
    if (container?.isDefault) return; // Can't delete default containers

    const updatedContainers = containers.filter(c => c.id !== containerId);
    setContainers(updatedContainers);
    saveCustomContainers(updatedContainers);
  };

  const getVolumeDisplay = (volume: number) => {
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}L`;
    }
    return `${volume}ml`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Container Sizes
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Quick-add buttons for your favorite containers
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Container</span>
        </button>
      </div>

      {/* Container Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {containers.map((container) => (
          <div
            key={container.id}
            onClick={() => onContainerSelect?.(container)}
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
              container.color
            } ${
              selectedContainer?.id === container.id 
                ? 'ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-gray-800' 
                : ''
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{container.icon}</div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                {container.name}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-xs">
                {getVolumeDisplay(container.volume)}
              </div>
            </div>

            {/* Edit/Delete buttons for custom containers */}
            {!container.isDefault && (
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditContainer(container);
                  }}
                  className="p-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs"
                >
                  <Edit size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteContainer(container.id);
                  }}
                  className="p-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingContainer ? 'Edit Container' : 'Add Custom Container'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingContainer(null);
                  setFormData({ name: '', volume: 250, icon: '🥤', color: colorOptions[0].value });
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Plus size={20} className="rotate-45 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Container Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., My Water Bottle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Volume (ml)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={formData.volume}
                  onChange={(e) => setFormData({ ...formData, volume: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-3 text-2xl rounded-lg border-2 transition-colors ${
                        formData.icon === icon
                          ? 'border-orange-500 bg-orange-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Theme
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        color.value
                      } ${
                        formData.color === color.value
                          ? 'ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-gray-800'
                          : ''
                      }`}
                    >
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {color.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preview
                </label>
                <div className={`p-4 rounded-lg border-2 ${formData.color} text-center`}>
                  <div className="text-3xl mb-2">{formData.icon}</div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {formData.name || 'Container Name'}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">
                    {getVolumeDisplay(formData.volume)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingContainer(null);
                    setFormData({ name: '', volume: 250, icon: '🥤', color: colorOptions[0].value });
                  }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingContainer ? handleUpdateContainer : handleAddContainer}
                  disabled={!formData.name.trim() || formData.volume <= 0}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                >
                  {editingContainer ? 'Update Container' : 'Add Container'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Droplets size={24} className="text-orange-500 dark:text-orange-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Container Stats
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500 dark:text-orange-400">
              {containers.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Containers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {containers.filter(c => !c.isDefault).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Custom</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.min(...containers.map(c => c.volume))}ml
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Smallest</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {getVolumeDisplay(Math.max(...containers.map(c => c.volume)))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Largest</div>
          </div>
        </div>
      </div>
    </div>
  );
}