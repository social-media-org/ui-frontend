import React from 'react';
import { Users, Video, Eye } from 'lucide-react';

const YouTubeChannelInfo = ({ channelInfo }) => {
  if (!channelInfo) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg" data-testid="youtube-channel-info">
      {/* Channel Thumbnail */}
      <div className="flex-shrink-0">
        <img
          src={channelInfo.thumbnail_url}
          alt={channelInfo.channel_title}
          className="w-16 h-16 rounded-full object-cover"
          data-testid="channel-thumbnail"
        />
      </div>

      {/* Channel Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900" data-testid="channel-title">
          {channelInfo.channel_title}
        </h3>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
          <div className="flex items-center gap-1" data-testid="subscriber-count">
            <Users className="w-4 h-4" />
            <span>{channelInfo.subscriber_count} subscribers</span>
          </div>
          <div className="flex items-center gap-1" data-testid="video-count">
            <Video className="w-4 h-4" />
            <span>{channelInfo.video_count} videos</span>
          </div>
          <div className="flex items-center gap-1" data-testid="view-count">
            <Eye className="w-4 h-4" />
            <span>{channelInfo.view_count} views</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeChannelInfo;
