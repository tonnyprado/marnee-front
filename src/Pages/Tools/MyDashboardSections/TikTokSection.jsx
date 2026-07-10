/**
 * TikTokSection Component
 * Sección de TikTok Analytics con métricas de videos
 */
import { useState, useEffect } from 'react';
import {
  PageHeader,
  DashboardButton,
  DataGuard,
  MetricsGrid,
  ActivityStatus,
  ReachOverTimeChart,
  BestPostingHoursChart,
  ContentTypeChart,
  TopPostsList,
  GoalsProgress,
  SkeletonChart,
  SkeletonCard
} from '../../../Component/Dashboard';
import { useTikTokData } from '../../../hooks/useTikTokData';
import {
  getTikTokAnalytics,
  getTikTokVideos,
  connectTikTok
} from '../../../services/tiktokApi';

// Icons
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export default function TikTokSection() {
  const { isLoading, hasData, isConnected } = useTikTokData();
  const [analytics, setAnalytics] = useState(null);
  const [topVideos, setTopVideos] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch data when connected
  useEffect(() => {
    if (hasData && !analytics) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasData]);

  const fetchData = async () => {
    try {
      setLoadingData(true);

      // Fetch analytics and videos in parallel
      const [analyticsData, videosData] = await Promise.all([
        getTikTokAnalytics(30),
        getTikTokVideos(10)
      ]);

      setAnalytics(analyticsData);
      setTopVideos(videosData.videos || []);
    } catch (error) {
      console.error('Error fetching TikTok data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleConnect = () => {
    connectTikTok();
  };

  // Configuración de métricas
  const metrics = [
    {
      key: 'views',
      label: 'Total Views',
      value: analytics?.total_views || 2840000,
      format: 'number',
      trend: { value: 18.5, isPositive: true },
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )
    },
    {
      key: 'engagement',
      label: 'Engagement Rate',
      value: analytics?.engagement_rate || 6.3,
      format: 'decimal',
      suffix: '%',
      trend: { value: 12.7, isPositive: true },
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      )
    },
    {
      key: 'shares',
      label: 'Total Shares',
      value: analytics?.total_shares || 12400,
      format: 'number',
      trend: { value: 25.4, isPositive: true },
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      )
    },
    {
      key: 'followers',
      label: 'New Followers',
      value: analytics?.follower_growth || 2847,
      format: 'number',
      prefix: '+',
      trend: { value: 22.1, isPositive: true },
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    }
  ];

  // Configuración de objetivos
  const goals = [
    {
      id: 'views',
      label: 'Views Goal',
      current: analytics?.total_views || 2840000,
      target: 3000000,
      targetFormatted: '3M',
      color: '#40086d'
    },
    {
      id: 'engagement',
      label: 'Engagement Goal',
      current: analytics?.engagement_rate || 6.3,
      target: 8,
      targetFormatted: '8%',
      color: '#22c55e'
    },
    {
      id: 'followers',
      label: 'Followers Goal',
      current: analytics?.follower_growth || 2847,
      target: 5000,
      targetFormatted: '5K',
      color: '#ef4444'
    }
  ];

  // Data para charts
  const viewsChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Views',
        data: analytics?.views_by_day || [342000, 389000, 421000, 398000, 456000, 512000, 482000]
      }
    ]
  };

  const postingHoursData = {
    labels: ['9am', '12pm', '3pm', '6pm', '9pm', '12am'],
    datasets: [
      {
        label: 'Engagement',
        data: analytics?.engagement_by_hour || [52, 68, 85, 92, 78, 64]
      }
    ]
  };

  const contentTypeData = {
    labels: ['Regular Videos', 'Duets', 'Stitches', 'Lives'],
    datasets: [
      {
        data: analytics?.content_distribution || [65, 20, 10, 5],
        backgroundColor: ['#000000', '#69C9D0', '#EE1D52', '#f6f6f6']
      }
    ]
  };

  // Transformar videos para TopPostsList
  const videosForDisplay = topVideos.map(video => ({
    id: video.id,
    media_url: video.cover_url,
    caption: video.title,
    like_count: video.like_count,
    comments_count: video.comment_count,
    engagement_rate: video.engagement_rate,
    permalink: video.video_url
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="TikTok Analytics"
        subtitle="TikTok For Business API — video performance & audience insights"
        actions={
          <>
            <DashboardButton variant="secondary" icon={<CalendarIcon />}>
              Last 30 days
            </DashboardButton>
            {!isConnected && (
              <DashboardButton
                variant="primary"
                icon={<LinkIcon />}
                onClick={handleConnect}
              >
                Connect TikTok
              </DashboardButton>
            )}
          </>
        }
      />

      {/* Main Content with DataGuard */}
      <DataGuard
        isLoading={isLoading}
        hasData={hasData}
        connectState={{
          icon: <TikTokIcon />,
          title: "Connect your TikTok account",
          description: "Link your TikTok Business account to access video analytics, engagement metrics, audience demographics, and growth insights.",
          features: [
            "Video views & watch time",
            "Likes, shares & comments",
            "Engagement rate",
            "Follower growth",
            "Audience demographics"
          ],
          buttonText: "Connect TikTok Business account",
          buttonIcon: <LinkIcon />,
          onConnect: handleConnect,
          note: "Requires TikTok Business account"
        }}
      >
        {/* Connected - Show Data */}
        <div className="space-y-5">
          {/* Metrics Grid */}
          <MetricsGrid
            metrics={metrics}
            isLoading={loadingData}
            columns={4}
          />

          {/* Activity Status */}
          <ActivityStatus
            isLive={true}
            label="Live tracking active"
            lastUpdated={new Date()}
          />

          {/* Charts Row 1 */}
          {loadingData ? (
            <div className="grid grid-cols-2 gap-3.5">
              <SkeletonChart height={250} />
              <SkeletonChart height={250} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              <ReachOverTimeChart
                data={viewsChartData}
                title="Views Over Time"
                badge="7 Days"
              />
              <BestPostingHoursChart data={postingHoursData} />
            </div>
          )}

          {/* Charts Row 2 */}
          {loadingData ? (
            <div className="grid grid-cols-2 gap-3.5">
              <SkeletonCard lines={4} />
              <SkeletonCard lines={4} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              <ContentTypeChart
                data={contentTypeData}
                title="Content Type Distribution"
              />
              <TopPostsList
                posts={videosForDisplay}
                maxItems={3}
                emptyMessage="No videos available yet"
                title="Top Videos"
              />
            </div>
          )}

          {/* Goals Section */}
          {!loadingData && (
            <GoalsProgress goals={goals} />
          )}
        </div>
      </DataGuard>
    </div>
  );
}
