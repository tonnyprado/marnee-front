/**
 * CustomSelect Component Tests
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomSelect, { CustomMultiSelect } from '../../../Component/ui/CustomSelect';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    svg: ({ children, ...props }) => <svg {...props}>{children}</svg>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const optionsWithColors = [
  { value: 'red', label: 'Red', color: '#ff0000' },
  { value: 'green', label: 'Green', color: '#00ff00' },
  { value: 'blue', label: 'Blue', color: '#0000ff' },
];

const optionsWithDescriptions = [
  { value: 'basic', label: 'Basic', description: 'Basic plan' },
  { value: 'pro', label: 'Pro', description: 'Professional plan' },
];

describe('CustomSelect', () => {
  describe('basic rendering', () => {
    it('should render with placeholder', () => {
      render(
        <CustomSelect
          value=""
          onChange={() => {}}
          options={defaultOptions}
          placeholder="Select an option"
        />
      );

      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should render with selected value', () => {
      render(
        <CustomSelect
          value="option2"
          onChange={() => {}}
          options={defaultOptions}
        />
      );

      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should render label when provided', () => {
      render(
        <CustomSelect
          value=""
          onChange={() => {}}
          options={defaultOptions}
          label="Choose option"
        />
      );

      expect(screen.getByText('Choose option')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <CustomSelect
          value=""
          onChange={() => {}}
          options={defaultOptions}
          className="custom-class"
        />
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('dropdown behavior', () => {
    it('should open dropdown on click', async () => {
      
      render(
        <CustomSelect
          value=""
          onChange={() => {}}
          options={defaultOptions}
          placeholder="Select"
        />
      );

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should close dropdown when option is selected', async () => {
            const onChange = jest.fn();

      render(
        <CustomSelect
          value=""
          onChange={onChange}
          options={defaultOptions}
        />
      );

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 2'));

      expect(onChange).toHaveBeenCalledWith('option2');
    });

    it('should close dropdown on click outside', async () => {
      
      render(
        <div>
          <CustomSelect
            value=""
            onChange={() => {}}
            options={defaultOptions}
          />
          <div data-testid="outside">Outside</div>
        </div>
      );

      // Open dropdown
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      // Click outside
      fireEvent.mouseDown(screen.getByTestId('outside'));

      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });

    it('should close dropdown on Escape key', async () => {
      
      render(
        <CustomSelect
          value=""
          onChange={() => {}}
          options={defaultOptions}
        />
      );

      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('disabled state', () => {
    it('should not open when disabled', async () => {
      
      render(
        <CustomSelect
          value=""
          onChange={() => {}}
          options={defaultOptions}
          disabled
        />
      );

      fireEvent.click(screen.getByRole('button'));

      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('should have disabled styling', () => {
      render(
        <CustomSelect
          value=""
          onChange={() => {}}
          options={defaultOptions}
          disabled
        />
      );

      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('color dots', () => {
    it('should show color dot when showColorDot is true', async () => {
      
      const { container } = render(
        <CustomSelect
          value="red"
          onChange={() => {}}
          options={optionsWithColors}
          showColorDot
        />
      );

      // Check for color dot in selected value
      const colorDot = container.querySelector('span[style*="background-color"]');
      expect(colorDot).toBeInTheDocument();
    });

    it('should not show color dot when showColorDot is false', () => {
      const { container } = render(
        <CustomSelect
          value="red"
          onChange={() => {}}
          options={optionsWithColors}
          showColorDot={false}
        />
      );

      const colorDot = container.querySelector('span[style*="background-color"]');
      expect(colorDot).not.toBeInTheDocument();
    });
  });

  describe('descriptions', () => {
    it('should show descriptions in dropdown', async () => {
      
      render(
        <CustomSelect
          value=""
          onChange={() => {}}
          options={optionsWithDescriptions}
        />
      );

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByText('Basic plan')).toBeInTheDocument();
      expect(screen.getByText('Professional plan')).toBeInTheDocument();
    });
  });

  describe('empty options', () => {
    it('should show no options message', async () => {
      
      render(
        <CustomSelect
          value=""
          onChange={() => {}}
          options={[]}
        />
      );

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByText('No options available')).toBeInTheDocument();
    });
  });

  describe('selection indicator', () => {
    it('should show checkmark for selected option', async () => {
      
      const { container } = render(
        <CustomSelect
          value="option2"
          onChange={() => {}}
          options={defaultOptions}
        />
      );

      fireEvent.click(screen.getByRole('button'));

      // The selected option should have a checkmark (svg with check path)
      const buttons = container.querySelectorAll('button');
      const selectedButton = Array.from(buttons).find(btn =>
        btn.textContent.includes('Option 2')
      );

      expect(selectedButton?.querySelector('svg')).toBeInTheDocument();
    });
  });
});

describe('CustomMultiSelect', () => {
  describe('basic rendering', () => {
    it('should render with placeholder when no selection', () => {
      render(
        <CustomMultiSelect
          value={[]}
          onChange={() => {}}
          options={defaultOptions}
          placeholder="Select options"
        />
      );

      expect(screen.getByText('Select options')).toBeInTheDocument();
    });

    it('should show count badge', () => {
      render(
        <CustomMultiSelect
          value={['option1', 'option2']}
          onChange={() => {}}
          options={defaultOptions}
        />
      );

      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should show selected labels', () => {
      render(
        <CustomMultiSelect
          value={['option1', 'option2']}
          onChange={() => {}}
          options={defaultOptions}
        />
      );

      expect(screen.getByText('Option 1, Option 2')).toBeInTheDocument();
    });

    it('should render label when provided', () => {
      render(
        <CustomMultiSelect
          value={[]}
          onChange={() => {}}
          options={defaultOptions}
          label="Select multiple"
        />
      );

      expect(screen.getByText('Select multiple')).toBeInTheDocument();
    });
  });

  describe('selection behavior', () => {
    it('should add item to selection', async () => {
            const onChange = jest.fn();

      render(
        <CustomMultiSelect
          value={[]}
          onChange={onChange}
          options={defaultOptions}
        />
      );

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 1'));

      expect(onChange).toHaveBeenCalledWith(['option1']);
    });

    it('should remove item from selection', async () => {
            const onChange = jest.fn();

      render(
        <CustomMultiSelect
          value={['option1', 'option2']}
          onChange={onChange}
          options={defaultOptions}
        />
      );

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 1'));

      expect(onChange).toHaveBeenCalledWith(['option2']);
    });

    it('should keep dropdown open after selection', async () => {
      
      render(
        <CustomMultiSelect
          value={[]}
          onChange={() => {}}
          options={defaultOptions}
        />
      );

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 1'));

      // Dropdown should still be visible
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('checkbox indicators', () => {
    it('should show checkbox for each option', async () => {
      
      const { container } = render(
        <CustomMultiSelect
          value={['option1']}
          onChange={() => {}}
          options={defaultOptions}
        />
      );

      fireEvent.click(screen.getByRole('button'));

      // Selected option should have filled checkbox with checkmark
      const checkboxes = container.querySelectorAll('span[class*="rounded"]');
      expect(checkboxes.length).toBeGreaterThan(0);
    });
  });

  describe('disabled state', () => {
    it('should not open when disabled', async () => {
      
      render(
        <CustomMultiSelect
          value={[]}
          onChange={() => {}}
          options={defaultOptions}
          disabled
        />
      );

      fireEvent.click(screen.getByRole('button'));

      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  describe('color dots', () => {
    it('should show color dots when showColorDot is true', async () => {
      
      const { container } = render(
        <CustomMultiSelect
          value={[]}
          onChange={() => {}}
          options={optionsWithColors}
          showColorDot
        />
      );

      fireEvent.click(screen.getByRole('button'));

      const colorDots = container.querySelectorAll('span[style*="background-color"]');
      expect(colorDots.length).toBe(3);
    });
  });

  describe('click outside', () => {
    it('should close dropdown on click outside', async () => {
      
      render(
        <div>
          <CustomMultiSelect
            value={[]}
            onChange={() => {}}
            options={defaultOptions}
          />
          <div data-testid="outside">Outside</div>
        </div>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      fireEvent.mouseDown(screen.getByTestId('outside'));

      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });
  });
});
