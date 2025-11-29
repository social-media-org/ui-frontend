import React from 'react';
import { FileText, Mic, Image, Video, Clock } from 'lucide-react';
import { formatDuration } from '../../utils/helpers';

const PreviewPanel = ({ project, activeTab }) => {
  const renderPreview = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              <Video className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Ready to Render</h4>
              <p className="text-sm text-gray-600 mb-4">
                Configure your settings and click 'Generate Video' to create your masterpiece.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span>{project.duration || 0}s</span>
                <span>•</span>
                <span>{project.resolution || '1080p'}</span>
                <span>•</span>
                <span>{project.fps || 30} FPS</span>
              </div>
            </div>
          </div>
        );

      case 'script':
        return (
          <div className="space-y-4">
            {project.script_text ? (
              <div className="pt-6">
                <div className="flex items-center gap-2 mb-4 text-primary-600">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Script Preview</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {project.script_text}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                  {project.script_text.length} characters • ~{formatDuration(Math.ceil(project.script_text.length / 2.5))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3" />
                <p>Generate a script to see preview...</p>
              </div>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-4">
            {project.audio_url ? (
              <div className="pt-6">
                <div className="flex items-center gap-2 mb-4 text-primary-600">
                  <Mic className="w-5 h-5" />
                  <span className="font-medium">Audio Preview</span>
                </div>
                <audio controls className="w-full" data-testid="preview-audio-player">
                  <source src={project.audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Voice: <span className="font-medium">{project.voice_id || 'Alloy'}</span></p>
                  <p>Speed: {project.audio_speed || 1.0}x • Pitch: {project.audio_pitch || 1.0}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <Mic className="w-12 h-12 mx-auto mb-3" />
                <p>No audio generated yet</p>
                <p className="text-sm mt-2">Voice Preview - {project.voice_id || 'Alloy'}</p>
              </div>
            )}
          </div>
        );

      case 'images':
        const images = project.images || [];
        return (
          <div className="space-y-4">
            {images.length > 0 && images.some(img => img.url) ? (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4 text-primary-600">
                  <Image className="w-5 h-5" />
                  <span className="font-medium">Images Preview</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((image, index) => (
                    image.url && (
                      <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={image.url}
                          alt={`Scene ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  Style: <span className="font-medium">{project.image_style || 'Realistic'}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <Image className="w-12 h-12 mx-auto mb-3" />
                <p>No images generated</p>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            {project.video_url ? (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-4 text-primary-600">
                  <Video className="w-5 h-5" />
                  <span className="font-medium">Video Preview</span>
                </div>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <video controls className="w-full h-full">
                    <source src={project.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <Video className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ready to Render</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure your settings and click 'Generate Video' to create your masterpiece.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <span>{project.duration || 0}s</span>
                    <span>•</span>
                    <span>{project.resolution || '1080p'}</span>
                    <span>•</span>
                    <span>{project.fps || 30} FPS</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-xl h-full" data-testid="live-preview-panel">
      <div className="flex items-center justify-center min-h-[400px]">
        {renderPreview()}
      </div>
    </div>
  );
};

export default PreviewPanel;
