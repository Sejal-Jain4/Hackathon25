# UI Components Guide

## Card Component

The `Card` component provides a consistent card styling across the app with various customization options.

### Basic Usage:
```jsx
import { Card } from '../components/ui';

<Card className="mb-6">
  <h2 className="text-xl font-bold text-white mb-4">Card Title</h2>
  <p className="text-gray-300">Card content goes here</p>
</Card>
```

### Props:
- `children`: Content to display inside the card (required)
- `className`: Additional CSS classes to apply (optional)
- `showGradientBorder`: Add a gradient border around the card (optional, default: false)
- `showGradientTop`: Add a gradient line at the top of the card (optional, default: false)
- `animation`: Enable entrance animation (optional, default: true)
- `delay`: Delay for the entrance animation in seconds (optional, default: 0)
- `height`: Fixed height for the card (optional, accepts string like 'h-full' or number in pixels)
- `onClick`: Click handler function (optional)

### Examples:

#### Card with Gradient Border:
```jsx
<Card showGradientBorder>
  <h2 className="text-2xl font-bold text-white mb-3">Achievements</h2>
  <p>Content here</p>
</Card>
```

#### Card with Gradient Top Line:
```jsx
<Card showGradientTop height={250}>
  <h2 className="text-lg font-bold text-white mb-2">Monthly Savings</h2>
  <p>Content here</p>
</Card>
```

#### Card with Custom Height:
```jsx
<Card height="h-full" className="flex flex-col">
  <h2 className="text-xl font-bold text-white">Card Title</h2>
  <div className="flex-grow">Content here</div>
</Card>
```

## SmallCard Component

The `SmallCard` component is used for smaller card sections, often used within larger cards or in grids.

### Basic Usage:
```jsx
import { SmallCard } from '../components/ui';

<SmallCard>
  <p className="text-gray-400 text-sm">Income</p>
  <p className="text-xl font-semibold text-primary-400">$2,500</p>
</SmallCard>
```

### Props:
- `children`: Content to display inside the card (required)
- `className`: Additional CSS classes to apply (optional)
- `animation`: Enable entrance animation (optional, default: true)
- `delay`: Delay for the entrance animation in seconds (optional, default: 0)
- `onClick`: Click handler function (optional)

## AchievementCard Component

The `AchievementCard` component is designed specifically for displaying user achievements.

### Basic Usage:
```jsx
import { AchievementCard } from '../components/ui';

<AchievementCard
  name="Budget Master"
  description="Stayed under budget for 3 months"
  icon="🏆"
  color="from-yellow-500 to-amber-700"
  status="completed"
  progress={100}
/>
```

### Props:
- `name`: The title of the achievement (required)
- `description`: Description of the achievement (required)
- `icon`: Icon to display, typically an emoji or SVG (required)
- `color`: Gradient color for the icon background (required, format: "from-color-1 to-color-2")
- `status`: Current status of the achievement (optional, one of: 'not-started', 'in-progress', 'completed')
- `progress`: Progress percentage for in-progress achievements (optional, default: 0)
- `delay`: Custom animation delay (optional)
- `index`: Used for staggered animations in lists (optional)