import { Monitor, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function SessionCard({ session, onRevoke, showUser = true }) {
  return (
    <div className="bg-white border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
          <Monitor className="w-5 h-5" />
        </div>
        <div>
          {showUser && (
            <p className="font-medium text-gray-900">{session.userEmail}</p>
          )}
          <p className="text-sm text-gray-600">{session.deviceInfo || 'Unknown Device'}</p>
          <p className="text-xs text-gray-500">
            IP: {session.ipAddress} {session.location && `• ${session.location}`}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Last active: {formatDistanceToNow(new Date(session.lastActivityAt), { addSuffix: true })}
          </p>
        </div>
      </div>
      <button
        onClick={() => onRevoke(session.id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
        title="Revoke session"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
