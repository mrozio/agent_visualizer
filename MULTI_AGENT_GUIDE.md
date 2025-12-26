# Multi-Agent System Guide

This guide shows how to build **mixed Python + TypeScript agent systems** using Google's Agent Development Kit (ADK).

## Overview

Google ADK supports **multi-language agent systems** where agents written in different languages (Python, TypeScript, Go, Java) can work together seamlessly.

### Our Multi-Agent System

```
┌─────────────────────────────────────┐
│      Multi-Agent System             │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────┐  ┌─────────────┐ │
│  │ Data Agent   │  │ Chart Agent │ │
│  │  (Python)    │→│(TypeScript) │ │
│  │              │  │             │ │
│  │ • Statistics │  │ • Line      │ │
│  │ • Insights   │  │ • Bar       │ │
│  │ • Transform  │  │ • Pie       │ │
│  └──────────────┘  │ • Scatter   │ │
│                    └─────────────┘ │
└─────────────────────────────────────┘
```

## Agent Roles

### 1. **Python Data Agent** (`python_agent/data_agent.py`)

Specializes in:
- **Statistical Analysis**: Calculate mean, median, sum, min, max
- **Data Transformation**: Prepare data for visualization
- **Insight Generation**: Identify trends and patterns
- **Data Validation**: Clean and validate input data

**Tools:**
- `calculate_statistics`: Compute numerical metrics
- `transform_for_chart`: Format data for charting
- `generate_insights`: Extract meaningful insights

### 2. **TypeScript Chart Agent** (`src/agent/chartAgent.ts`)

Specializes in:
- **Visualization Creation**: Generate charts and graphs
- **Multiple Chart Types**: Line, bar, pie, scatter, radar
- **Template System**: Pre-built chart patterns
- **Custom Styling**: Colors, dimensions, configurations

**Tools:**
- `create_line_chart`: Time series and trends
- `create_bar_chart`: Comparisons
- `create_pie_chart`: Distributions
- `create_scatter_plot`: Correlations
- `create_chart_from_template`: Pre-configured charts

## Communication Patterns

### Pattern 1: Sequential Workflow

Agents execute in sequence, passing results forward.

```python
# Python Agent (Step 1)
data_agent = DataAgent()
analysis = await data_agent.process("Analyze sales data")

# TypeScript Agent (Step 2)
chart_agent = ChartAgent()
chart = await chart_agent.process(analysis.chart_data)
```

**Use Case**: Data pipeline where each step builds on previous results.

### Pattern 2: Shared State

Agents read/write to a common state object.

```typescript
const context = {
  rawData: {...},
  analysis: null,  // Written by Python agent
  chart: null      // Written by TypeScript agent
};

// Python agent writes analysis
context.analysis = await pythonAgent.analyze(context.rawData);

// TypeScript agent reads analysis and creates chart
context.chart = await chartAgent.create(context.analysis);
```

**Use Case**: Parallel processing where agents need shared context.

### Pattern 3: Agent Hierarchy

A coordinator agent manages sub-agents.

```typescript
class CoordinatorAgent {
  constructor() {
    this.dataAgent = new DataAgent();      // Python
    this.chartAgent = new ChartAgent();    // TypeScript
  }

  async processRequest(request) {
    // Delegate to appropriate agent
    const analysis = await this.dataAgent.analyze(request.data);
    const chart = await this.chartAgent.visualize(analysis);

    return { analysis, chart };
  }
}
```

**Use Case**: Complex workflows requiring orchestration logic.

### Pattern 4: Agent2Agent (A2A) Protocol

Direct agent-to-agent communication using A2A protocol.

```typescript
// Agents discover each other
const chartAgent = await registry.findAgent('chart_creator');

// Python agent sends message to TypeScript agent
const result = await pythonAgent.sendTo(chartAgent, {
  action: 'create_chart',
  data: preparedData
});
```

**Use Case**: Loosely coupled systems, cross-framework integration.

## Setup Instructions

### 1. Python Environment Setup

```bash
# Create virtual environment
cd python_agent
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. TypeScript Environment Setup

```bash
# Install dependencies (already done)
npm install
```

### 3. Authentication Setup

Both agents use the same Google Cloud authentication:

```bash
# Option 1: Application Default Credentials
gcloud auth application-default login

# Option 2: API Key
export GOOGLE_API_KEY="your-api-key"

# Option 3: Service Account
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
```

## Running Examples

### Example 1: Run Python Agent Standalone

```bash
cd python_agent
python data_agent.py
```

### Example 2: Run TypeScript Agent Standalone

```bash
npm run example
```

### Example 3: Run Multi-Agent Orchestration

```bash
npm run build
node dist/examples/multi-agent-orchestration.js
```

Or with tsx:

```bash
npx tsx examples/multi-agent-orchestration.ts
```

## Real-World Use Cases

### Use Case 1: Business Intelligence Dashboard

**Flow:**
1. **Python Agent**: Fetches data from database, calculates KPIs
2. **TypeScript Agent**: Creates multiple chart types
3. **Output**: Interactive dashboard with insights

**Code:**
```python
# Python: Analyze business metrics
analysis = await data_agent.process({
  "sales_data": [...],
  "metrics": ["growth", "revenue", "conversion"]
})

# TypeScript: Visualize
charts = await chart_agent.create_dashboard(analysis)
```

### Use Case 2: Scientific Data Analysis

**Flow:**
1. **Python Agent**: Statistical analysis, hypothesis testing
2. **TypeScript Agent**: Scientific visualizations
3. **Output**: Research report with charts

**Code:**
```python
# Python: Run statistical tests
stats = await data_agent.analyze_experiment(experimental_data)

