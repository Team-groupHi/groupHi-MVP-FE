import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useToast } from '@/hooks/useToast';
import { ToastAction, ToastActionElement, Toaster } from '@/components';

const TOAST_TIMEOUT = 1000;
const TestToast = ({
  variant,
  action,
}: {
  variant?: 'default' | 'success' | 'destructive';
  action?: ToastActionElement;
}) => {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: 'Test Toast',
      description: 'This is a test toast message.',
      variant,
      action,
      duration: TOAST_TIMEOUT,
    });
  };

  return (
    <div>
      <button onClick={showToast}>Show Toast</button>
      <Toaster />
    </div>
  );
};

describe('Toast 컴포넌트', () => {
  test('1) 버튼이 트리거 되면 Toast를 렌더링한다', () => {
    render(<TestToast />);

    const button = screen.getByText('Show Toast');
    fireEvent.click(button);

    const toast = screen.getByText('Test Toast');
    expect(toast).toBeInTheDocument();
  });

  test('2) variant="success"를 전달하면 success Toast를 렌더링한다', () => {
    render(<TestToast variant="success" />);

    const button = screen.getByText('Show Toast');
    fireEvent.click(button);

    const toast = screen.getAllByTestId('toast')[1];
    expect(toast).toHaveClass('success');
  });

  const TEST_TIMEOUT = TOAST_TIMEOUT + 200;

  test(
    '3) 일정 시간이 지나면 토스트가 사라진다',
    async () => {
      render(<TestToast />);

      const button = screen.getByText('Show Toast');
      fireEvent.click(button);

      const toast = screen.getAllByText('Test Toast')[0];
      expect(toast).toBeInTheDocument();

      await new Promise((resolve) => setTimeout(resolve, TOAST_TIMEOUT));
      expect(toast).not.toBeInTheDocument();
    },
    TEST_TIMEOUT
  );

  test('4) action을 전달하면 버튼이 생성된다', () => {
    render(
      <>
        <TestToast
          action={<ToastAction altText={'action'}>Action</ToastAction>}
        />
      </>
    );

    const button = screen.getByText('Show Toast');
    fireEvent.click(button);

    const toastAction = screen.getByText('Action');
    expect(toastAction).toBeInTheDocument();
  });
});