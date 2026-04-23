export default function SecurityStatCard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
  const colorClasses = {
    red: {
      bg: 'bg-gradient-to-br from-red-100 to-red-50',
      text: 'text-red-600',
      border: 'border-red-200',
    },
    yellow: {
      bg: 'bg-gradient-to-br from-yellow-100 to-yellow-50',
      text: 'text-yellow-600',
      border: 'border-yellow-200',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-100 to-green-50',
      text: 'text-green-600',
      border: 'border-green-200',
    },
    blue: {
      bg: 'bg-gradient-to-br from-mn-lilac/30 to-mn-ice',
      text: 'text-mn-purple',
      border: 'border-mn-lilac',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-mn-lilac/20 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
          <p className={`text-4xl font-display font-bold mt-3 mb-1 ${colors.text}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-4 rounded-2xl ${colors.bg} ${colors.text} border ${colors.border}`}>
            <Icon className="w-8 h-8" />
          </div>
        )}
      </div>
    </div>
  );
}
