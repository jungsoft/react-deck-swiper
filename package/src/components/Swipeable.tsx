import * as React from 'react';
import { Spring } from 'react-spring';

import directionEnum from '../constants/direction';
import {
  getDirection,
  getOpacity,
  getOffset,
  withX,
  getLimitOffset,
} from '../utils/helpers';

const SWIPE_CONFIG = {
  tension: 390,
  friction: 30,
  restSpeedThreshold: 1,
  restDisplacementThreshold: 0.01,
  overshootClamping: true,
  lastVelocity: 1,
  mass: 0.1,
};

const INITIAL_STATE = {
  start: 0,
  offset: 0,
  forced: false,
  swiped: false,
  moving: false,
  pristine: true,
};

export interface RenderButtonsPayload {
  right: () => void,
  left: () => void,
}

export interface SwipeableProps {
  renderButtons?: (payload: RenderButtonsPayload) => React.Component,
  onBeforeSwipe: (
    forceSwipe: (direction) => void,
    cancelSwipe: () => void,
    direction: directionEnum,
  ) => void,
  onSwipe: (
    direction: directionEnum,
  ) => void,
  onAfterSwipe: () => void,
  children: React.ReactChild,
  wrapperHeight: string,
  wrapperWidth: string,
  limit: number,
  min: number,
}

export interface SwipeableState {
  pristine: boolean,
  moving: boolean,
  forced: boolean,
  swiped: boolean,
  offset: number,
  start: number,
}

const Swipeable = ({
  wrapperHeight = '100%',
  wrapperWidth = '100%',
  renderButtons,
  onBeforeSwipe,
  onAfterSwipe,
  limit = 120,
  min = 40,
  children,
  onSwipe,
}: SwipeableProps) => {
  const [state, setState] = React.useState<SwipeableState>(INITIAL_STATE);

  const handleOnCancelSwipe = () => setState((prev) => ({
    ...prev,
    start: 0,
    offset: 0,
    moving: false,
  }));

  const handleOnDragStart = withX((start: number) => {
    if (state.swiped) {
      return;
    }

    setState((prev) => ({
      ...prev,
      pristine: false,
      moving: true,
      start,
    }));
  });

  const handleOnDragMove = withX((end: number) => {
    if (state.swiped || !state.moving) {
      return;
    }

    setState((prev) => ({
      ...prev,
      offset: getOffset(state.start, end),
    }));
  });

  const handleOnSwipe = (direction: directionEnum) => {
    if (onSwipe) {
      onSwipe(direction);
    }

    setState((prev) => ({
      ...prev,
      offset: getLimitOffset(limit, direction),
      moving: false,
      swiped: true,
    }));
  };

  const handleOnBeforeSwipe = (direction: directionEnum) => {
    if (!onBeforeSwipe) {
      handleOnSwipe(direction);
      return;
    }

    onBeforeSwipe(
      (_direction: directionEnum) => handleOnSwipe(_direction || direction),
      handleOnCancelSwipe,
      direction,
    );
  };

  const handleOnAfterSwipe = () => {
    setState(INITIAL_STATE);

    if (onAfterSwipe) {
      onAfterSwipe();
    }
  };

  const handleOnDragEnd = () => {
    if (state.swiped || !state.moving) {
      return;
    }

    if (Math.abs(state.offset) >= limit) {
      handleOnBeforeSwipe(getDirection(state.offset));
      return;
    }

    handleOnCancelSwipe();
  };

  const handleForceSwipe = (direction: directionEnum) => {
    if (state.swiped) {
      return;
    }

    setState((prev) => ({
      ...prev,
      pristine: false,
      forced: true,
    }));

    handleOnBeforeSwipe(direction);
  };

  React.useEffect(() => {
    window.addEventListener('touchmove', handleOnDragMove);
    window.addEventListener('mousemove', handleOnDragMove);
    window.addEventListener('touchend', handleOnDragEnd);
    window.addEventListener('mouseup', handleOnDragEnd);

    return () => {
      window.removeEventListener('touchmove', handleOnDragMove);
      window.removeEventListener('mousemove', handleOnDragMove);
      window.removeEventListener('touchend', handleOnDragEnd);
      window.removeEventListener('mouseup', handleOnDragEnd);
    };
  }, []);

  return (
    <>
      <Spring
        from={{ offset: 0, opacity: 1 }}
        to={{
          opacity: getOpacity(state.offset, limit, min),
          offset: state.offset,
        }}
        immediate={state.pristine || (!state.forced && Math.abs(state.offset) >= limit)}
        onRest={() => state.swiped && handleOnAfterSwipe()}
        config={SWIPE_CONFIG}
      >
        {({ offset, opacity }) => (
          <div
            style={{
              opacity,
              transform: `translateX(${offset}px) rotate(${offset / 10}deg)`,
              height: wrapperHeight,
              width: wrapperWidth,
            }}
            onTouchStart={handleOnDragStart}
            onMouseDown={handleOnDragStart}
          >
            {children}
          </div>
        )}
      </Spring>
      {
      renderButtons && (
        renderButtons({
          right: () => handleForceSwipe(directionEnum.RIGHT),
          left: () => handleForceSwipe(directionEnum.LEFT),
        })
      )
      }
    </>
  );
};

export default Swipeable;
