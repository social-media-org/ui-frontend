import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, Info } from 'lucide-react';

const YouTubeScheduleForm = ({ onScheduleChange, initialSchedule = null }) => {
  const [publishAt, setPublishAt] = useState(initialSchedule?.publish_at || '');
  const [isPremiere, setIsPremiere] = useState(initialSchedule?.is_premiere || false);
  const [finalPrivacyStatus, setFinalPrivacyStatus] = useState(
    initialSchedule?.final_privacy_status || 'public'
  );

  // Get minimum date (now + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  const handleDateTimeChange = (value) => {
    setPublishAt(value);
    onScheduleChange({
      publish_at: value,
      is_premiere: isPremiere,
      final_privacy_status: finalPrivacyStatus,
    });
  };

  const handlePremiereChange = (checked) => {
    setIsPremiere(checked);
    onScheduleChange({
      publish_at: publishAt,
      is_premiere: checked,
      final_privacy_status: finalPrivacyStatus,
    });
  };

  const handlePrivacyChange = (value) => {
    setFinalPrivacyStatus(value);
    onScheduleChange({
      publish_at: publishAt,
      is_premiere: isPremiere,
      final_privacy_status: value,
    });
  };

  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200" data-testid="youtube-schedule-form">
      {/* Info Message */}
      <div className="flex items-start gap-2 p-3 bg-blue-100 border border-blue-300 rounded-lg">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Schedule your video publication</p>
          <p className="text-xs text-blue-700">
            The video will be private until the scheduled time. You can change or cancel the schedule anytime.
          </p>
        </div>
      </div>

      {/* Date and Time Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          Publication Date & Time
        </label>
        <input
          type="datetime-local"
          value={publishAt}
          onChange={(e) => handleDateTimeChange(e.target.value)}
          min={getMinDateTime()}
          className="input-field w-full"
          data-testid="schedule-datetime-input"
        />
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Select a date at least 1 hour in the future
        </p>
      </div>

      {/* Premiere Option */}
      <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
        <input
          type="checkbox"
          id="is-premiere"
          checked={isPremiere}
          onChange={(e) => handlePremiereChange(e.target.checked)}
          className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          data-testid="schedule-premiere-checkbox"
        />
        <div className="flex-1">
          <label htmlFor="is-premiere" className="block text-sm font-medium text-gray-900 cursor-pointer">
            Set as Premiere
          </label>
          <p className="text-xs text-gray-600 mt-1">
            Premiere allows you to watch the video together with your viewers in real-time, with live chat and reactions.
          </p>
        </div>
      </div>

      {/* Privacy Status After Publication */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Privacy After Publication
        </label>
        <select
          value={finalPrivacyStatus}
          onChange={(e) => handlePrivacyChange(e.target.value)}
          className="input-field w-full"
          data-testid="schedule-privacy-select"
        >
          <option value="public">Public - Anyone can find and watch</option>
          <option value="unlisted">Unlisted - Only people with the link can watch</option>
          <option value="private">Private - Only you can watch</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          The video will automatically change to this privacy setting at the scheduled time
        </p>
      </div>

      {/* Warning for missing date */}
      {!publishAt && (
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800">
            Please select a publication date and time
          </p>
        </div>
      )}
    </div>
  );
};

export default YouTubeScheduleForm;