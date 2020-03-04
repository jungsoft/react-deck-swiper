import * as React from 'react';
import { useSpring, animated } from 'react-spring';

// eslint-disable-next-line no-unused-vars
import { SwipeableWrapperProps, SwipeableState } from './SwipeableWrapper';

import directionEnum from '../constants/direction';
import { getOpacity } from '../utils/helpers';

const SWIPE_CONFIG = {
  tension: 390,
  friction: 30,
  restSpeedThreshold: 1,
  restDisplacementThreshold: 0.01,
  overshootClamping: true,
  lastVelocity: 1,
  mass: 0.1,
};

export interface SwipeableProps extends SwipeableWrapperProps {
  handleForceSwipe: (direction: directionEnum) => void,
  handleOnDragStart: (e: any) => any,
  handleOnAfterSwipe: () => void,
  state: SwipeableState,
}

const Swipeable = ({
  wrapperHeight = '100%',
  wrapperWidth = '100%',
  handleOnAfterSwipe,
  handleOnDragStart,
  handleForceSwipe,
  renderButtons,
  limit = 120,
  min = 40,
  children,
  state,
}: SwipeableProps) => {
  const springProps = useSpring({
    immediate: state.pristine || (!state.forced && Math.abs(state.offset) >= limit),
    onRest: () => state.swiped && handleOnAfterSwipe(),
    config: SWIPE_CONFIG,
    from: {
      opacity: 1,
      offset: 0,
    },
    to: {
      opacity: getOpacity(state.offset, limit, min),
      offset: state.offset,
    },
  });

  // HACK: react-spring doesn't support Typescript in @8.0.0,
  // so we can't access properties from useSpring.

  // eslint-disable-next-line
  const opacity = springProps['opacity'];

  // eslint-disable-next-line
  const offset = springProps['offset'];

  const animatedStyle = {
    transform: `translateX(${offset}px) rotate(${parseFloat(String(offset)) / 10}deg)`,
    height: wrapperHeight,
    width: wrapperWidth,
    opacity,
  };

  return (
    <>
      <animated.div
        onTouchStart={handleOnDragStart}
        onMouseDown={handleOnDragStart}
        style={animatedStyle}
      >
        {children}
      </animated.div>

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
