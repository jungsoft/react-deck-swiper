import * as React from 'react';

// eslint-disable-next-line no-unused-vars
import directionEnum from '../constants/direction';

import {
  getDirection,
  getOffset,
  withX,
  getLimitOffset,
} from '../utils/helpers';

import Swipeable from './Swipeable';

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

export interface SwipeableWrapperProps {
  children: React.ReactChild,
  renderButtons?: (payload: RenderButtonsPayload) => React.Component,
  onBeforeSwipe?: (
    forceSwipe: (direction) => void,
    cancelSwipe: () => void,
    direction: directionEnum,
  ) => void,
  onSwipe?: (
    direction: directionEnum,
  ) => void,
  onAfterSwipe?: () => void,
  wrapperHeight?: string,
  wrapperWidth?: string,
  limit?: number,
  min?: number,
}

export interface SwipeableState {
  pristine: boolean,
  moving: boolean,
  forced: boolean,
  swiped: boolean,
  offset: number,
  start: number,
}

const SwipeableWrapper = (props: SwipeableWrapperProps) => {
  const [state, setState] = React.useState<SwipeableState>(INITIAL_STATE);

  const {
    onBeforeSwipe,
    onAfterSwipe,
    limit = 120,
    onSwipe,
  } = props;

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
    <Swipeable
      handleOnAfterSwipe={handleOnAfterSwipe}
      handleOnDragStart={handleOnDragStart}
      handleForceSwipe={handleForceSwipe}
      state={state}
      {...props}
    />
  );
};

export default SwipeableWrapper;
