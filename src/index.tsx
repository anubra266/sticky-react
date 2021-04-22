import React, {
  ReactChildren,
  ReactElement,
  ReactNode,
  useContext,
  useRef,
} from 'react';

import {
  useStickyActions,
  StickySectionContext,
  StickyProvider,
} from './Context';

import {
  useObserveTopSentinels,
  useObserveBottomSentinels,
  // useSentinelOffsets,
} from './hooks';

/**
 * Make the element sticky
 */
function Sticky({ as = 'div', ...rest }: { as?: any }) {
  const { topSentinelRef, bottomSentinelRef } = useContext(
    StickySectionContext
  );
  const dispatch = useStickyActions();

  const Component = as;
  // So that we can retrieve correct child target element
  // from either a top sentinel or a bottom sentinel
  const addStickyRef = (stickyRef: any) => {
    dispatch.addStickyRef(topSentinelRef, bottomSentinelRef, stickyRef);
  };

  return (
    <Component
      ref={addStickyRef}
      style={{ position: 'sticky', top: 0 }}
      {...rest}
    />
  );
}

const noop = () => {};

/**
 * A section, in which <Sticky /> element element is observed
 */
type StickyBoundary = {
  as?: any;
  onChange?: (target?: ReactNode) => void;
  onStuck?: (target?: ReactNode) => void;
  onUnstuck?: (target?: ReactNode) => void;
  children: ReactElement<any>;
};
function StickyBoundary({
  as = 'section',
  onChange = noop,
  onStuck = noop,
  onUnstuck = noop,
  children,
  ...rest
}: StickyBoundary) {
  const Component = as;

  const topSentinelRef = useRef(null);
  const bottomSentinelRef = useRef(null);

  //   const { bottomSentinelHeight, topSentinelMarginTop } = useSentinelOffsets(
  //     topSentinelRef
  //   );

  useObserveTopSentinels(topSentinelRef, {
    events: {
      onChange,
      onStuck,
      onUnstuck,
    },
  });

  useObserveBottomSentinels(bottomSentinelRef, {
    events: {
      onChange,
      onStuck,
      onUnstuck,
    },
  });

  const value = { topSentinelRef, bottomSentinelRef };

  return (
    <StickySectionContext.Provider value={value}>
      <Component style={{ position: 'relative' }} {...rest}>
        <div
          ref={topSentinelRef}
          //   style={{ marginTop: `-${topSentinelMarginTop}` }}
        />
        {children}
        <div
          ref={bottomSentinelRef}
          //   style={{
          //     height: `${bottomSentinelHeight}`,
          //   }}
        />
      </Component>
    </StickySectionContext.Provider>
  );
}

/**
 * Ref to the sticky viewport
 */
function StickyRoot({ as: Component = 'div', ...rest }: any) {
  const dispatch = useStickyActions();

  const addContainerRef: any = (containerRef: any) => {
    dispatch.setContainerRef(containerRef);
  };

  return <Component ref={addContainerRef} {...rest} />;
}

/**
 * Provides sticky context to the sticky component tree.
 */
function StickyViewport({
  children,
  as = 'div',
  ...rest
}: {
  children: ReactChildren;
  as?: any;
}) {
  return (
    <StickyProvider>
      <StickyRoot as={as} {...rest}>
        {children}
      </StickyRoot>
    </StickyProvider>
  );
}

export { StickyViewport, StickyBoundary, Sticky };
