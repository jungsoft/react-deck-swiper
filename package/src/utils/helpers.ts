export const getDirection = (offset: number) => (offset > 0 ? 'right' : 'left');

export const getOffset = (start: number, end: number) => -((start - end) * 0.75);

export const getEvent = (e: any) => (e.touches ? e.touches[0] : e);

export const withX = (fn: any) => (e: any) => fn(getEvent(e).pageX);

export const getLimitOffset = (limit: number, direction: string) => (direction === 'right' ? limit : -limit);

export const getOpacity = (offset: number, limit: number, min: number) => (
  1 - (
    Math.abs(offset) < min
      ? 0
      : (Math.abs(offset) - min) / Math.abs(limit - min)
  )
);
