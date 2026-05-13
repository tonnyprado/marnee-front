/**
 * InteractiveCard Component
 * Card con animaciones y efectos hover premium
 */
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function InteractiveCard({
  title,
  children,
  className = "",
  noPadding = false,
  onClick,
  expandable = false,
  defaultExpanded = true,
  badge,
  icon: Icon
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    if (expandable) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <motion.div
      className={`
        relative bg-[#f6f6f6] border border-[#dccaf4]
        rounded-[10px] overflow-hidden
        transition-all duration-300
        ${onClick || expandable ? 'cursor-pointer' : ''}
        ${isHovered ? 'shadow-lg border-[#40086d]' : ''}
        ${className}
      `}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#ede0f8] via-transparent to-transparent opacity-0 pointer-events-none"
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Title */}
      {title && (
        <motion.div
          className="
            px-5 pt-[18px] pb-3
            text-[10px] font-semibold text-[rgba(30,30,30,0.38)]
            uppercase tracking-[0.7px] font-['DM_Sans']
            flex items-center justify-between relative z-10
          "
          onClick={handleToggle}
        >
          <div className="flex items-center gap-2">
            {Icon && (
              <motion.div
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.6 }}
              >
                <Icon className="w-3.5 h-3.5" />
              </motion.div>
            )}
            <span>{title}</span>
            {badge && (
              <motion.span
                className="
                  px-2 py-0.5 rounded-full bg-[#40086d] text-white
                  text-[9px] font-semibold
                "
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                {badge}
              </motion.span>
            )}
          </div>
          {expandable && (
            <motion.svg
              className="w-4 h-4 text-[rgba(30,30,30,0.55)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M6 9l6 6 6-6" />
            </motion.svg>
          )}
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        className={noPadding ? "" : "px-5 pb-[18px]"}
        initial={expandable ? { height: 0, opacity: 0 } : {}}
        animate={{
          height: expandable ? (isExpanded ? 'auto' : 0) : 'auto',
          opacity: expandable ? (isExpanded ? 1 : 0) : 1
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>

      {/* Shine effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
          }}
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  );
}
