import React, { ComponentType } from 'react';

import { useViewport } from './useViewport.js';
import type { Viewport } from './types.js';

/**
 * HOC which passes Viewport SDK component to wrapped React component.
 * @param Component - component to wrap.
 */
export function withViewport<P extends { viewport?: Viewport }>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, 'viewport'>> {
  return function WithViewport(props: Omit<P, 'viewport'>) {
    const p = { ...props, viewport: useViewport() } as P;

    return <Component {...p} />;
  };
}
