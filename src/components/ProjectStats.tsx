import React from 'react';
import { PieChart, BarChart3, DollarSign, TrendingUp } from 'lucide-react';
import { Database } from '../lib/database.types';

type CostEntry = Database['public']['Tables']['cost_entries']['Row'];
type CostCategory = Database['public']['Tables']['cost_categories']['Row'];

interface ProjectStatsProps {
  costs: CostEntry[];
  budget: number;
  categories: CostCategory[];
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({ costs, budget, categories }) => {
  const totalSpent = costs.reduce((sum, cost) => sum + cost.amount, 0);
  const remainingBudget = budget - totalSpent;

  const categoryTotals = categories.map(category => {
    const categoryTotal = costs
      .filter(cost => cost.category_id === category.id)
      .reduce((sum, cost) => sum + cost.amount, 0);
    
    return {
      ...category,
      amount: categoryTotal,
      percentage: totalSpent > 0 ? (categoryTotal / totalSpent) * 100 : 0,
    };
  }).filter(cat => cat.amount > 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Summary Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Общий бюджет</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(budget)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Потрачено</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${remainingBudget >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <BarChart3 className={`h-6 w-6 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">
                {remainingBudget >= 0 ? 'Остаток' : 'Превышение'}
              </p>
              <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(remainingBudget))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryTotals.length > 0 && (
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center mb-6">
              <PieChart className="h-5 w-5 text-slate-600 mr-2" />
              <h3 className="text-lg font-semibold text-slate-900">Распределение затрат по категориям</h3>
            </div>
            
            <div className="space-y-4">
              {categoryTotals.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className={`w-4 h-4 rounded-full ${category.color} mr-3`} />
                    <span className="text-sm font-medium text-slate-700">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${category.color}`}
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(category.amount)}</p>
                      <p className="text-xs text-slate-500">{category.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};