/**
 * GoalsProgress Component
 * Visualización de progreso de objetivos con barras animadas
 * Reutilizable para cualquier sistema de metas/objetivos
 */
import { InteractiveCard, ProgressBar } from './index';

const GoalIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

export default function GoalsProgress({
  goals = [],
  title = "Monthly Goals",
  badge = "Progress",
  expandable = true,
  defaultExpanded = true
}) {
  const calculatePercentage = (current, target) => {
    return ((current / target) * 100).toFixed(1);
  };

  return (
    <InteractiveCard
      title={title}
      badge={badge}
      expandable={expandable}
      defaultExpanded={defaultExpanded}
      icon={GoalIcon}
    >
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const percentage = calculatePercentage(goal.current, goal.target);

          return (
            <div key={goal.id || index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[12.5px] text-[#1e1e1e] font-medium">
                  {goal.label}: {goal.targetFormatted || goal.target}
                </span>
                <span className="text-[11px] text-[rgba(30,30,30,0.55)]">
                  {percentage}% complete
                </span>
              </div>
              <ProgressBar
                value={goal.current}
                max={goal.target}
                color={goal.color || '#40086d'}
                height={goal.height || 10}
                showPercentage={false}
              />
            </div>
          );
        })}
      </div>
    </InteractiveCard>
  );
}
