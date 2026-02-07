'use client';

import { useState, useEffect } from 'react';

const API_URL = 'http://54.83.104.189:3000/items';

interface Item {
  id: number;
  name: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItemName }),
      });
      if (res.ok) {
        setNewItemName('');
        fetchItems();
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const updateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name.trim()) return;
    try {
      const res = await fetch(`${API_URL}/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingItem.name }),
      });
      if (res.ok) {
        setEditingItem(null);
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">CRUD Next.js Frontend</h1>
        
        {/* Add Item Form */}
        <form onSubmit={addItem} className="mb-8 flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="New item name"
            className="flex-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Add Item
          </button>
        </form>

        {/* Editing Item Form */}
        {editingItem && (
          <form onSubmit={updateItem} className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2 items-center">
            <span className="font-semibold">Editing:</span>
            <input
              type="text"
              value={editingItem.name}
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              className="flex-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
              Update
            </button>
            <button type="button" onClick={() => setEditingItem(null)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
              Cancel
            </button>
          </form>
        )}

        {/* Items List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading items...</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 transition">
                <span className="text-lg text-gray-800">{item.name} <span className="text-xs text-gray-400 font-mono">#{item.id}</span></span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="text-yellow-600 hover:bg-yellow-100 px-3 py-1 rounded transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-600 hover:bg-red-100 px-3 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}