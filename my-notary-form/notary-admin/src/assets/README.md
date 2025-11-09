# Assets Directory

This directory contains static assets for the application.

## Logo

- `logo-noir.svg` - Main logo file (black version)
- `Logo.jsx` - Logo component that imports and displays the logo

To replace the logo, simply update the `logo-noir.svg` file in this directory.

## Favicon

- `favicon.svg` - Favicon file for the browser tab
- The favicon is automatically loaded via the `Favicon` component in `src/components/Favicon.jsx`

To replace the favicon:
1. Update the `favicon.svg` file in this directory
2. The favicon will be automatically updated in the application

You can use any SVG, PNG, or ICO format for the favicon, but SVG is recommended for best quality and scalability.

## Usage

### Logo Component

```jsx
import Logo from '../assets/Logo';

// Use in your component
<Logo width={100} height={50} className="custom-class" />
```

### Favicon

The favicon is automatically set by the `Favicon` component which is imported in `App.jsx`. No manual configuration needed.

