import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  containerRef: null,
  stickyRefs: new Map(),
  debug: false,
};

const initialDispatch = {
  setContainerRef: (_ref: any) => {},
  addStickyRef: (
    _topSentinelRef: any,
    _bottomSentinelRef: any,
    _stickyRef: any
  ) => {},
};

const StickyStateContext = createContext<{
  containerRef: any;
  stickyRefs: any;
  debug: boolean;
}>(initialState);
const StickyDispatchContext = createContext(initialDispatch);

const ActionType = {
  setContainerRef: 'set container ref',
  addStickyRef: 'add sticky ref',
  toggleDebug: 'toggle debug',
};

function reducer(state: any, action: any) {
  const { type, payload } = action;
  switch (type) {
    case ActionType.setContainerRef:
      // Reassigning a new ref, will infinitely re-load!
      return Object.assign(state, {
        containerRef: { current: payload.containerRef },
      });
    case ActionType.addStickyRef:
      const { topSentinelRef, bottomSentinelRef, stickyRef } = payload;

      state.stickyRefs.set(topSentinelRef.current, stickyRef);
      state.stickyRefs.set(bottomSentinelRef.current, stickyRef);

      return Object.assign(state, {
        stickyRefs: state.stickyRefs,
      });
    case ActionType.toggleDebug:
      return { ...state, debug: !state.debug };
    default:
      return state;
  }
}

function StickyProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setContainerRef = (containerRef: any) =>
    dispatch({ type: ActionType.setContainerRef, payload: { containerRef } });

  const addStickyRef = (
    topSentinelRef: any,
    bottomSentinelRef: any,
    stickyRef: any
  ) =>
    dispatch({
      type: ActionType.addStickyRef,
      payload: { topSentinelRef, bottomSentinelRef, stickyRef },
    });

  const toggleDebug = () => dispatch({ type: ActionType.toggleDebug });

  const actions: any = {
    setContainerRef,
    addStickyRef,
    toggleDebug,
  };

  return (
    <StickyStateContext.Provider value={state}>
      <StickyDispatchContext.Provider value={actions}>
        {children}
      </StickyDispatchContext.Provider>
    </StickyStateContext.Provider>
  );
}

function useStickyState() {
  const context = useContext(StickyStateContext);
  if (context === undefined)
    throw Error('"useStickyState should be used under "StickyStateContext');
  return context;
}

function useStickyActions() {
  const context = useContext(StickyDispatchContext);
  if (context === undefined)
    throw Error(
      '"useStickyActions should be used under "StickyDispatchContext'
    );
  return context;
}

const initialSectionValues = {
  topSentinelRef: null,
  bottomSentinelRef: null,
};

const StickySectionContext = createContext<{
  topSentinelRef: any;
  bottomSentinelRef: any;
}>(initialSectionValues);

export {
  StickyProvider,
  useStickyState,
  useStickyActions,
  ActionType,
  StickySectionContext,
};
