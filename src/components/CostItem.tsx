import React from 'react';
import { Trash2 } from 'lucide-react';
import { Database } from '../lib/database.types';
import * as LucideIcons from 'lucide-react';

type CostEntry = Database['public']['Tables']['cost_entries']['Row'];
type CostCategory = Database['public']['Tables']['cost_categories']['Row'];

interface CostItemProps {
  cost: CostEntry;
  categories: CostCategory[];
  onDelete?: (costId: string) => void;
}

export const CostItem: React.FC<CostItemProps> = ({ cost, categories, onDelete }) => {
  const category = categories.find(cat => cat.id === cost.category_id);
  const IconComponent = category ? (LucideIcons as any)[category.icon] : null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          {category && IconComponent && (
            <div className={`p-2 rounded-lg mr-3 ${category.color}`}>
              <IconComponent className="h-4 w-4 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-slate-900 truncate">
                {cost.description}
              </h4>
              <span className="text-lg font-bold text-slate-900 ml-4">
                {formatCurrency(cost.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{category?.name}</span>
              <span>{formatDate(cost.date)}</span>
            </div>
          </div>
        </div>
        
        {onDelete && (
          <button
            onClick={() => onDelete(cost.id)}
            className="ml-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Удалить затрату"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};