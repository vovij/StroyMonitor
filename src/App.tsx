import React, { useState } from 'react';
import { Plus, ArrowLeft, Building2 } from 'lucide-react';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProjectCard } from './components/ProjectCard';
import { ProjectStats } from './components/ProjectStats';
import { CostForm } from './components/CostForm';
import { CostItem } from './components/CostItem';
import { useAuth } from './hooks/useAuth';
import { useProjects } from './hooks/useProjects';
import { useCosts } from './hooks/useCosts';
import { Database } from './lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'];
type View = 'projects' | 'project-detail' | 'create-project';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCostForm, setShowCostForm] = useState(false);

  // Form states
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectBudget, setProjectBudget] = useState('');

  const { profile } = useAuth();
  const { projects, loading: projectsLoading, createProject, deleteProject } = useProjects();
  const { costs, categories, createCost, deleteCost } = useCosts();

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !projectBudget) return;

    const { error } = await createProject({
      name: projectName.trim(),
      description: projectDescription.trim(),
      budget: parseFloat(projectBudget),
    });

    if (!error) {
      setProjectName('');
      setProjectDescription('');
      setProjectBudget('');
      setCurrentView('projects');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект? Все связанные затраты также будут удалены.')) {
      const { error } = await deleteProject(projectId);
      
      if (!error && selectedProject && selectedProject.id === projectId) {
        setSelectedProject(null);
        setCurrentView('projects');
      }
    }
  };

  const handleAddCost = async (costData: any) => {
    const { error } = await createCost(costData);

    if (!error) {
      setShowCostForm(false);
    }
  };

  const handleDeleteCost = async (costId: string) => {
    await deleteCost(costId);
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project-detail');
  };

  const getProjectCosts = (projectId: string) => {
    return costs.filter(cost => cost.project_id === projectId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (projectsLoading) {
    return (
      <Layout title="Загрузка...">
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  // Projects list view
  if (currentView === 'projects') {
    return (
      <Layout title="Мои проекты">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-slate-600">
              Управляйте затратами ваших строительных проектов
            </p>
          </div>
          <button
            onClick={() => setCurrentView('create-project')}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Новый проект
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Нет проектов
            </h3>
            <p className="text-slate-600 mb-6">
              Создайте свой первый проект для отслеживания затрат
            </p>
            <button
              onClick={() => setCurrentView('create-project')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Создать проект
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                costs={getProjectCosts(project.id)}
                onClick={() => handleSelectProject(project)}
                onDelete={() => handleDeleteProject(project.id)}
              />
            ))}
          </div>
        )}
      </Layout>
    );
  }

  // Create project view
  if (currentView === 'create-project') {
    return (
      <Layout title="Создать проект">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('projects')}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к проектам
          </button>
        </div>

        <div className="max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-slate-700 mb-2">
                  Название проекта *
                </label>
                <input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Например: Строительство жилого дома"
                  required
                />
              </div>

              <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-slate-700 mb-2">
                  Описание проекта
                </label>
                <textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Краткое описание проекта..."
                />
              </div>

              <div>
                <label htmlFor="projectBudget" className="block text-sm font-medium text-slate-700 mb-2">
                  Бюджет проекта (₴) *
                </label>
                <input
                  id="projectBudget"
                  type="number"
                  min="0"
                  step="0.01"
                  value={projectBudget}
                  onChange={(e) => setProjectBudget(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentView('projects')}
                  className="px-6 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={!projectName.trim() || !projectBudget}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Создать проект
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  // Project detail view
  if (currentView === 'project-detail' && selectedProject) {
    const projectCosts = getProjectCosts(selectedProject.id);

    return (
      <Layout title={selectedProject.name}>
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('projects')}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к проектам
          </button>
        </div>

        <div className="mb-8">
          <ProjectStats costs={projectCosts} budget={selectedProject.budget} categories={categories} />
        </div>

        {showCostForm && (
          <CostForm
            projectId={selectedProject.id}
            categories={categories}
            onSubmit={handleAddCost}
            onCancel={() => setShowCostForm(false)}
          />
        )}

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              История затрат ({projectCosts.length})
            </h3>
            {!showCostForm && (
              <button
                onClick={() => setShowCostForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить затрату
              </button>
            )}
          </div>

          {projectCosts.length === 0 && !showCostForm ? (
            <div className="text-center py-12">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-slate-400" />
              </div>
              <h4 className="text-lg font-medium text-slate-900 mb-2">
                Нет затрат
              </h4>
              <p className="text-slate-600 mb-4">
                Начните добавлять затраты для отслеживания бюджета проекта
              </p>
              <button
                onClick={() => setShowCostForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить первую затрату
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {projectCosts
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((cost) => (
                  <CostItem
                    key={cost.id}
                    cost={cost}
                    categories={categories}
                    onDelete={handleDeleteCost}
                  />
                ))}
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return null;
}

function App() {
  return (
    <ProtectedRoute>
      <AppContent />
    </ProtectedRoute>
  );
}

export default App;