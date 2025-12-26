# Quick Start Guide

Get started with the Agent Visualizer in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Run Examples

```bash
npm run example
```

This will create several example charts in the `./output` directory.

## Step 3: Create Your First Chart

Create a new file `my-chart.ts`:

```typescript
import { ChartingTools } from './src/tools/chartingTools.js';

async function main() {
  const tools = new ChartingTools();

  // Create a simple line chart
  await tools.createLineChart(
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    [
      {
        label: 'Steps',
        data: [8000, 12000, 9500, 11000, 13500]
      }
    ],
    'My Weekly Steps',
    './my-steps.png'
  );

  console.log('Chart created! Check my-steps.png');
}

main();
```

Run it:

```bash
npx tsx my-chart.ts
```

## Step 4: Use the Agent

Create `my-agent.ts`:

```typescript
import { ChartAgent } from './src/agent/chartAgent.js';

async function main() {
  const agent = new ChartAgent();

  // The agent is now ready to process chart requests
  // You can integrate it with your chat platform
  console.log('Agent ready!');
}

main();
```

## Common Use Cases

### Sales Dashboard

```typescript
import { ChartTemplates, ChartingTools } from './src/tools/chartingTools.js';

const tools = new ChartingTools();

// Monthly sales trend
const salesTrend = ChartTemplates.timeSeries(
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  [15000, 18000, 22000, 19000, 25000, 28000],
  'Monthly Sales Revenue',
  'Revenue ($)'
);

await tools.generateChartToFile(salesTrend, './sales-trend.png');
```

### Budget Distribution

```typescript
const budget = ChartTemplates.distribution(
  ['Marketing', 'Development', 'Operations', 'Sales', 'HR'],
  [30, 35, 15, 15, 5],
  'Budget Allocation (%)'
);

await tools.generateChartToFile(budget, './budget.png');
```

### Performance Comparison

```typescript
const comparison = ChartTemplates.comparison(
  ['Speed', 'Quality', 'Cost', 'Support'],
  [
    { name: 'Vendor A', values: [8, 9, 6, 7] },
    { name: 'Vendor B', values: [7, 8, 8, 9] },
    { name: 'Vendor C', values: [9, 7, 5, 6] }
  ],
  'Vendor Comparison'
);

await tools.generateChartToFile(comparison, './vendors.png');
```

## Next Steps

- Explore all chart types in `examples/chart-example.ts`
- Check the README for full API documentation
- Integrate with your chat platform
- Customize colors and styles

## Tips

1. **Chart Types**: Choose the right chart for your data
   - Line: Trends over time
   - Bar: Comparisons
   - Pie: Percentages/distributions
   - Scatter: Correlations

2. **Templates**: Use templates for common patterns
   - Saves time
   - Ensures consistency
   - Best practices built-in

3. **Customization**: All charts support custom colors and styles

4. **Agent Integration**: The agent can understand natural language requests and choose the appropriate chart type

## Troubleshooting

### Canvas Installation Issues

If you have issues with the `canvas` package, you may need to install system dependencies:

**Ubuntu/Debian:**
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

**macOS:**
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

### TypeScript Errors

Make sure you're using Node.js 18+ and TypeScript 5.3+:

```bash
node --version
npx tsc --version
```

## Need Help?

- Check the full README.md
- Look at examples in `examples/`
- Open an issue on GitHub
