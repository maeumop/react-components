import { useMemo } from 'react';

export const ErrorMessage = ({
  message,
  errorTransition,
  onAnimationEnd,
}: {
  message: string;
  errorTransition: boolean;
  onAnimationEnd: (e: React.AnimationEvent<HTMLDivElement>) => void;
}) => {
  const feedbackStatus = useMemo(() => {
    return ['feedback', errorTransition ? 'error' : ''].join(' ').trim();
  }, [errorTransition]);

  return (
    <div className={feedbackStatus} onAnimationEnd={onAnimationEnd}>
      {message}
    </div>
  );
};
