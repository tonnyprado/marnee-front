import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Folder, FileText, Sparkles, ListOrdered, GitBranch } from 'lucide-react';
import { getCategories, getPrompts } from '../../services/promptsApi';

const ICON_MAP = {
  Sparkles: Sparkles,
  ListOrdered: ListOrdered,
  GitBranch: GitBranch,
  FileText: FileText,
};

export default function PromptCategoryTree({ onSelectPrompt, selectedPromptId }) {
  const [categories, setCategories] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, promptsRes] = await Promise.all([
        getCategories(),
        getPrompts(),
      ]);

      setCategories(categoriesRes.data || []);
      setPrompts(promptsRes.data || []);

      // Auto-expand all categories initially
      const allCategoryIds = new Set((categoriesRes.data || []).map(c => c.id));
      setExpandedCategories(allCategoryIds);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty data - tables might not exist yet
      setCategories([]);
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const getPromptsByCategory = (categoryId) => {
    return prompts.filter(p => p.category_id === categoryId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'draft': return 'bg-gray-400';
      case 'inactive': return 'bg-yellow-500';
      case 'archived': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-mn-night to-mn-purple text-white">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Folder size={20} />
          Prompt Categories
        </h3>
      </div>

      <div className="p-2">
        {categories.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500 mb-2">No prompts found</p>
            <p className="text-xs text-gray-400">Run database migration or click "Import from Code"</p>
          </div>
        ) : (
          <div className="space-y-1">
            {categories.map((category) => {
              const isExpanded = expandedCategories.has(category.id);
              const categoryPrompts = getPromptsByCategory(category.id);
              const IconComponent = ICON_MAP[category.icon] || Folder;

              return (
                <div key={category.id}>
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-left"
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />
                    )}
                    <IconComponent size={18} className="text-mn-purple flex-shrink-0" />
                    <span className="flex-1 font-medium text-gray-900 text-sm">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {categoryPrompts.length}
                    </span>
                  </button>

                  {/* Category Prompts */}
                  {isExpanded && (
                    <div className="ml-6 mt-1 space-y-0.5">
                      {categoryPrompts.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-gray-400 italic">
                          No prompts in this category
                        </div>
                      ) : (
                        categoryPrompts.map((prompt) => (
                          <button
                            key={prompt.id}
                            onClick={() => onSelectPrompt(prompt)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition text-left ${
                              selectedPromptId === prompt.id
                                ? 'bg-mn-lilac/20 border border-mn-purple'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(prompt.status)}`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {prompt.name}
                              </p>
                              {prompt.step_number && (
                                <p className="text-xs text-gray-500">Step {prompt.step_number}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {prompt.is_default && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                  Default
                                </span>
                              )}
                              <span className="text-xs text-gray-400">
                                v{prompt.current_version}
                              </span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <p><strong>{prompts.length}</strong> total prompts</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>{prompts.filter(p => p.status === 'active').length} active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <span>{prompts.filter(p => p.status === 'draft').length} draft</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
