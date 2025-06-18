import React from 'react';
import { Calendar, DollarSign, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { Database } from '../lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'];
type CostEntry = Database['public']['Tables']['cost_entries']['Row'];

interface ProjectCardProps {
  project: Project;
  costs: CostEntry[];
  onClick: () => void;
  onDelete?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, costs, onClick, onDelete }) => {
  const totalSpent = costs.reduce((sum, cost) => sum + cost.amount, 0);
  const remainingBudget = project.budget - totalSpent;
  const budgetUsagePercent = project.budget > 0 ? (totalSpent / project.budget) * 100 : 0;
  const isOverBudget = totalSpent > project.budget;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA');
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-slate-200 relative group"
      onClick={onClick}
    >
      {/* Delete button */}
      {onDelete && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-10"
          title="Удалить проект"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4 pr-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{project.name}</h3>
            <p className="text-slate-600 text-sm line-clamp-2">{project.description}</p>
          </div>
          <div className="flex items-center text-slate-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-xs">{formatDate(project.created_at)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-slate-700">Бюджет</span>
            </div>
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(project.budget)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isOverBudget ? (
                <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
              ) : (
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              )}
              <span className="text-sm font-medium text-slate-700">Потрачено</span>
            </div>
            <span className={`text-lg font-bold ${isOverBudget ? 'text-red-600' : 'text-blue-600'}`}>
              {formatCurrency(totalSpent)}
            </span>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Использование бюджета</span>
              <span className={`text-sm font-bold ${isOverBudget ? 'text-red-600' : 'text-slate-900'}`}>
                {budgetUsagePercent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  isOverBudget ? 'bg-red-500' : budgetUsagePercent > 80 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
              />
            </div>
            <div className="mt-2 text-right">
              <span className={`text-sm font-medium ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {remainingBudget < 0 ? 'Превышение: ' : 'Остаток: '}
                {formatCurrency(Math.abs(remainingBudget))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};