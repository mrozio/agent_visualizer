# Agent Visualizer

A Google Agent built with the Claude Agent SDK that can create charts and graphs from data in chat conversations.

## Features

- **Multiple Chart Types**: Line charts, bar charts, pie charts, scatter plots, radar charts, and more
- **Chart Templates**: Pre-built templates for common use cases (time series, comparisons, distributions, etc.)
- **Claude Agent SDK Integration**: Full integration with the Agent SDK for conversational chart creation
- **Easy to Use**: Simple API for both direct usage and agent-based interactions
- **Customizable**: Extensive customization options for colors, styles, and configurations

## Installation

```bash
npm install
```

## Usage

### 1. Direct Charting Tools

Use the charting tools directly without the agent:

```typescript
import { ChartingTools } from './src/tools/chartingTools.js';

const tools = new ChartingTools();

// Create a line chart
await tools.createLineChart(
  ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  [
    { label: 'Sales', data: [65, 59, 80, 81, 56] }
  ],
  'Monthly Sales',
  './output/sales.png'
);
```

### 2. Using Chart Templates

Use pre-built templates for common chart types:

```typescript
import { ChartTemplates, ChartingTools } from './src/tools/chartingTools.js';

const tools = new ChartingTools();

// Time series chart
const config = ChartTemplates.timeSeries(
  ['Week 1', 'Week 2', 'Week 3'],
  [100, 120, 115],
  'Weekly Users'
);

await tools.generateChartToFile(config, './output/users.png');
```

### 3. Using the Chart Agent

Use the agent for conversational chart creation:

```typescript
import { ChartAgent } from './src/agent/chartAgent.js';

const agent = new ChartAgent();

// The agent has tools that can be called:
// - create_line_chart
// - create_bar_chart
// - create_pie_chart
// - create_scatter_plot
// - create_chart_from_template
```

## Available Chart Types

### Line Chart
Perfect for time series and trend visualization.

```typescript
await tools.createLineChart(
  ['Jan', 'Feb', 'Mar'],
  [{ label: 'Sales', data: [10, 20, 15] }],
  'Sales Trend',
  './output/line.png'
);
```

### Bar Chart
Great for comparing values across categories.

```typescript
await tools.createBarChart(
  ['Product A', 'Product B', 'Product C'],
  [{ label: 'Q1', data: [12, 19, 3] }],
  'Product Performance',
  './output/bar.png'
);
```

### Pie Chart
Ideal for showing distributions and percentages.

```typescript
await tools.createPieChart(
  ['Desktop', 'Mobile', 'Tablet'],
  [55, 35, 10],
  'Traffic by Device',
  './output/pie.png'
);
```

### Scatter Plot
Useful for visualizing correlations.

```typescript
await tools.createScatterPlot(
  [{
    label: 'Data',
    data: [{ x: 10, y: 20 }, { x: 15, y: 25 }]
  }],
  'Correlation',
  './output/scatter.png'
);
```

## Chart Templates

The library includes several pre-built templates:

- **timeSeries**: Time-based data visualization
- **comparison**: Compare multiple groups across categories
- **distribution**: Show percentage distributions
- **multiMetric**: Radar chart for comparing metrics
- **progressGoal**: Track actual vs. target progress
- **correlation**: Scatter plot for correlations
- **stackedBar**: Stacked bar charts for compositions

### Template Example

```typescript
import { ChartTemplates } from './src/tools/chartTemplates.js';

// Progress tracking
const config = ChartTemplates.progressGoal(
  ['Q1', 'Q2', 'Q3', 'Q4'],
  [25, 48, 72, 95],      // Actual
  [30, 60, 90, 100],     // Target
  'Annual Progress'
);
```

## Agent Integration

The Chart Agent is designed to work with Google Chat and other platforms via the Claude Agent SDK.

### Agent Tools

The agent provides these tools:

1. **create_line_chart**: Creates line charts for trends
2. **create_bar_chart**: Creates bar charts for comparisons
3. **create_pie_chart**: Creates pie charts for distributions
4. **create_scatter_plot**: Creates scatter plots for correlations
5. **create_chart_from_template**: Uses pre-built templates

### Tool Parameters

Each tool accepts:
- `labels`: Array of category/axis labels
- `datasets` or `data`: The numeric data to visualize
- `title`: Optional chart title
- `outputPath`: Where to save the generated image

## Examples

Run the example file to see all features:

```bash
npm run example
```

This will generate sample charts in the `./output` directory.

## Development

### Build

```bash
npm run build
```

### Run

```bash
npm start
```

### Development Mode

```bash
npm run dev
```

## Project Structure

```
agent_visualizer/
├── src/
│   ├── agent/
│   │   └── chartAgent.ts      # Main agent implementation
│   ├── tools/
│   │   ├── chartingTools.ts   # Core charting utilities
│   │   └── chartTemplates.ts  # Pre-built templates
│   └── index.ts               # Main entry point
├── examples/
│   └── chart-example.ts       # Usage examples
├── output/                     # Generated charts (created on first run)
├── package.json
├── tsconfig.json
└── README.md
```

## Customization

### Custom Colors

```typescript
await tools.createLineChart(
  ['Jan', 'Feb', 'Mar'],
  [{
    label: 'Sales',
    data: [10, 20, 15],
    color: 'rgb(255, 99, 132)'  // Custom color
  }],
  'Sales',
  './output/custom.png'
);
```

### Custom Dimensions

```typescript
const tools = new ChartingTools(1200, 800); // width, height
```

### Custom Configuration

```typescript
const config = {
  type: 'bar',
  title: 'Custom Chart',
  data: { /* ... */ },
  customConfig: {
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  }
};
```

## Requirements

- Node.js 18+
- TypeScript 5.3+

## Dependencies

- `@anthropic-ai/agent-sdk`: Claude Agent SDK
- `chart.js`: Chart rendering library
- `chartjs-node-canvas`: Server-side chart rendering
- `canvas`: HTML5 Canvas implementation

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

For questions or issues, please open an issue on GitHub.
