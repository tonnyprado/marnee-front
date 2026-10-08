import React, { useState, useEffect } from 'react';
import { getCommentsAnalytics } from '../services/instagramApi';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  SentimentSatisfiedAlt,
  SentimentDissatisfied,
  SentimentNeutral,
  Help,
  Lightbulb,
  Warning,
  CheckCircle,
  TrendingUp
} from '@mui/icons-material';

const InstagramCommentsInsights = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getCommentsAnalytics(20);
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load comments analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!analytics) {
    return null;
  }

  const { summary, sentiment, key_topics, marnee_observations, action_items } = analytics;

  // Icon map for observation types
  const observationIcons = {
    success: <CheckCircle color="success" />,
    warning: <Warning color="warning" />,
    insight: <Lightbulb color="primary" />,
    info: <TrendingUp color="info" />
  };

  // Sentiment icon component
  const SentimentIcon = ({ type, count, percentage }) => {
    const icons = {
      positive: <SentimentSatisfiedAlt sx={{ fontSize: 40, color: '#4caf50' }} />,
      negative: <SentimentDissatisfied sx={{ fontSize: 40, color: '#f44336' }} />,
      neutral: <SentimentNeutral sx={{ fontSize: 40, color: '#9e9e9e' }} />,
      questions: <Help sx={{ fontSize: 40, color: '#2196f3' }} />
    };

    const colors = {
      positive: '#4caf50',
      negative: '#f44336',
      neutral: '#9e9e9e',
      questions: '#2196f3'
    };

    return (
      <Box textAlign="center" p={2}>
        <Box mb={1}>{icons[type]}</Box>
        <Typography variant="h4" fontWeight="bold">{count}</Typography>
        <Typography variant="caption" color="textSecondary">
          {percentage}%
        </Typography>
        <Typography variant="body2" textTransform="capitalize" sx={{ mt: 0.5 }}>
          {type}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            mt: 1,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: colors[type]
            }
          }}
        />
      </Box>
    );
  };

  return (
    <Box>
      {/* Summary */}
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardHeader
          title="Comments Overview"
          titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {summary.total_comments}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Comments
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" fontWeight="bold">
                {summary.avg_comments_per_post.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Avg per Post
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" fontWeight="bold">
                {summary.posts_with_comments}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Posts with Comments
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" fontWeight="bold">
                {summary.total_posts_analyzed}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Posts Analyzed
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Sentiment Analysis */}
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardHeader
          title="Sentiment Analysis"
          subheader={`Overall Score: ${sentiment.sentiment_score >= 0 ? '+' : ''}${sentiment.sentiment_score}`}
          titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <SentimentIcon
                type="positive"
                count={sentiment.positive}
                percentage={sentiment.positive_percentage}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <SentimentIcon
                type="negative"
                count={sentiment.negative}
                percentage={sentiment.negative_percentage}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <SentimentIcon
                type="neutral"
                count={sentiment.neutral}
                percentage={((sentiment.neutral / summary.total_comments) * 100).toFixed(1)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <SentimentIcon
                type="questions"
                count={sentiment.questions}
                percentage={((sentiment.questions / summary.total_comments) * 100).toFixed(1)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Marnee's AI Observations - DESTACADO */}
      <Card sx={{ mb: 3, boxShadow: 4, border: '2px solid #9c27b0' }}>
        <CardHeader
          title="🤖 Marnee's Insights"
          subheader="AI-powered observations from your comment data"
          titleTypographyProps={{ variant: 'h5', fontWeight: 'bold', color: '#9c27b0' }}
          sx={{ backgroundColor: '#f3e5f5' }}
        />
        <CardContent>
          {marnee_observations.length === 0 ? (
            <Typography color="textSecondary">
              No specific observations yet. Keep engaging with your audience!
            </Typography>
          ) : (
            <List>
              {marnee_observations.map((obs, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                    <ListItemIcon sx={{ mt: 1 }}>
                      {observationIcons[obs.type]}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                          <Typography variant="subtitle1" fontWeight="bold">
                            {obs.observation}
                          </Typography>
                          <Chip
                            label={obs.impact}
                            size="small"
                            color={
                              obs.impact === 'high' ? 'error' :
                              obs.impact === 'medium' ? 'warning' : 'default'
                            }
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          {obs.details}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < marnee_observations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Key Topics */}
      {key_topics.length > 0 && (
        <Card sx={{ mb: 3, boxShadow: 3 }}>
          <CardHeader
            title="Key Topics Mentioned"
            titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
          />
          <CardContent>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {key_topics.slice(0, 8).map((topic, index) => (
                <Chip
                  key={index}
                  label={`${topic.topic} (${topic.mentions})`}
                  variant="outlined"
                  icon={<TrendingUp />}
                  color="primary"
                  sx={{ fontSize: '0.9rem', py: 2 }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Action Items */}
      {action_items.length > 0 && (
        <Card sx={{ boxShadow: 3 }}>
          <CardHeader
            title="📋 Recommended Actions"
            titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
          />
          <CardContent>
            <List>
              {action_items.map((action, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemIcon>
                    <CheckCircle color="action" />
                  </ListItemIcon>
                  <ListItemText primary={action} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default InstagramCommentsInsights;
