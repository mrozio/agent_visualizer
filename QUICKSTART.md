# Quick Start Guide

Get started with the Agent Visualizer (Google ADK + Gemini) in 5 minutes!

## Prerequisites

Before starting, set up Google Cloud authentication:

```bash
# Option 1: Application Default Credentials (easiest for local dev)
gcloud auth application-default login

# Option 2: API Key
export GOOGLE_API_KEY="your-api-key"

# Option 3: Service Account
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
```

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Run Examples

```bash
npm run example
```

This will create several example charts in the `./output` directory demonstrating:
- Direct charting (no AI)
- Chart templates
- Google ADK agent setup
- Integration patterns

## Step 3: Create Your First Chart (No AI)

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

## Step 4: Use the Gemini Agent

Create `my-agent.ts`:

```typescript
import { ChartAgent } from './src/agent/chartAgent.js';

async function main() {
  const agent = new ChartAgent();

  // Natural language chart creation
  const response = await agent.processMessage(
    'Create a bar chart comparing Q1 and Q2 sales for Product A (100, 120) and Product B (80, 95)'
  );

  console.log(response);
}

main();
```

**Note**: The agent requires Google Cloud authentication. Make sure you've set up credentials (see Prerequisites).

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

## Google Chat Integration

### Step 1: Create a Cloud Function

```typescript
import { ChartAgent } from './src/agent/chartAgent.js';

const agent = new ChartAgent();

export async function handleGoogleChat(req, res) {
  const event = req.body;

  // Only respond to messages
  if (event.type !== 'MESSAGE') {
    return res.send({});
  }

  const userMessage = event.message.text;

  try {
    const response = await agent.processMessage(userMessage);

    res.send({
      text: response
    });
  } catch (error) {
    res.send({
      text: `Error: ${error.message}`
    });
  }
}
```

### Step 2: Deploy

```bash
gcloud functions deploy chartAgent \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point handleGoogleChat
```

### Step 3: Configure Google Chat

1. Go to Google Cloud Console
2. Navigate to Google Chat API
3. Create a new app
4. Set the HTTP endpoint to your Cloud Function URL
5. Save and publish

## Next Steps

- Explore all chart types in `examples/chart-example.ts`
- Check the README for full API documentation
- Integrate with your chat platform
- Customize colors and styles

## Tips

1. **Chart Types**: Choose the right chart for your data
   - **Line**: Trends over time
   - **Bar**: Comparisons
   - **Pie**: Percentages/distributions
   - **Scatter**: Correlations

2. **Templates**: Use templates for common patterns
   - Saves time
   - Ensures consistency
   - Best practices built-in

3. **Agent vs Direct**:
   - Use **ChartingTools directly** when you know exactly what chart you need
   - Use the **Gemini Agent** when you want natural language interaction

4. **Authentication**:
   - Local dev: Use `gcloud auth application-default login`
   - Production: Use service accounts
   - Simple API calls: Use `GOOGLE_API_KEY`

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

### Google Cloud Authentication Issues

```bash
# Check your authentication
gcloud auth list

# Re-authenticate if needed
gcloud auth application-default login

# Set your project
gcloud config set project YOUR_PROJECT_ID
```

### TypeScript Errors

Make sure you're using Node.js 18+ and TypeScript 5.3+:

```bash
node --version
npx tsc --version
```

## Architecture

```
┌─────────────┐
│  User Chat  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Gemini Agent   │  ← Google ADK
│  (chartAgent)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│Function│ │  Chart   │
│ Tools  │ │Templates │
└────┬───┘ └────┬─────┘
     │          │
     └────┬─────┘
          ▼
    ┌──────────┐
    │Charting  │
    │  Tools   │
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │Chart.js  │
    │  Canvas  │
    └────┬─────┘
         │
         ▼
    📊 Chart PNG
```

## Need Help?

- Check the full README.md
- Look at examples in `examples/`
- Read the [Google ADK docs](https://google.github.io/adk-docs/)
- Open an issue on GitHub
