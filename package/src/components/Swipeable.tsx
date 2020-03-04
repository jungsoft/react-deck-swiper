import * as React from 'react';
import { Spring } from 'react-spring';

// eslint-disable-next-line no-unused-vars
import { RenderButtonsPayload, SwipeableWrapperProps, SwipeableState } from './SwipeableWrapper';

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
}: SwipeableProps) => (
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

export default Swipeable;
