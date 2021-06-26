# Sticky React

Create Sticky Elements in React
[![NPM](https://img.shields.io/npm/v/@anubra266/stickyreact.svg)](https://www.npmjs.com/package/@anubra266/stickyreact) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @anubra266/stickyreact
#OR
yarn add @anubra266/stickyreact
```

## Usage

```javascript
import { StickyViewport, StickyBoundary, Sticky } from '@anubra266/stickyreact';

function App() {
  const handleStuck = target => {
    target?.classList.add('stuck');
  };

  const handleUnstuck = target => {
    target?.classList.remove('stuck');
  };

  const handleChange = ({ target, type }) => {
    if (type === 'stuck') {
      target?.classList.add('stuck');
    } else {
      target?.classList.remove('stuck');
    }
  };
  return (
    <StickyViewport as="div">
      <StickyBoundary
        onStuck={handleStuck}
        onUnstuck={handleUnstuck}
        onChange={handleChange}
      >
        <Sticky> I'm Sticky </Sticky>
        <div> I'm not Sticky </div>
        <div> I'm not Sticky too </div>
      </StickyBoundary>
      <StickyBoundary
        onStuck={handleStuck}
        onUnstuck={handleUnstuck}
        onChange={handleChange}
      >
        <Sticky>
          I'm also Sticky, but I override the above once I'm scrolled to
        </Sticky>
        <div> I'm not Sticky </div>
        <div> I'm not Sticky too </div>
      </StickyBoundary>
    </StickyViewport>
  );
}
```

## API Reference

#### StickyViewport

Wrapper and Provider for Sticky App

```javascript
<StickyViewport>...</StickyViewport>
```

| Parameter | Type                       | Description                   | Required | Deffault |
| :-------- | :------------------------- | :---------------------------- | -------- | -------- |
| `as`      | `string` or `ReactElement` | React Element used in display | false    | `div`    |

#### StickyBoundary

Container that wraps each Sticky Element

```javascript
<StickyBoundary>...</StickyBoundary>
```

| Parameter   | Type                       | Description                                     | Required | Deffault |
| :---------- | :------------------------- | :---------------------------------------------- | -------- | -------- |
| `as`        | `string` or `ReactElement` | React Element used in display                   | false    | `div`    |
| `onStuck`   | (target)=>void             | Callback when a child becomes Sticky            | false    | -------- |
| `onUnstuck` | (target)=>void             | Callback when a child is no longer Sticky       | false    | -------- |
| `onChange`  | ({target,type})=>void      | Callback when a child changes it's Sticky State | false    | -------- |

#### Sticky

Makes it's content Sticky

```javascript
<Sticky>...</Sticky>
```

| Parameter | Type                       | Description                   | Required | Deffault |
| :-------- | :------------------------- | :---------------------------- | -------- | -------- |
| `as`      | `string` or `ReactElement` | React Element used in display | false    | `div`    |

#### onStuck

Callback when a child becomes Sticky.

```js
(target: ReactNode) => {
  target?.classList.add('stuck');
};
```

| Parameter | Type        | Description                 |
| :-------- | :---------- | :-------------------------- |
| `target`  | `ReactNode` | The Sticky Element Instance |

#### onUnstuck

Callback when a child is no longer Sticky.

```js
(target: ReactNode) => {
  target?.classList.remove('stuck');
};
```

| Parameter | Type        | Description                 |
| :-------- | :---------- | :-------------------------- |
| `target`  | `ReactNode` | The Sticky Element Instance |

#### onChange

Callback when a child becomes Sticky or Loses the Sticky State.

**NB:** It provides a destructurable parameter

```js
({ target, type }: { target: ReactNode, type: 'stuck' | 'unstuck' }) => {
  if (type === 'stuck') {
    target?.classList.add('stuck');
  } else {
    target?.classList.remove('stuck');
  }
};
```

**NB:** The parameters are to be destructured

| Parameter | Type                  | Description                 |
| :-------- | :-------------------- | :-------------------------- |
| `target`  | `ReactNode`           | The Sticky Element Instance |
| `type`    | `'stuck' | 'unstuck'` | The Sticky Element Instance |

## Used By

This project is used by the following Projects:

- [Choc UI](https://choc-ui.tech) - Site search bar
