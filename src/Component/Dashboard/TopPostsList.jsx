/**
 * TopPostsList Component
 * Lista de posts más destacados con rankings
 * Reutilizable para mostrar cualquier tipo de contenido rankeado
 */
import { InteractiveCard } from './index';

const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export default function TopPostsList({
  posts = [],
  title = "Top Performing Posts",
  badge = "Last 7 days",
  maxItems = 3,
  expandable = true,
  defaultExpanded = true,
  onPostClick,
  emptyMessage = "No posts available yet"
}) {
  const renderPost = (post, index) => (
    <div
      key={post.id || index}
      className={`
        flex gap-2.5 items-center group
        hover:bg-[#ede0f8] p-2 rounded-lg
        transition-colors duration-200
        ${onPostClick ? 'cursor-pointer' : ''}
      `}
      onClick={() => onPostClick && onPostClick(post)}
    >
      <div className="relative">
        <img
          src={post.thumbnail_url || post.media_url || post.image}
          alt={post.caption?.substring(0, 30) || post.title}
          className="w-12 h-12 object-cover rounded-lg"
        />
        <div className="absolute -top-1 -left-1 w-5 h-5 bg-[#40086d] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          {index + 1}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] text-[#1e1e1e] truncate font-medium">
          {post.caption?.substring(0, 40) || post.title?.substring(0, 40)}...
        </p>
        <p className="text-[11px] text-[rgba(30,30,30,0.55)]">
          {post.like_count || post.likes || 0} likes · {post.comments_count || post.comments || 0} comments
        </p>
      </div>
    </div>
  );

  return (
    <InteractiveCard
      title={title}
      badge={badge}
      icon={StarIcon}
      expandable={expandable}
      defaultExpanded={defaultExpanded}
    >
      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.slice(0, maxItems).map(renderPost)}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-[12.5px] text-[rgba(30,30,30,0.55)]">
            {emptyMessage}
          </p>
        </div>
      )}
    </InteractiveCard>
  );
}
