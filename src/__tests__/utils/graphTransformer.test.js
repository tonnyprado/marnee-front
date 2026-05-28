/**
 * graphTransformer Tests
 */

// Mock the constants
jest.mock('../../constants/graphConstants', () => ({
  NODE_COLORS: {
    user: '#E85D04',
    expertise: '#7c3aed',
    audience_interest: '#2563eb',
    value: '#059669',
    passion: '#db2777',
    business_keyword: '#1e1e1e',
    content_pillar: '#dc2626',
    niche_keyword: '#0891b2',
    benefit: '#16a34a',
    differentiator: '#9333ea',
    conversation_topic: '#6366f1',
    brainstorming: '#f59e0b'
  },
  NODE_SIZES: {
    user: 22,
    expertise: 14,
    audience_interest: 14,
    value: 12,
    passion: 12,
    content_pillar: 16,
    business_keyword: 12,
    niche_keyword: 12,
    benefit: 14,
    differentiator: 14,
    conversation_topic: 11,
    brainstorming: 13
  },
  NODE_SHAPES: {
    user: 'star',
    expertise: 'hexagon',
    audience_interest: 'hexagon',
    value: 'square',
    passion: 'square',
    business_keyword: 'circle',
    content_pillar: 'triangle',
    niche_keyword: 'circle',
    benefit: 'diamond',
    differentiator: 'diamond',
    conversation_topic: 'circle',
    brainstorming: 'hexagon'
  }
}));

import { transformToGraph, calculateCompleteness } from '../../utils/graphTransformer';

