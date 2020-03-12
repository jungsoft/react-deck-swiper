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
    forceSwipe: (direction: directionEnum) => void,
    cancelSwipe: () => void,
    direction: directionEnum,
  ) => void,
  onSwipe?: (
    direction: directionEnum,
  ) => void,
  onOpacityChange?: (opacity: number) => void,
  onAfterSwipe?: () => void,
  wrapperHeight?: string,
  wrapperWidth?: string,
  swipeThreshold?: number,
  fadeThreshold?: number,
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

  const stateRef = React.useRef(state);

  stateRef.current = state;

  const {
    swipeThreshold = 120,
    onBeforeSwipe,
    onAfterSwipe,
    onSwipe,
  } = props;

  const handleResetState = () => {
    setState(INITIAL_STATE);

    setState({
      ...stateRef.current,
      offset: 0,
      start: 0,
    });
  };

  const handleOnAfterSwipe = () => {
    if (onAfterSwipe) {
      onAfterSwipe();
    }

    handleResetState();
  };

  const handleOnSwipe = (direction: directionEnum) => {
    if (onSwipe) {
      onSwipe(direction);
    }

    setState({
      ...stateRef.current,
      offset: getLimitOffset(swipeThreshold, direction),
      moving: false,
      swiped: true,
    });

    handleOnAfterSwipe();
  };

  const handleOnBeforeSwipe = (direction: directionEnum) => {
    if (!onBeforeSwipe) {
      handleOnSwipe(direction);
      return;
    }

    onBeforeSwipe(
      (_direction: directionEnum) => handleOnSwipe(_direction || direction),
      handleResetState,
      direction,
    );
  };

  const handleOnDragStart = withX((start: number) => {
    if (stateRef.current.swiped) {
      return;
    }

    setState({
      ...stateRef.current,
      pristine: false,
      moving: true,
      start,
    });
  });

  const handleOnDragEnd = () => {
    if (stateRef.current.swiped || !stateRef.current.moving) {
      return;
    }

    if (Math.abs(stateRef.current.offset) >= swipeThreshold) {
      handleOnBeforeSwipe(getDirection(stateRef.current.offset));
      return;
    }

    handleResetState();
  };

  const handleOnDragMove = withX((end: number) => {
    if (stateRef.current.swiped || !stateRef.current.moving) {
      return;
    }

    setState({
      ...stateRef.current,
      offset: getOffset(stateRef.current.start, end),
    });
  });

  const handleForceSwipe = (direction: directionEnum) => {
    if (stateRef.current.swiped) {
      return;
    }

    setState({
      ...stateRef.current,
      pristine: false,
      forced: true,
    });

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
      handleOnDragStart={handleOnDragStart}
      handleForceSwipe={handleForceSwipe}
      state={stateRef.current}
      {...props}
    />
  );
};

export default SwipeableWrapper;
