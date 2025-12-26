# Agent Visualizer

A **Google Gemini Agent** built with the **Agent Development Kit (ADK)** that can create charts and graphs from data in chat conversations.

Powered by **Google's ADK** and **Gemini 3 Flash**, this agent provides charting capabilities through natural language interactions.

## Features

- 🤖 **Google ADK Integration**: Built with Google's Agent Development Kit for robust agent orchestration
- 🎨 **Multiple Chart Types**: Line charts, bar charts, pie charts, scatter plots, radar charts, and more
- 📊 **Chart Templates**: Pre-built templates for common use cases (time series, comparisons, distributions, etc.)
- 💬 **Conversational Interface**: Natural language chart creation using Gemini models
- ⚡ **Streaming Support**: Real-time streaming responses for better UX
- 🔧 **Customizable**: Extensive customization options for colors, styles, and configurations
- 🌐 **Platform Ready**: Easy integration with Google Chat, Slack, Discord, and more

## Prerequisites

Before using this agent, you need:

1. **Google Cloud Project** with Vertex AI API enabled
2. **Authentication** set up:
   - Use `gcloud auth application-default login` for local development, OR
   - Set up a service account and download credentials, OR
   - Use `GOOGLE_API_KEY` environment variable for Gemini API

For more details, see the [Google ADK documentation](https://google.github.io/adk-docs/).

## Installation

```bash
npm install
```

## Quick Start

### 1. Direct Charting Tools (No AI Required)

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

### 2. Using the Gemini Agent

Use the agent for conversational chart creation:

```typescript
import { ChartAgent } from './src/agent/chartAgent.js';

const agent = new ChartAgent();

// Process a natural language request
const response = await agent.processMessage(
  'Create a line chart showing sales: Jan=100, Feb=120, Mar=115'
);

console.log(response);
```

### 3. Streaming Responses

```typescript
for await (const chunk of agent.processMessageStream(message)) {
  console.log(chunk);
}
```

## Chart Types

### Line Chart
Perfect for time series and trend visualization.

```typescript
await tools.createLineChart(
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  [{ label: 'Steps', data: [8000, 12000, 9500, 11000, 13500] }],
  'Weekly Steps',
  './output/steps.png'
);
```

### Bar Chart
Great for comparing values across categories.

```typescript
await tools.createBarChart(
  ['Product A', 'Product B', 'Product C'],
  [
    { label: 'Q1', data: [12, 19, 3] },
    { label: 'Q2', data: [15, 23, 8] }
  ],
  'Product Performance',
  './output/products.png'
);
```

### Pie Chart
Ideal for showing distributions and percentages.

```typescript
await tools.createPieChart(
  ['Desktop', 'Mobile', 'Tablet'],
  [55, 35, 10],
  'Traffic by Device',
  './output/traffic.png'
);
```

### Scatter Plot
Useful for visualizing correlations.

```typescript
await tools.createScatterPlot(
  [{
    label: 'Sales vs Marketing',
    data: [
      { x: 10, y: 20 },
      { x: 15, y: 25 },
      { x: 20, y: 30 }
    ]
  }],
  'Correlation Analysis',
  './output/correlation.png'
);
```

## Chart Templates

Pre-built templates for common scenarios:

### Time Series Template

```typescript
import { ChartTemplates } from './src/tools/chartTemplates.js';

const config = ChartTemplates.timeSeries(
  ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  [100, 120, 115, 134],
  'Weekly Active Users',
  'Users'
);

await tools.generateChartToFile(config, './output/users.png');
```

### Available Templates

- **timeSeries**: Time-based data visualization
- **comparison**: Compare multiple groups across categories
- **distribution**: Show percentage distributions (pie chart)
- **multiMetric**: Radar chart for comparing metrics
- **progressGoal**: Track actual vs. target progress
- **correlation**: Scatter plot for correlations
- **stackedBar**: Stacked bar charts for compositions

## Google ADK Agent

The Chart Agent uses Google's Agent Development Kit with the following features:

### Function Tools

The agent provides 5 function tools:

1. **create_line_chart**: Creates line charts for trends and time series
2. **create_bar_chart**: Creates bar charts for comparisons
3. **create_pie_chart**: Creates pie charts for distributions
4. **create_scatter_plot**: Creates scatter plots for correlations
5. **create_chart_from_template**: Uses predefined templates

### Model

- Uses **Gemini 3 Flash** - Google's latest frontier model (Dec 2025)
- 3x faster than Gemini 2.5 Pro with superior performance
- Supports streaming responses
- Full function calling capabilities
- PhD-level reasoning and coding abilities

### Example Agent Usage

```typescript
const agent = new ChartAgent();

// Natural language request
await agent.processMessage(
  'Show me a bar chart comparing Q1 and Q2 sales for Products A, B, and C'
);

// Agent will:
// 1. Parse the request
// 2. Choose the appropriate tool (create_bar_chart)
// 3. Extract data and parameters
// 4. Generate the chart
// 5. Return the file path
```

## Platform Integration

### Google Chat

```typescript
import { ChartAgent } from './src/agent/chartAgent.js';

const agent = new ChartAgent();

export async function handleChatMessage(event) {
  const userMessage = event.message.text;
  const response = await agent.processMessage(userMessage);

  return { text: response };
}
```

### Cloud Functions Deployment

```bash
gcloud functions deploy chartAgent \
  --runtime nodejs20 \
  --trigger-http \
  --entry-point handleChatMessage \
  --set-env-vars GOOGLE_CLOUD_PROJECT=your-project-id
```

### Other Platforms

- **Slack**: Use Slack Bolt framework
- **Discord**: Use Discord.js
- **Web API**: Build REST or WebSocket endpoints

## Authentication Setup

### Option 1: Application Default Credentials (Local Development)

```bash
gcloud auth application-default login
```

### Option 2: Service Account

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

### Option 3: API Key

```bash
export GOOGLE_API_KEY="your-api-key"
```

## Examples

Run the comprehensive example file:

```bash
npm run example
```

This will:
- Create various chart types
- Demonstrate template usage
- Show agent integration patterns
- Generate sample charts in `./output/`

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
│   │   └── chartAgent.ts      # Google ADK agent implementation
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
  labels,
  [{
    label: 'Data',
    data: values,
    color: 'rgb(255, 99, 132)'  // Custom color
  }],
  'My Chart',
  './output/custom.png'
);
```

### Custom Dimensions

```typescript
const tools = new ChartingTools(1200, 800); // width, height
```

### Custom Chart Configuration

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

await tools.generateChartToFile(config, './output/custom.png');
```

## Technology Stack

- **@google/adk**: Google's Agent Development Kit (TypeScript v0.2.0)
- **Gemini 3 Flash**: Google's latest frontier AI model (December 2025)
- **chart.js**: Chart rendering library
- **chartjs-node-canvas**: Server-side chart rendering
- **canvas**: HTML5 Canvas implementation
- **zod**: Schema validation for function parameters
- **TypeScript**: Type safety and developer experience

## Requirements

- Node.js 18+
- TypeScript 5.3+
- Google Cloud Project (for agent features)

## Resources

- [Google ADK Documentation](https://google.github.io/adk-docs/)
- [Google ADK GitHub (TypeScript)](https://github.com/google/adk-js)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

For questions or issues, please open an issue on GitHub or refer to the [Google ADK documentation](https://google.github.io/adk-docs/).
