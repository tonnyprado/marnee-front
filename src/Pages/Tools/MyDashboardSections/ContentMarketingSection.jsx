/**
 * ContentMarketingSection Component
 * Sección de Content Marketing con Instagram Insights
 * Versión refactorizada usando componentes reutilizables
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
import { useInstagramData } from '../../../hooks/useInstagramData';
import {
  getInstagramInsights,
  getInstagramMedia,
  connectInstagram
} from '../../../services/instagramApi';

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

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
  </svg>
);

export default function ContentMarketingSection() {
  const { isLoading, hasData, isConnected } = useInstagramData();
  const [insights, setInsights] = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch data when connected
  useEffect(() => {
    if (hasData && !insights) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasData]);

  const fetchData = async () => {
    try {
      setLoadingData(true);

      // Fetch insights and media in parallel
      const [insightsData, mediaData] = await Promise.all([
        getInstagramInsights('days_28'),
        getInstagramMedia(10)
      ]);

      setInsights(insightsData);
      setTopPosts(mediaData.media || []);
    } catch (error) {
      console.error('Error fetching Instagram data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleConnect = () => {
    connectInstagram();
  };

  // Configuración de métricas
  const metrics = [
    {
      key: 'reach',
      label: 'Total Reach',
      value: insights?.reach || 128400,
      format: 'number',
      trend: { value: 12.5, isPositive: true },
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      )
    },
    {
      key: 'engagement',
      label: 'Avg. Engagement Rate',
      value: insights?.engagement_rate || 4.2,
      format: 'decimal',
      suffix: '%',
      trend: { value: 8.3, isPositive: true },
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      )
    },
    {
      key: 'reels',
      label: 'Reel Plays',
      value: insights?.reel_plays || 89100,
      format: 'number',
      trend: { value: 23.1, isPositive: true },
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      )
    },
    {
      key: 'followers',
      label: 'New Followers',
      value: insights?.follower_growth || 347,
      format: 'number',
      prefix: '+',
      trend: { value: 15.7, isPositive: true },
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
      id: 'reach',
      label: 'Reach Goal',
      current: insights?.reach || 128400,
      target: 150000,
      targetFormatted: '150K',
      color: '#40086d'
    },
    {
      id: 'engagement',
      label: 'Engagement Goal',
      current: insights?.engagement_rate || 4.2,
      target: 5,
      targetFormatted: '5%',
      color: '#22c55e'
    },
    {
      id: 'followers',
      label: 'New Followers Goal',
      current: insights?.follower_growth || 347,
      target: 500,
      targetFormatted: '500',
      color: '#ef4444'
    }
  ];

  // Data para charts (puede venir de la API)
  const reachChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Reach',
        data: insights?.reach_by_day || [15400, 18200, 21100, 19800, 23400, 28100, 26700]
      }
    ]
  };

  const postingHoursData = {
    labels: ['9am', '12pm', '3pm', '6pm', '9pm', '12am'],
    datasets: [
      {
        label: 'Engagement',
        data: insights?.engagement_by_hour || [45, 72, 88, 95, 78, 52]
      }
    ]
  };

  const contentTypeData = {
    labels: ['Reels', 'Posts', 'Carousels', 'Stories'],
    datasets: [
      {
        data: insights?.content_distribution || [45, 25, 20, 10],
        backgroundColor: ['#40086d', '#dccaf4', '#ede0f8', '#f6f6f6']
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Content Marketing"
        subtitle="Instagram Graph API — organic performance"
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
                Connect Instagram
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
          icon: <InstagramIcon />,
          title: "Connect your Instagram account",
          description: "Link your Instagram Business account to start seeing reach, engagement, top posts, best posting times, and follower growth.",
          features: [
            "Reach & impressions",
            "Likes & saves",
            "Engagement rate",
            "Reel plays",
            "Follower growth"
          ],
          buttonText: "Connect Instagram Business account",
          buttonIcon: <LinkIcon />,
          onConnect: handleConnect,
          note: "Requires Instagram Business or Creator account connected to a Facebook Page"
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
              <ReachOverTimeChart data={reachChartData} />
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
              <ContentTypeChart data={contentTypeData} />
              <TopPostsList
                posts={topPosts}
                maxItems={3}
                emptyMessage="No posts available yet"
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
