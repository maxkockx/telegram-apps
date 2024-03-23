/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface ProfileColoredSquare32Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default 32
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const ProfileColoredSquare32: Component<ProfileColoredSquare32Props> = (props) => {
  const merged = mergeProps({ size: 32 }, props);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" width={merged.size} height={merged.size} {...props}><path fill="#008AFF" d="M1 10.6c0-3.36 0-5.04.654-6.324a6 6 0 0 1 2.622-2.622C5.56 1 7.24 1 10.6 1h10.8c3.36 0 5.04 0 6.324.654a6 6 0 0 1 2.622 2.622C31 5.56 31 7.24 31 10.6v10.8c0 3.36 0 5.04-.654 6.324a6 6 0 0 1-2.622 2.622C26.44 31 24.76 31 21.4 31H10.6c-3.36 0-5.04 0-6.324-.654a6 6 0 0 1-2.622-2.622C1 26.44 1 24.76 1 21.4z"/><path fill="#fff" d="M17.959 13.276h4.532q.216 0 .365-.15.15-.149.15-.365a.47.47 0 0 0-.15-.357.5.5 0 0 0-.365-.15H17.96q-.225 0-.374.15a.47.47 0 0 0-.149.357q0 .216.15.366t.373.149m0 3.254h4.532q.216 0 .365-.15.15-.15.15-.373a.46.46 0 0 0-.15-.349.5.5 0 0 0-.365-.15H17.96q-.225 0-.374.15a.46.46 0 0 0-.149.349.507.507 0 0 0 .523.523m0 3.245h4.532a.5.5 0 0 0 .365-.14q.15-.15.15-.358a.5.5 0 0 0-.15-.365.48.48 0 0 0-.365-.158H17.96a.5.5 0 0 0-.374.158q-.15.15-.149.365 0 .208.15.357.15.141.373.141m-8.65.059h6.484q.198 0 .298-.125a.45.45 0 0 0 .108-.307q0-.3-.224-.756a3.4 3.4 0 0 0-.672-.93 3.6 3.6 0 0 0-1.138-.788q-.688-.315-1.618-.315t-1.619.315a3.8 3.8 0 0 0-1.137.789q-.448.465-.672.93-.216.456-.216.755 0 .183.1.307a.39.39 0 0 0 .307.125m3.238-3.802q.755 0 1.287-.565.53-.565.53-1.42 0-.53-.248-.97a1.9 1.9 0 0 0-.656-.706 1.63 1.63 0 0 0-.913-.266 1.66 1.66 0 0 0-.913.266 2 2 0 0 0-.664.706 2 2 0 0 0-.241.97q0 .856.531 1.42.54.565 1.287.565m-3.727 7.62q-1.303 0-1.96-.648-.646-.639-.647-1.917V10.943q0-1.287.648-1.925.656-.648 1.959-.648h14.36q1.312 0 1.96.648.646.647.647 1.925v10.144q0 1.278-.648 1.917-.647.648-1.959.648z"/></svg>
  );
}