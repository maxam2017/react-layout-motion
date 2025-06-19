# react-layout-motion

A small, fast layout animations library for React using the Web Animations API.


```bash
npm install react-layout-motion
```

## Basic Usage

```jsx
import { Motion } from 'react-layout-motion';

function App() {
  return (
    <Motion layoutId="my-element">
      <div>This element will animate smoothly when its layout changes</div>
    </Motion>
  );
}
```

## API

### Motion Component

The component for creating layout animations.

#### Props

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `layoutId` | string | Yes | Unique identifier for the element to track layout changes |
| `children` | ReactNode | Yes | The content to be animated |
| `as` | ElementType | No | The HTML element to render (default: "div") |
| `style` | CSSProperties | No | Additional CSS styles |
| `config` | object | No | Animation configuration |
| `config.duration` | number | No | Animation duration in milliseconds (default: 300) |
| `config.easing` | string | No | CSS easing function (default: "cubic-bezier(0.25, 0.1, 0.25, 1)") |

## Examples

### Custom Animation Configuration

```jsx
<Motion 
  layoutId="custom-animation"
  config={{
    duration: 500,
    easing: "ease-in-out"
  }}
>
  <div>Slower, custom easing animation</div>
</Motion>
```


## Requirements

- React >= 16.8.0
- Modern browser with Web Animations API support (https://caniuse.com/web-animation)

## License

MIT
