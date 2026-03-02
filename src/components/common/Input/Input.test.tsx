import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import Input from '@/components/common/Input/Input';

describe('Input', () => {
  it('renders with label and value', () => {
    render(<Input label="Email" value="test@test.com" onChange={() => {}} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@test.com')).toBeInTheDocument();
  });

  it('calls onChange when value changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input label="Email" value="" onChange={onChange} />);

    await user.type(screen.getByLabelText(/email/i), 'a');

    expect(onChange).toHaveBeenCalled();
  });

  it('displays error message when error prop is provided', () => {
    render(<Input label="Email" value="" onChange={() => {}} error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });
});