describe('graphTransformer', () => {
  describe('transformToGraph', () => {
    it('should create a central user node', () => {
      const result = transformToGraph({});

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].id).toBe('user-central');
      expect(result.nodes[0].category).toBe('user');
      expect(result.nodes[0].label).toBe('Tú'); // Default name
    });

    it('should use founder name when available', () => {
      const result = transformToGraph({
        founderProfile: { name: 'John Doe' }
      });

      expect(result.nodes[0].label).toBe('John Doe');
    });

    it('should add expertise nodes from topicsConfidentTeaching', () => {
      const result = transformToGraph({
        founderProfile: {
          topicsConfidentTeaching: ['Marketing', 'Design', 'Strategy']
        }
      });

      const expertiseNodes = result.nodes.filter(n => n.category === 'expertise');
      expect(expertiseNodes).toHaveLength(3);
      expect(expertiseNodes[0].label).toBe('Marketing');
      expect(expertiseNodes[0].index).toBe(1);

      // Should have links to central node
      const expertiseLinks = result.links.filter(l => l.target.startsWith('expertise-'));
      expect(expertiseLinks).toHaveLength(3);
    });

    it('should add audience interest nodes from topicsPeopleAskAbout', () => {
      const result = transformToGraph({
        founderProfile: {
          topicsPeopleAskAbout: ['SEO', 'Content Creation']
        }
      });

      const audienceNodes = result.nodes.filter(n => n.category === 'audience_interest');
      expect(audienceNodes).toHaveLength(2);
      expect(audienceNodes[0].label).toBe('SEO');
    });

    it('should add value nodes from personalValues', () => {
      const result = transformToGraph({
        founderProfile: {
          personalValues: ['Integrity', 'Innovation']
        }
      });

      const valueNodes = result.nodes.filter(n => n.category === 'value');
      expect(valueNodes).toHaveLength(2);
    });

    it('should add passion nodes from otherPassions', () => {
      const result = transformToGraph({
        founderProfile: {
          otherPassions: ['Photography', 'Travel']
        }
      });

      const passionNodes = result.nodes.filter(n => n.category === 'passion');
      expect(passionNodes).toHaveLength(2);
    });

    it('should add business keyword nodes from associatedKeywords', () => {
      const result = transformToGraph({
        businessTest: {
          associatedKeywords: ['SaaS', 'B2B', 'Automation']
        }
      });

      const keywordNodes = result.nodes.filter(n => n.category === 'business_keyword');
      expect(keywordNodes).toHaveLength(3);
    });

    it('should add content pillar nodes from strategy', () => {
      const result = transformToGraph({
        strategy: {
          contentPillars: ['Education', 'Entertainment', 'Inspiration']
        }
      });

      const pillarNodes = result.nodes.filter(n => n.category === 'content_pillar');
      expect(pillarNodes).toHaveLength(3);
    });

    it('should handle content pillars as objects', () => {
      const result = transformToGraph({
        strategy: {
          contentPillars: [
            { name: 'Education' },
            { title: 'Entertainment' },
            { pillar: 'Inspiration' }
          ]
        }
      });

      const pillarNodes = result.nodes.filter(n => n.category === 'content_pillar');
      expect(pillarNodes).toHaveLength(3);
      expect(pillarNodes.map(n => n.label)).toEqual(['Education', 'Entertainment', 'Inspiration']);
    });

    it('should add niche keyword nodes', () => {
      const result = transformToGraph({
        strategy: {
          nicheKeywords: ['startup', 'founders', 'growth']
        }
      });

      const nicheNodes = result.nodes.filter(n => n.category === 'niche_keyword');
      expect(nicheNodes).toHaveLength(3);
    });

    it('should add main benefit node', () => {
      const result = transformToGraph({
        businessTest: {
          mainBenefit: 'Save time on content creation'
        }
      });

      const benefitNodes = result.nodes.filter(n => n.category === 'benefit');
      expect(benefitNodes).toHaveLength(1);
      expect(benefitNodes[0].label).toBe('Save time on content creation');
    });

    it('should truncate long benefit text', () => {
      const longBenefit = 'This is a very long benefit description that exceeds the 40 character limit';
      const result = transformToGraph({
        businessTest: {
          mainBenefit: longBenefit
        }
      });

      const benefitNode = result.nodes.find(n => n.category === 'benefit');
      expect(benefitNode.label.length).toBeLessThanOrEqual(43); // 40 + '...'
      expect(benefitNode.label.endsWith('...')).toBe(true);
    });

    it('should add differentiator node', () => {
      const result = transformToGraph({
        businessTest: {
          differentiator: 'AI-powered insights'
        }
      });

      const diffNodes = result.nodes.filter(n => n.category === 'differentiator');
      expect(diffNodes).toHaveLength(1);
    });

    it('should add conversation topic nodes with metadata', () => {
      const result = transformToGraph({
        conversationTopics: [
          { topic: 'Marketing', count: 5 },
          { topic: 'Strategy', count: 3 }
        ]
      });

      const topicNodes = result.nodes.filter(n => n.category === 'conversation_topic');
      expect(topicNodes).toHaveLength(2);
      expect(topicNodes[0].metadata.mentionCount).toBe(5);
    });

    it('should add brainstorming idea nodes', () => {
      const result = transformToGraph({
        brainstormingIdeas: [
          { id: '1', title: 'Video idea', platform: 'tiktok', status: 'draft' },
          { id: '2', description: 'Another idea without title' }
        ]
      });

      const brainstormNodes = result.nodes.filter(n => n.category === 'brainstorming');
      expect(brainstormNodes).toHaveLength(2);
      expect(brainstormNodes[0].metadata.platform).toBe('tiktok');
    });

    it('should truncate long brainstorming titles', () => {
      const result = transformToGraph({
        brainstormingIdeas: [
          { id: '1', title: 'This is a very long brainstorming idea title that should be truncated' }
        ]
      });

      const brainstormNode = result.nodes.find(n => n.category === 'brainstorming');
      expect(brainstormNode.label.length).toBeLessThanOrEqual(26); // 23 + '...'
    });

    it('should skip invalid labels', () => {
      const result = transformToGraph({
        founderProfile: {
          topicsConfidentTeaching: ['Valid', '', null, 'A', 'Another Valid', undefined]
        }
      });

      // Should only have 'Valid' and 'Another Valid' (plus user node)
      const expertiseNodes = result.nodes.filter(n => n.category === 'expertise');
      expect(expertiseNodes).toHaveLength(2);
    });

    it('should create links for all nodes to central user', () => {
      const result = transformToGraph({
        founderProfile: {
          topicsConfidentTeaching: ['Topic 1', 'Topic 2'],
          personalValues: ['Value 1']
        }
      });

      // 3 additional nodes = 3 links (not counting user node)
      expect(result.links).toHaveLength(3);

      // All links should have user-central as source
      result.links.forEach(link => {
        expect(link.source).toBe('user-central');
      });
    });
  });

  describe('calculateCompleteness', () => {
    it('should return 0 for empty graph', () => {
      expect(calculateCompleteness({ nodes: [], links: [] })).toBe(0);
    });

    it('should return 0 for null graph', () => {
      expect(calculateCompleteness(null)).toBe(0);
    });

    it('should return 0 for undefined graph', () => {
      expect(calculateCompleteness(undefined)).toBe(0);
    });

    it('should calculate percentage based on categories present', () => {
      const graph = {
        nodes: [
          { category: 'user' },
          { category: 'expertise' },
          { category: 'value' }
        ],
        links: []
      };

      // 2 categories (excluding user) / 10 possible = 20%
      expect(calculateCompleteness(graph)).toBe(20);
    });

    it('should not count duplicate categories', () => {
      const graph = {
        nodes: [
          { category: 'user' },
          { category: 'expertise' },
          { category: 'expertise' },
          { category: 'expertise' }
        ],
        links: []
      };

      // Only 1 unique category (excluding user) / 10 = 10%
      expect(calculateCompleteness(graph)).toBe(10);
    });

    it('should return 100% for fully complete graph', () => {
      const graph = {
        nodes: [
          { category: 'user' },
          { category: 'expertise' },
          { category: 'audience_interest' },
          { category: 'value' },
          { category: 'passion' },
          { category: 'business_keyword' },
          { category: 'content_pillar' },
          { category: 'niche_keyword' },
          { category: 'benefit' },
          { category: 'differentiator' },
          { category: 'conversation_topic' }
        ],
        links: []
      };

      // 10 categories (excluding user) / 10 = 100%
      expect(calculateCompleteness(graph)).toBe(100);
    });
  });
});
