import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { useAuth } from './useAuth';

type CostEntry = Database['public']['Tables']['cost_entries']['Row'];
type CostEntryInsert = Database['public']['Tables']['cost_entries']['Insert'];
type CostCategory = Database['public']['Tables']['cost_categories']['Row'];

export const useCosts = (projectId?: string) => {
  const [costs, setCosts] = useState<CostEntry[]>([]);
  const [categories, setCategories] = useState<CostCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('cost_entries')
        .select('*')
        .order('date', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setCosts(data || []);
        setError(null);
      }
    } catch (err) {
      setError('Ошибка при загрузке затрат');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('cost_categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCosts();
      fetchCategories();
    }
  }, [user, projectId]);

  const createCost = async (costData: Omit<CostEntryInsert, 'created_by'>) => {
    if (!user) return { error: new Error('Пользователь не авторизован') };

    const { data, error } = await supabase
      .from('cost_entries')
      .insert({
        ...costData,
        created_by: user.id,
      })
      .select()
      .single();

    if (!error) {
      await fetchCosts();
    }

    return { data, error };
  };

  const deleteCost = async (id: string) => {
    const { error } = await supabase
      .from('cost_entries')
      .delete()
      .eq('id', id);

    if (!error) {
      await fetchCosts();
    }

    return { error };
  };

  const getProjectCosts = (projectId: string) => {
    return costs.filter(cost => cost.project_id === projectId);
  };

  return {
    costs,
    categories,
    loading,
    error,
    createCost,
    deleteCost,
    getProjectCosts,
    refetch: fetchCosts,
  };
};