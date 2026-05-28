/**
 * SafeText Component Tests
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SafeText, SafeDiv, SafeP, SafeH2 } from '../../../Component/ui/SafeText';

describe('SafeText', () => {
  describe('basic rendering', () => {
    it('should render simple text', () => {
      render(<SafeText text="Hello World" />);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('should render null for non-string input', () => {
      const { container } = render(<SafeText text={null} />);
      expect(container).toBeEmptyDOMElement();
    });

    it('should render null for undefined', () => {
      const { container } = render(<SafeText text={undefined} />);
      expect(container).toBeEmptyDOMElement();
    });

    it('should render null for number', () => {
      const { container } = render(<SafeText text={123} />);
      expect(container).toBeEmptyDOMElement();
    });

    it('should render null for object', () => {
      const { container } = render(<SafeText text={{ key: 'value' }} />);
      expect(container).toBeEmptyDOMElement();
    });

    it('should render empty string', () => {
      const { container } = render(<SafeText text="" />);
      expect(container.querySelector('span')).toBeInTheDocument();
    });
  });

  describe('line breaks', () => {
    it('should convert single newline to br', () => {
      const text = `Line 1
Line 2`;
      const { container } = render(<SafeText text={text} />);
      const br = container.querySelector('br');
      expect(br).toBeInTheDocument();
    });

    it('should convert multiple newlines to multiple br', () => {
      const text = `Line 1
Line 2
Line 3`;
      const { container } = render(<SafeText text={text} />);
      const brs = container.querySelectorAll('br');
      expect(brs).toHaveLength(2);
    });

    it('should not add br after last line', () => {
      const text = `Line 1
Line 2`;
      const { container } = render(<SafeText text={text} />);
      const brs = container.querySelectorAll('br');
      expect(brs).toHaveLength(1);
    });

    it('should handle empty lines', () => {
      const text = `Line 1

Line 3`;
      const { container } = render(<SafeText text={text} />);
      const brs = container.querySelectorAll('br');
      expect(brs).toHaveLength(2);
    });
  });

  describe('highlighting', () => {
    it('should highlight matching text', () => {
      const { container } = render(<SafeText text="Hello World" highlight="World" />);
      const strong = container.querySelector('strong');
      expect(strong).toBeInTheDocument();
      expect(strong).toHaveTextContent('World');
    });

    it('should highlight multiple occurrences', () => {
      const { container } = render(<SafeText text="Hello World, World again" highlight="World" />);
      const strongs = container.querySelectorAll('strong');
      expect(strongs).toHaveLength(2);
    });

    it('should not highlight when no match', () => {
      const { container } = render(<SafeText text="Hello World" highlight="Foo" />);
      const strong = container.querySelector('strong');
      expect(strong).not.toBeInTheDocument();
    });

    it('should highlight with newlines', () => {
      const text = `Hello World
World again`;
      const { container } = render(<SafeText text={text} highlight="World" />);
      const strongs = container.querySelectorAll('strong');
      expect(strongs).toHaveLength(2);
    });

    it('should handle highlight at start of text', () => {
      const { container } = render(<SafeText text="World is great" highlight="World" />);
      const strong = container.querySelector('strong');
      expect(strong).toHaveTextContent('World');
    });

    it('should handle highlight at end of text', () => {
      const { container } = render(<SafeText text="Hello World" highlight="World" />);
      const strong = container.querySelector('strong');
      expect(strong).toHaveTextContent('World');
    });
  });

  describe('className prop', () => {
    it('should apply className to container', () => {
      const { container } = render(<SafeText text="Hello" className="custom-class" />);
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('as prop (container type)', () => {
    it('should default to span', () => {
      const { container } = render(<SafeText text="Hello" />);
      expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('should render as div when specified', () => {
      const { container } = render(<SafeText text="Hello" as="div" />);
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('should render as p when specified', () => {
      const { container } = render(<SafeText text="Hello" as="p" />);
      expect(container.querySelector('p')).toBeInTheDocument();
    });

    it('should render as h2 when specified', () => {
      const { container } = render(<SafeText text="Hello" as="h2" />);
      expect(container.querySelector('h2')).toBeInTheDocument();
    });
  });
});

describe('SafeDiv', () => {
  it('should render as div', () => {
    const { container } = render(<SafeDiv text="Hello" />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('should apply className', () => {
    const { container } = render(<SafeDiv text="Hello" className="test-class" />);
    expect(container.querySelector('div.test-class')).toBeInTheDocument();
  });

  it('should support highlight', () => {
    const { container } = render(<SafeDiv text="Hello World" highlight="World" />);
    expect(container.querySelector('strong')).toHaveTextContent('World');
  });
});

describe('SafeP', () => {
  it('should render as p', () => {
    const { container } = render(<SafeP text="Hello" />);
    expect(container.querySelector('p')).toBeInTheDocument();
  });

  it('should apply className', () => {
    const { container } = render(<SafeP text="Hello" className="test-class" />);
    expect(container.querySelector('p.test-class')).toBeInTheDocument();
  });

  it('should support highlight', () => {
    const { container } = render(<SafeP text="Hello World" highlight="World" />);
    expect(container.querySelector('strong')).toHaveTextContent('World');
  });
});

describe('SafeH2', () => {
  it('should render as h2', () => {
    const { container } = render(<SafeH2 text="Hello" />);
    expect(container.querySelector('h2')).toBeInTheDocument();
  });

  it('should apply className', () => {
    const { container } = render(<SafeH2 text="Hello" className="test-class" />);
    expect(container.querySelector('h2.test-class')).toBeInTheDocument();
  });

  it('should support highlight', () => {
    const { container } = render(<SafeH2 text="Hello World" highlight="World" />);
    expect(container.querySelector('strong')).toHaveTextContent('World');
  });
});

describe('XSS prevention', () => {
  it('should not execute script tags in text', () => {
    const maliciousText = '<script>alert("xss")</script>';
    const { container } = render(<SafeText text={maliciousText} />);

    // Script tag should be rendered as text, not executed
    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(container.textContent).toContain('<script>');
  });

  it('should not render HTML in text', () => {
    const htmlText = '<img src="x" onerror="alert(1)">';
    const { container } = render(<SafeText text={htmlText} />);

    // img tag should be rendered as text, not as an element
    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(container.textContent).toContain('<img');
  });

  it('should not render links in text', () => {
    const linkText = '<a href="javascript:alert(1)">Click</a>';
    const { container } = render(<SafeText text={linkText} />);

    expect(container.querySelector('a')).not.toBeInTheDocument();
    expect(container.textContent).toContain('<a href');
  });
});
