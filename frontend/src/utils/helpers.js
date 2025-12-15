// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Format timestamp to time string
export const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Get status label and color
export const getStatusConfig = (status) => {
  const configs = {
    draft: {
      label: 'Draft',
      color: 'bg-gray-100 text-gray-700',
      dotColor: 'bg-gray-400',
    },
    script_generated: {
      label: 'Script Generated',
      color: 'bg-blue-100 text-blue-700',
      dotColor: 'bg-blue-500',
    },
    audio_generated: {
      label: 'Audio Generated',
      color: 'bg-yellow-100 text-yellow-700',
      dotColor: 'bg-yellow-500',
    },
    audio_ready: {
      label: 'Audio Ready',
      color: 'bg-yellow-100 text-yellow-700',
      dotColor: 'bg-yellow-500',
    },
    images_ready: {
      label: 'Images Ready',
      color: 'bg-purple-100 text-purple-700',
      dotColor: 'bg-purple-500',
    },
    video_ready: {
      label: 'Video Ready',
      color: 'bg-green-100 text-green-700',
      dotColor: 'bg-green-500',
    },
    scheduled_for_publish: {
      label: 'Scheduled for Publish',
      color: 'bg-orange-100 text-orange-700',
      dotColor: 'bg-orange-500',
    },
    uploaded_to_youtube: {
      label: 'Uploaded to YouTube',
      color: 'bg-teal-100 text-teal-700',
      dotColor: 'bg-teal-500',
    },
  };
  return configs[status] || configs.draft;
};

// Calculate estimated duration from text
export const estimateDuration = (text) => {
  if (!text) return 0;
  const wordsPerMinute = 150;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil((words / wordsPerMinute) * 60);
};

// Format duration in seconds to readable string
export const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return '0s';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
};
