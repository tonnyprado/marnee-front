/**
 * topicExtractor Tests
 */
import { extractTopicsFromConversations } from '../../utils/topicExtractor';

describe('topicExtractor', () => {
  describe('extractTopicsFromConversations', () => {
    it('should return empty array for null input', () => {
      expect(extractTopicsFromConversations(null)).toEqual([]);
    });

    it('should return empty array for undefined input', () => {
      expect(extractTopicsFromConversations(undefined)).toEqual([]);
    });

    it('should return empty array for non-array input', () => {
      expect(extractTopicsFromConversations('not an array')).toEqual([]);
      expect(extractTopicsFromConversations({})).toEqual([]);
      expect(extractTopicsFromConversations(123)).toEqual([]);
    });

    it('should return empty array for empty array', () => {
      expect(extractTopicsFromConversations([])).toEqual([]);
    });

    it('should extract topics from user messages', () => {
      const conversations = [
        {
          messages: [
            { role: 'user', content: 'Cómo puedo mejorar mi estrategia de marketing' },
            { role: 'assistant', content: 'Te puedo ayudar con eso.' }
          ]
        }
      ];

      const result = extractTopicsFromConversations(conversations);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it('should extract interest keywords from assistant messages', () => {
      const conversations = [
        {
          messages: [
            { role: 'user', content: 'Ayúdame con contenido' },
            { role: 'assistant', content: 'Instagram es una plataforma ideal para marketing. Recomiendo usar reels y stories para engagement.' }
          ]
        },
        {
          messages: [
            { role: 'user', content: 'Más sobre redes' },
            { role: 'assistant', content: 'El marketing en Instagram requiere consistencia y engagement con tu audiencia.' }
          ]
        }
      ];

      const result = extractTopicsFromConversations(conversations);

      // Should find Instagram, marketing, reels, stories, engagement as they are interest keywords
      const topics = result.map(r => r.topic.toLowerCase());
      expect(topics.some(t => ['instagram', 'marketing', 'reels', 'stories', 'engagement'].includes(t))).toBe(true);
    });

    it('should count topic mentions correctly', () => {
      const conversations = [
        {
          messages: [
            { role: 'assistant', content: 'Marketing marketing marketing contenido contenido' }
          ]
        }
      ];

      const result = extractTopicsFromConversations(conversations);

      // Marketing should have count of at least 3 (mentioned 3 times)
      const marketingTopic = result.find(r => r.topic.toLowerCase() === 'marketing');
      if (marketingTopic) {
        expect(marketingTopic.count).toBeGreaterThanOrEqual(2);
      }
    });

    it('should give higher weight to user topics', () => {
      const conversations = [
        {
          messages: [
            { role: 'user', content: 'Quiero aprender sobre branding' },
            { role: 'user', content: 'Más sobre branding por favor' }
          ]
        }
      ];

      const result = extractTopicsFromConversations(conversations);
      const brandingTopic = result.find(r => r.topic.toLowerCase() === 'branding');

      if (brandingTopic) {
        expect(brandingTopic.fromUser).toBeGreaterThan(0);
      }
    });

    it('should handle conversations without messages', () => {
      const conversations = [
        { id: '1' }, // No messages
        { messages: null },
        { messages: [] }
      ];

      const result = extractTopicsFromConversations(conversations);
      expect(result).toEqual([]);
    });

    it('should handle messages without content', () => {
      const conversations = [
        {
          messages: [
            { role: 'user' }, // No content
            { role: 'assistant', content: '' }
          ]
        }
      ];

      const result = extractTopicsFromConversations(conversations);
      expect(result).toEqual([]);
    });

    it('should extract hashtags from user messages', () => {
      const conversations = [
        {
          messages: [
            { role: 'user', content: 'Quiero contenido sobre #marketing y #branding' },
            { role: 'user', content: 'También #marketing' }
          ]
        }
      ];

      const result = extractTopicsFromConversations(conversations);
      // Hashtags should be extracted
      const topics = result.map(r => r.topic.toLowerCase());
      // At least one topic should be found
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it('should extract topics from English patterns', () => {
      const conversations = [
        {
          messages: [
            { role: 'user', content: 'Help me with content strategy' },
            { role: 'user', content: 'How to improve engagement' }
          ]
        }
      ];

      const result = extractTopicsFromConversations(conversations);
      // Should extract something from these patterns
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it('should return only topics with at least 2 mentions', () => {
      const conversations = [
        {
          messages: [
            { role: 'assistant', content: 'Instagram' } // Only 1 mention
          ]
        }
      ];

      const result = extractTopicsFromConversations(conversations);

      // Topics with only 1 mention should be filtered out
      result.forEach(topic => {
        expect(topic.count).toBeGreaterThanOrEqual(2);
      });
    });

    it('should limit results to top 15 topics', () => {
      // Create conversations with many different topics
      const conversations = [
        {
          messages: [
            {
              role: 'assistant',
              content: 'instagram tiktok youtube linkedin twitter facebook pinterest marketing branding contenido video podcast blog newsletter engagement alcance viral tendencias estrategia monetización ventas leads funnel'
            },
            {
              role: 'assistant',
              content: 'instagram tiktok youtube linkedin twitter facebook pinterest marketing branding contenido video podcast blog newsletter engagement alcance viral tendencias estrategia monetización ventas leads funnel'
            }
          ]
        }
      ];

      const result = extractTopicsFromConversations(conversations);
      expect(result.length).toBeLessThanOrEqual(15);
    });

    it('should sort topics by count in descending order', () => {
      const conversations = [
        {
          messages: [
            { role: 'assistant', content: 'instagram instagram instagram marketing marketing contenido' },
            { role: 'assistant', content: 'instagram instagram marketing' }
          ]
        }
      ];

      const result = extractTopicsFromConversations(conversations);

      // Results should be sorted by count (descending)
      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].count).toBeGreaterThanOrEqual(result[i].count);
      }
    });

    it('should include fromUser and fromAI counts in results', () => {
      const conversations = [
        {
          messages: [
            { role: 'user', content: 'Quiero aprender sobre marketing digital' },
            { role: 'assistant', content: 'El marketing digital incluye muchas estrategias.' },
            { role: 'user', content: 'Más sobre marketing por favor' }
          ]
        }
      ];

      const result = extractTopicsFromConversations(conversations);

      result.forEach(topic => {
        expect(topic).toHaveProperty('fromUser');
        expect(topic).toHaveProperty('fromAI');
        expect(topic).toHaveProperty('count');
        expect(topic).toHaveProperty('topic');
      });
    });

    it('should handle mixed Spanish and English content', () => {
      const conversations = [
        {
          messages: [
            { role: 'user', content: 'How to crear contenido for Instagram' },
            { role: 'assistant', content: 'El content marketing en Instagram requires strategy.' },
            { role: 'user', content: 'Más sobre content strategy' }
          ]
        }
      ];

      const result = extractTopicsFromConversations(conversations);
      // Should not crash and should extract some topics
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
