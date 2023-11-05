# @tma.js/sdk

[npm-link]: https://npmjs.com/package/@tma.js/sdk

[npm-shield]: https://img.shields.io/npm/v/@tma.js/sdk?logo=npm

![[npm-link]][npm-shield]

Made from scratch TypeScript library for seamless communication with Telegram Mini Apps
functionality.

The code of this library is designed to simplify the process of developers interacting with Telegram
Mini Apps. It consists of several individual components, each responsible for a specific aspect of
the Telegram Mini Apps ecosystem.

Before you begin using the SDK, we highly recommend familiarizing yourself with the Telegram Mini
Apps [documentation](../../../about-platform.md) to grasp the fundamental concepts of the platform.

## Installation

::: code-group

```bash [pnpm]
pnpm i @tma.js/sdk
```

```bash [npm]
npm i @tma.js/sdk
```

```bash [yarn]
yarn add @tma.js/sdk
```

:::

## Initialization

According to the design of this package, the developer has complete control over its lifecycle,
including the initialization process. This means that there are no pre-initialized global components
available for use by the developer. They must create the components themselves.

To simplify the developer's workflow, the package includes a special function called `init`. This
function returns instances of the initialized components, making it easier for developers to work
with the package.

```typescript
import { init } from '@tma.js/sdk';

init().then(components => {
  const { mainButton, viewport } = components;

  mainButton.on('click', () => viewport.expand());

  mainButton
    .setBackgroundColor('#ff0000')
    .setTextColor('#ffffff')
    .setText('Expand')
    .enable()
    .show();
});
```

### Options

The `init` function has the ability to accept options, which are specified as an object in the first
argument of the function. Each option and the options object itself are optional.

```typescript
import { init } from '@tma.js/sdk';

init(options);
```

#### `debug: boolean`

Enables the debug mode, which results in printing more debugging information sent by the SDK.

#### `launchParams: string | URLSearchParams | LaunchParams`

Allows specifying custom launch parameters to be used by `init` function. In case, this parameter is
not specified, `init` will utilize the `retrieveLaunchParams` function.

#### `checkCompat: boolean`

Enabling the mode in which calls to methods not supported by the current version of the Mini App will
result in throwing an error is recommended and enabled by default.

#### `cssVars: boolean`

Creates global CSS variables connected to the current application theme parameters and web app
colors. The created variables are automatically updated when corresponding values in the theme
parameters or web app change.

Mini App variables:

- `--tg-bg-color`
- `--tg-header-color`

Theme parameters variables:

- `--tg-theme-bg-color`
- `--tg-theme-button-color`
- `--tg-theme-button-text-color`
- `--tg-theme-hint-color`
- `--tg-theme-link-color`
- `--tg-theme-secondary-bg-color`
- `--tg-theme-text-color`

#### `targetOrigin: string`

Updates the global target origin, which is used by the bridge's `postEvent` function. This restricts
the list of parent iframes that are allowed to receive data from the current application. To learn
more about this option, please refer to the [documentation](../tma-js-bridge.md#target-origin).

#### `timeout: number`

Default: _1000_

The duration, in milliseconds, in which initialization should be completed. If the timeout is
reached, an error will be thrown.

## Launch parameters

The launch parameters are the initial parameters passed to the Mini App. You can find more
information about them in the [documentation](../../../launch-parameters/common-information.md).

Developers can retrieve the launch parameters by using the `retrieveLaunchParams` function. This
function parses the parameters that begin with the `tgWebApp` prefix.

```typescript
import { retrieveLaunchParams } from '@tma.js/sdk';

console.log(retrieveLaunchParams());

// Output:
// {
//   version: '6.4',
//   initData: {
//     authDate: Mon Feb 20 2023 04:11:25 GMT+0000,
//     hash: 'kSJkn101-)S(djn1',
//   },
//   initDataRaw: 'auth_data=1672893897&hash=kSJkn101-)S(djn1'
//   platform: 'android',
//   themeParams: {
//     backgroundColor: '#ffaabb',
//     buttonColor: '#223112',
//     buttonTextColor: '#111aa3',
//     hintColor: '#000000',
//     linkColor: '#ffffff',
//     secondaryBackgroundColor: '#aaaaaa',
//     textColor: '#bbbbbb',
//   },
// };
```

This function needs no SDK initialization or something like that. It attempts to extract the launch
parameters from the `window.location`. In case, they are invalid or missing, the function will try
to extract these parameters from the `sessionStorage`. This function is safe to be used when a user
reloads Mini App via the `Reload Page` application button.

## Components

All components in this package are supposed to be used as singletons. This means that you should not
create multiple instances of the same component and use them, even if it is not explicitly
forbidden. However, in this case, there is no guarantee that everything will work fine.

The reason for this is that each component stores its state locally, and the instances of the class
are not synchronized with each other. For example, if a developer creates two instances of
the `Popup` component and one of them calls the `open()` method, it will change its `isOpened`
property to `true`. However, the second instance of `Popup` will not be aware of this change and
will still return a `false` value, which is incorrect.

To avoid potential problems, developers can rely on the package's `init` function, which provides
initialized components that are sufficient for use across the application.

### Events

Component instances use the common way of events listening through the `on` and `off` methods.
Here is the example with the `BackButton` component:

```typescript
import { BackButton } from '@tma.js/sdk';

const backButton = new BackButton(...);

backButton.on('click', () => {
  console.log('Back button clicked.');
});
```

You can find the list of supported events in components own documentations.

### Methods support

Almost each component is capable of checking whether its method is supported by the current Telegram
Mini Apps version or not. To check if some methods are supported, developer should use the component
instance `supports()` function. For example:

```typescript
import { BackButton } from '@tma.js/sdk';

let backButton = new BackButton('6.0');
console.log(backButton.supports('show')); // false

backButton = new BackButton('6.3');
console.log(backButton.supports('hide')); // true
```

It is recommended to use this functionality before calling some component method as long as this
will make developer sure, it will work. The list of supported methods by components is described in
each component documentation.