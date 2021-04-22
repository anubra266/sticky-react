import { useState, useEffect } from 'react';

import { useStickyState } from './Context';

function useSentinelOffsets(topSentinelRef: any) {
  const { stickyRefs } = useStickyState();
  const [bottomSentinelHeight, setBottomSentinelHeight] = useState('');
  const [topSentinelMarginTop, setTopSentinelMarginTop] = useState('');

  // Move the sentinel up by the top margin of the sticky component
  useEffect(() => {
    const stickyNode = stickyRefs.get(topSentinelRef.current);

    const topStyle = window.getComputedStyle(stickyNode);
    const getProp = (name: any) => topStyle.getPropertyValue(name);
    const paddingtop = getProp('padding-top');
    const paddingBottom = getProp('padding-bottom');
    const height = getProp('height');
    const marginTop = getProp('margin-top');

    const bottomSentinelHeight = `calc(${marginTop} +
        ${paddingtop} +
        ${height} +
        ${paddingBottom})`;

    setBottomSentinelHeight(bottomSentinelHeight);
    setTopSentinelMarginTop(marginTop);
  }, [stickyRefs, topSentinelRef]);

  return { bottomSentinelHeight, topSentinelMarginTop };
}

/**
 * Observe the TOP sentinel and dispatch sticky events
 * @param {React.MutableRefObject<T>} topSentinelRef Ref to underlying TOP sentinel
 */
// https://developers.google.com/web/updates/2017/09/sticky-headers
function useObserveTopSentinels(
  topSentinelRef: any,
  {
    /**
     * @param {Function} onStuck dispatched when TOP sentinel is unstuck
     * @param {Function} onUnstuck dispatched when TOP sentinel is stuck
     * @param {Function} onChange dispatched when TOP sentinel is either stuck or unstuck
     */
    events: { onStuck, onUnstuck, onChange },
  }: any
) {
  const { stickyRefs, containerRef } = useStickyState();

  useEffect(() => {
    if (!containerRef) return;
    if (!containerRef?.current) return;

    const root = containerRef?.current;
    const options = { threshold: [0], root };

    const observer = new IntersectionObserver((entries: any[]) => {
      entries.forEach(entry => {
        const target = stickyRefs.get(entry.target);
        const targetInfo = entry.boundingClientRect;
        const rootBoundsInfo = entry.rootBounds;

        let type = undefined;
        // Started sticking.
        if (targetInfo.bottom < rootBoundsInfo?.top) {
          type = 'stuck';
          onStuck(target);
        }

        // Stopped sticking.
        if (
          targetInfo.bottom >= rootBoundsInfo.top &&
          targetInfo.bottom < rootBoundsInfo.bottom
        ) {
          type = 'unstuck';
          onUnstuck(target);
        }

        type && onChange({ type, target });
      });
    }, options);

    const sentinel = topSentinelRef.current;
    sentinel && observer.observe(sentinel);
    return () => {
      observer.unobserve(sentinel);
    };
  }, [topSentinelRef, onChange, onStuck, onUnstuck, stickyRefs, containerRef]);
}

/**
 * Observe the BOTTOM sentinel and dispatch sticky events
 * @param {React.MutableRefObject<T>} topSentinelRef Ref to underlying BOTTOM sentinel
 */
function useObserveBottomSentinels(
  bottomSentinelRef: any,
  {
    /**
     * @param {Function} onStuck dispatched when TOP sentinel is unstuck
     * @param {Function} onUnstuck dispatched when TOP sentinel is stuck
     * @param {Function} onChange dispatched when TOP sentinel is either stuck or unstuck
     */ events: { onStuck, onUnstuck, onChange },
  }: any
) {
  const { stickyRefs, containerRef } = useStickyState();

  useEffect(() => {
    if (!containerRef) return;
    if (!containerRef.current) return;

    const root = containerRef.current;
    const options = { threshold: [1], root };

    const observer = new IntersectionObserver((entries: any[]) => {
      entries.forEach(entry => {
        const target = stickyRefs.get(entry.target);
        const targetRect = target?.getBoundingClientRect();
        const bottomSentinelRect = entry.boundingClientRect;
        const rootBounds = entry.rootBounds;
        const intersectionRatio = entry.intersectionRatio;

        let type = undefined;

        if (
          bottomSentinelRect.top >= rootBounds?.top &&
          bottomSentinelRect.bottom <= rootBounds?.bottom &&
          intersectionRatio === 1 &&
          targetRect?.y === 0
        ) {
          type = 'stuck';
          onStuck(target);
        }

        if (bottomSentinelRect.top <= rootBounds.top) {
          type = 'unstuck';
          onUnstuck(target);
        }

        type && onChange({ type, target });
      });
    }, options);

    const sentinel = bottomSentinelRef.current;
    sentinel && observer.observe(sentinel);
    return () => {
      observer.unobserve(sentinel);
    };
  }, [
    bottomSentinelRef,
    onChange,
    onStuck,
    onUnstuck,
    stickyRefs,
    containerRef,
  ]);
}

export {
  useSentinelOffsets,
  useObserveTopSentinels,
  useObserveBottomSentinels,
};
