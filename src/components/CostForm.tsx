import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Database } from '../lib/database.types';
import * as LucideIcons from 'lucide-react';

type CostCategory = Database['public']['Tables']['cost_categories']['Row'];
type CostEntryInsert = Database['public']['Tables']['cost_entries']['Insert'];

interface CostFormProps {
  projectId: string;
  categories: CostCategory[];
  onSubmit: (cost: Omit<CostEntryInsert, 'created_by'>) => void;
  onCancel: () => void;
}

export const CostForm: React.FC<CostFormProps> = ({ projectId, categories, onSubmit, onCancel }) => {
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !amount || !description.trim()) return;

    onSubmit({
      project_id: projectId,
      category_id: categoryId,
      amount: parseFloat(amount),
      description: description.trim(),
      date: new Date().toISOString(),
    });

    setCategoryId('');
    setAmount('');
    setDescription('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Plus className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-slate-900">Добавить затрату</h3>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Категория затрат
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category) => {
              const IconComponent = (LucideIcons as any)[category.icon];
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 ${
                    categoryId === category.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-3 ${
                    categoryId === category.id ? 'bg-blue-100' : category.color
                  }`}>
                    <IconComponent className={`h-4 w-4 ${
                      categoryId === category.id ? 'text-blue-600' : 'text-white'
                    }`} />
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
              Сумма (₴)
            </label>
            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
              Описание
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Описание затраты..."
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={!categoryId || !amount || !description.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Добавить затрату
          </button>
        </div>
      </form>
    </div>
  );
};