# TypeScript: Create scientific plots
plots = await chart_agent.create_scatter_plots(stats.results)
```

### Use Case 3: Financial Reporting

**Flow:**
1. **Python Agent**: Financial calculations, forecasting
2. **TypeScript Agent**: Financial charts (candlesticks, trends)
3. **Output**: Automated financial reports

**Code:**
```typescript
// Coordinator orchestrates both agents
const report = await coordinator.generateFinancialReport({
  period: 'Q4-2025',
  includeForecasts: true
});
// report contains: { analysis, charts, insights, recommendations }
```

## Advanced Topics

### Cross-Language Data Serialization

Agents communicate via JSON:

```python
# Python agent output
output = {
  "chart_data": {
    "labels": ["Q1", "Q2", "Q3", "Q4"],
    "datasets": [{"label": "Sales", "data": [100, 120, 95, 140]}]
  }
}

# TypeScript agent input (automatically parsed)
interface ChartData {
  labels: string[];
  datasets: { label: string; data: number[] }[];
}
```

### Error Handling in Multi-Agent Systems

```typescript
try {
  // Try Python agent first
  const analysis = await pythonAgent.analyze(data);

  // Fall back to simpler approach if needed
  const chart = await chartAgent.create(analysis);
} catch (error) {
  if (error.agent === 'python') {
    // Handle Python agent failure
    console.log('Using basic statistics...');
  } else {
    // Handle TypeScript agent failure
    console.log('Creating simple chart...');
  }
}
```

### Scaling to More Agents

```
┌──────────────────────────────────────┐
│         Coordinator Agent            │
└────────────┬─────────────────────────┘
             │
    ┌────────┼────────┬────────┐
    │        │        │        │
┌───▼───┐ ┌──▼──┐ ┌──▼──┐ ┌───▼───┐
│ Data  │ │Chart│ │ NLP │ │Export │
│(Python│ │(TS) │ │(Py) │ │ (Go)  │
└───────┘ └─────┘ └─────┘ └───────┘
```

You can add more specialized agents:
- **NLP Agent** (Python): Text analysis, sentiment
- **Export Agent** (Go): PDF/Excel generation
- **API Agent** (TypeScript): External integrations
- **Cache Agent** (Any): Performance optimization

## Performance Considerations

### Parallel Execution

Run independent agents in parallel:

```typescript
// Sequential (slower)
const analysis = await pythonAgent.analyze(data);
const validation = await validationAgent.check(data);

// Parallel (faster)
const [analysis, validation] = await Promise.all([
  pythonAgent.analyze(data),
  validationAgent.check(data)
]);
```

### Agent Caching

Cache expensive operations:

```python
# Python agent with caching
class DataAgent:
    def __init__(self):
        self.cache = {}

    async def analyze(self, data):
        cache_key = hash(str(data))
        if cache_key in self.cache:
            return self.cache[cache_key]

        result = await self._expensive_analysis(data)
        self.cache[cache_key] = result
        return result
```

## Deployment

### Option 1: Cloud Functions

Deploy each agent as a separate Cloud Function:

```bash
# Deploy Python agent
gcloud functions deploy data-agent \
  --runtime python312 \
  --trigger-http \
  --entry-point analyze

# Deploy TypeScript agent
gcloud functions deploy chart-agent \
  --runtime nodejs20 \
  --trigger-http \
  --entry-point create_chart
```

### Option 2: Cloud Run

Deploy as containers for more control:

```dockerfile
# Python agent Dockerfile
FROM python:3.12
COPY python_agent /app
RUN pip install -r /app/requirements.txt
CMD ["python", "/app/data_agent.py"]
```

### Option 3: Kubernetes

Deploy multi-agent system on GKE for enterprise scale.

## Testing Multi-Agent Systems

```typescript
describe('Multi-Agent System', () => {
  it('should analyze data and create chart', async () => {
    const data = { values: [1, 2, 3, 4, 5] };

    // Test Python agent
    const analysis = await pythonAgent.analyze(data);
    expect(analysis.mean).toBe(3);

    // Test TypeScript agent
    const chart = await chartAgent.create(analysis);
    expect(chart.success).toBe(true);

    // Test integration
    expect(chart.path).toContain('.png');
  });
});
```

## Resources

- [Google ADK Documentation](https://google.github.io/adk-docs/)
- [Multi-Agent Systems in ADK](https://google.github.io/adk-docs/agents/multi-agents/)
- [Agent2Agent Protocol](https://developers.googleblog.com/building-agents-with-the-adk-and-the-new-interactions-api/)
- [ADK Python GitHub](https://github.com/google/adk-python)
- [ADK TypeScript GitHub](https://github.com/google/adk-js)

## Troubleshooting

**Q: Can Python and TypeScript agents communicate directly?**
A: Yes, using shared state, HTTP APIs, or the A2A protocol.

**Q: Do I need separate API keys for each agent?**
A: No, they can share the same Google Cloud credentials.

**Q: Can I use different Gemini models for each agent?**
A: Yes! Configure each agent independently:
- Python Agent: `model="gemini-3-flash"`
- Chart Agent: `model="gemini-3-flash"` or `model="gemini-3-pro"`

**Q: How do I debug multi-agent systems?**
A: Use logging at each agent and track data flow through the system:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

logger.info(f"Python agent received: {data}")
logger.info(f"Python agent sending: {result}")
```

## Next Steps

1. ✅ Run the examples to see agents in action
2. ✅ Customize agents for your use case
3. ✅ Add more specialized agents
4. ✅ Deploy to production
5. ✅ Monitor and optimize performance

Happy multi-agent building! 🚀
