import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Exam from '@components/Modules/ExamModule';

// Mock the Bubble component to isolate Exam component for testing
jest.mock('@components/BubbleSheet/Bubbles', () => ({ question, theme }) => (
  <div data-testid="mock-bubble">{`Bubble for question ${question.question_num} with theme ${theme}`}</div>
));

describe('ExamModule', () => {
  const mockQuestion = {
    question_num: 1,
    num_options: 4,
    weight: 5,
    correct_answer: [1, 2],
    response: [1, 2],
    issue: null,
  };

  const mockTheme = 'light';
  const mockHandleFlagClick = jest.fn();
  const mockExamKey = 'exam-1';

  const renderComponent = (props = {}) => {
    return render(
      <table>
        <tbody>
          <Exam
            question={mockQuestion}
            theme={mockTheme}
            handleFlagClick={mockHandleFlagClick}
            examKey={mockExamKey}
            {...props}
          />
        </tbody>
      </table>
    );
  };

  test('renders question details correctly', () => {
    renderComponent();

    expect(screen.getByText(mockQuestion.question_num)).toBeInTheDocument();
    expect(screen.getByText(mockQuestion.num_options)).toBeInTheDocument();
    expect(screen.getAllByText(mockQuestion.weight)).toHaveLength(2); // Adjusted to use getAllByText
  });

  test('renders Bubble component correctly', () => {
    renderComponent();

    expect(screen.getByTestId('mock-bubble')).toBeInTheDocument();
    expect(screen.getByTestId('mock-bubble')).toHaveTextContent(`Bubble for question ${mockQuestion.question_num} with theme ${mockTheme}`);
  });

  test('calculates and displays the correct weight', () => {
    renderComponent();

    expect(screen.getAllByText(mockQuestion.weight)).toHaveLength(2); // Adjusted to use getAllByText
  });

  test('displays 0 weight if the answer is incorrect', () => {
    const incorrectResponse = {
      ...mockQuestion,
      response: [1, 3], // incorrect response
    };

    renderComponent({ question: incorrectResponse });

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('renders flag icon and handles flag click correctly', () => {
    renderComponent();

    const flagIcon = screen.getByRole('img', { hidden: true });
    expect(flagIcon).toBeInTheDocument();

    fireEvent.click(flagIcon);
    expect(mockHandleFlagClick).toHaveBeenCalledWith(mockQuestion);
  });

  test('displays issue text if present', () => {
    const issueQuestion = {
      ...mockQuestion,
      issue: 'Some issue',
    };

    renderComponent({ question: issueQuestion });

    expect(screen.getByText('Some issue')).toBeInTheDocument();
  });
});
