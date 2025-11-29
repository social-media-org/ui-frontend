import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Loader } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import PreviewModal from '../components/PreviewModal';
import ConfirmModal from '../components/ConfirmModal';
import { projectsAPI } from '../services/api';

const ProjectsListingPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewProject, setPreviewProject] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);
  const [generating, setGenerating] = useState({});

  // Load projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsAPI.getAll();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects
  useEffect(() => {
    let filtered = projects;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredProjects(filtered);
  }, [projects, statusFilter, searchQuery]);

  const handleDelete = async () => {
    if (!deleteProject) return;

    try {
      await projectsAPI.delete(deleteProject.id);
      setProjects(projects.filter((p) => p.id !== deleteProject.id));
      setDeleteProject(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handleGenerate = async (projectId, type) => {
    try {
      setGenerating({ ...generating, [`${projectId}-${type}`]: true });

      const project = projects.find((p) => p.id === projectId);
      let updatedProject;

      switch (type) {
        case 'script':
          updatedProject = await projectsAPI.generateScript(projectId, {
            use_case: project.use_case,
            style: project.script_style,
          });
          break;
        case 'audio':
          updatedProject = await projectsAPI.generateAudio(projectId, {
            script_text: project.script_text,
            voice_id: project.voice_id,
          });
          break;
        case 'images':
          updatedProject = await projectsAPI.generateImages(projectId, {
            prompts: project.images_prompts,
            style: project.image_style,
          });
          break;
        case 'video':
          updatedProject = await projectsAPI.generateVideo(projectId, {
            resolution: project.resolution,
            fps: project.fps,
          });
          break;
        default:
          break;
      }

      // Update project in state
      if (updatedProject) {
        setProjects(projects.map((p) => (p.id === projectId ? updatedProject : p)));
      }

      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} generation started!`);
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      alert(`Failed to generate ${type}`);
    } finally {
      setGenerating({ ...generating, [`${projectId}-${type}`]: false });
    }
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="page-title">
          Projects
        </h1>
        <p className="text-gray-600">Manage your AI-generated video content.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
            data-testid="search-input"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-48"
          data-testid="status-filter"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="script_generated">Script Generated</option>
          <option value="audio_ready">Audio Ready</option>
          <option value="images_ready">Images Ready</option>
          <option value="video_ready">Video Ready</option>
        </select>

        {/* New Project Button */}
        <Link to="/projects/new" className="btn-primary flex items-center gap-2" data-testid="new-project-btn">
          <Plus className="w-5 h-5" />
          New Project
        </Link>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No projects found</p>
          <Link to="/projects/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={(proj) => setDeleteProject(proj)}
              onPreview={(proj) => setPreviewProject(proj)}
              onGenerate={handleGenerate}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <PreviewModal
        isOpen={!!previewProject}
        onClose={() => setPreviewProject(null)}
        videoUrl={previewProject?.video_url}
        title={previewProject?.title}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteProject?.title}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
};

export default ProjectsListingPage;
