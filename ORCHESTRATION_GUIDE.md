# Orchestration Guide

How to coordinate multiple agents across different languages using an orchestrator.

## What is an Orchestrator?

An **orchestrator** is a special agent that coordinates other agents. Think of it as a conductor leading an orchestra - each agent (musician) has specific skills, and the orchestrator decides:

- **Which** agents to use
- **When** to run them (sequential or parallel)
- **How** to pass data between them
- **What** to do if an agent fails

```
┌─────────────────────────────────────┐
│      Orchestrator Agent             │
│   (Coordinates all agents)          │
└───────────────┬─────────────────────┘
                │
    ┌───────────┼───────────┬────────────┐
    │           │           │            │
┌───▼────┐  ┌──▼──┐    ┌───▼───┐   ┌───▼────┐
│  Data  │  │Chart│    │  NLP  │   │ Export │
│(Python)│  │(TS) │    │(Python│   │  (Go)  │
└────────┘  └─────┘    └───────┘   └────────┘
```

## Core Concepts

### 1. Agent Registry

The orchestrator maintains a registry of all available agents:

```typescript
interface AgentInfo {
  name: string;              // Unique identifier
  language: string;          // typescript | python | go | java
  capabilities: string[];    // What the agent can do
  endpoint?: string;         // For remote agents
  instance?: any;            // For local agents
}
```

**Example Registry:**
```typescript
{
  'chart_agent': {
    name: 'chart_agent',
    language: 'typescript',
    capabilities: ['create_line_chart', 'create_bar_chart'],
    instance: chartAgentInstance
  },
  'data_agent': {
    name: 'data_agent',
    language: 'python',
    capabilities: ['analyze_data', 'calculate_stats'],
    endpoint: 'http://localhost:8000/data-agent'
  }
}
```

### 2. Task Context

Shared state that flows through the workflow:

```typescript
interface TaskContext {
  taskId: string;
  request: string;
  data?: any;
  results: Map<string, any>;  // Results from each agent
  metadata: {
    startTime: number;
    steps: StepInfo[];
  };
}
```

### 3. Communication Methods

**Local Agents (Same Process):**
```typescript
// Direct method calls
const result = await agent.instance.processMessage(task);
```

**Remote Agents (Different Services):**
```typescript
// HTTP requests
const response = await fetch(agent.endpoint, {
  method: 'POST',
  body: JSON.stringify({ task, data })
});
```

## Orchestration Patterns

### Pattern 1: Task Delegation

**Use Case:** Single agent handles entire task

```typescript
// User: "Create a bar chart"
// Orchestrator: Routes to chart_agent

const result = await orchestrator.delegateToAgent(
  'chart_agent',
  'Create bar chart with Q1-Q4 data'
);
```

**Flow:**
```
User Request → Orchestrator → Chart Agent → Result
```

**When to Use:**
- Task requires only one specialized agent
- Simple, focused requests
- No data dependencies

### Pattern 2: Sequential Workflow

**Use Case:** Data flows from one agent to the next

```typescript
// User: "Analyze sales data and visualize it"
// Orchestrator: data_agent → chart_agent

const workflow = [
  { agent: 'data_agent', task: 'Analyze sales data' },
  { agent: 'chart_agent', task: 'Visualize results', useResultFrom: 'data_agent' }
];

const result = await orchestrator.executeWorkflow(workflow);
```

**Flow:**
```
Request → Data Agent → Analysis Result
                ↓
          Chart Agent → Final Chart
```

**When to Use:**
- Output of one agent is input to another
- Data transformation pipelines
- Multi-step processes
- Order matters

**Example:**
```typescript
// Business Intelligence Report
1. data_agent: Fetch data from database
2. data_agent: Calculate KPIs
3. chart_agent: Create trend charts
4. nlp_agent: Generate summary
5. export_agent: Create PDF
```

### Pattern 3: Parallel Execution

**Use Case:** Multiple independent tasks run simultaneously

```typescript
// User: "Create sales, product, and regional charts"
// Orchestrator: All chart_agents run in parallel

const tasks = [
  { agent: 'chart_agent', task: 'Create sales chart' },
  { agent: 'chart_agent', task: 'Create product chart' },
  { agent: 'chart_agent', task: 'Create regional chart' }
];

const results = await orchestrator.executeParallel(tasks);
```

**Flow:**
```
                ┌→ Chart Agent (sales) →┐
Request → Split ├→ Chart Agent (product)├→ Combine → Result
                └→ Chart Agent (regional)┘
```

**When to Use:**
- Independent tasks (no data dependencies)
- Want faster execution
- Multiple charts/reports
- Batch processing

**Performance:**
```
Sequential: 1s + 1s + 1s = 3s total
Parallel:   max(1s, 1s, 1s) = 1s total  ← 3x faster!
```

### Pattern 4: Conditional Routing

**Use Case:** Choose agent based on request analysis

```typescript
// Orchestrator decides which agent based on keywords

function routeRequest(request: string): string {
  if (request.includes('chart') || request.includes('visualize')) {
    return 'chart_agent';
  } else if (request.includes('analyze') || request.includes('calculate')) {
    return 'data_agent';
  } else if (request.includes('sentiment')) {
    return 'nlp_agent';
  }
  return 'default_agent';
}

const agent = routeRequest(userRequest);
const result = await orchestrator.delegateToAgent(agent, userRequest);
```

**Decision Tree:**
```
                    Request
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    "chart"?      "analyze"?    "sentiment"?
         │             │             │
    chart_agent   data_agent    nlp_agent
```

**When to Use:**
- Different request types
- Intelligent routing
- Multi-purpose chatbots
- Dynamic task assignment

### Pattern 5: Hybrid (Sequential + Parallel)

**Use Case:** Complex workflows with both patterns

```typescript
// Business Report Generation

// Step 1: Sequential data preparation
await orchestrator.executeWorkflow([
  { agent: 'data_agent', task: 'Fetch data' },
  { agent: 'data_agent', task: 'Clean and validate' }
]);

// Step 2: Parallel chart creation
await orchestrator.executeParallel([
  { agent: 'chart_agent', task: 'Sales chart' },
  { agent: 'chart_agent', task: 'Product chart' },
  { agent: 'chart_agent', task: 'Regional chart' }
]);

// Step 3: Sequential finalization
await orchestrator.executeWorkflow([
  { agent: 'nlp_agent', task: 'Generate summary' },
  { agent: 'export_agent', task: 'Create PDF' }
]);
```

**Flow:**
```
1. Fetch Data (Sequential)
       ↓
2. Clean Data (Sequential)
       ↓
3. ┌→ Sales Chart ──┐
   ├→ Product Chart ─┤ (Parallel)
   └→ Regional Chart┘
       ↓
4. Generate Summary (Sequential)
       ↓
5. Export PDF (Sequential)
```

**When to Use:**
- Real-world complex workflows
- Mix of dependent and independent tasks
- Optimize for both correctness and speed

## Implementation

### Basic Orchestrator Setup

```typescript
import { AgentOrchestrator } from './orchestrator/agentOrchestrator.js';

// Create orchestrator
const orchestrator = new AgentOrchestrator();

// Register your agents
orchestrator.registerAgent({
  name: 'my_python_agent',
  language: 'python',
  capabilities: ['analyze', 'transform'],
  endpoint: 'http://localhost:8000/agent'
});

// Use it
const result = await orchestrator.orchestrate('Analyze this data...');
```

### Agent Communication

**TypeScript Agent → Python Agent:**

```typescript
// TypeScript calls Python via HTTP
const response = await fetch('http://localhost:8000/data-agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    task: 'calculate_statistics',
    data: [100, 120, 95, 140]
  })
});

const pythonResult = await response.json();
```

**Python Agent → TypeScript Agent:**

```python
# Python calls TypeScript via HTTP
import httpx

response = httpx.post('http://localhost:3000/chart-agent', json={
    'task': 'create_chart',
    'data': {
        'type': 'bar',
        'values': [100, 120, 95, 140]
    }
})

chart_result = response.json()
```

**Shared State (Recommended):**

```typescript
// Both agents read/write to shared database or cache

// Python agent writes
await redis.set('analysis_result', JSON.stringify(analysis));

// TypeScript agent reads
const analysisData = JSON.parse(await redis.get('analysis_result'));
```

### Error Handling

```typescript
class AgentOrchestrator {
  async delegateToAgent(agentName, task, data) {
    try {
      const result = await this.executeAgent(agentName, task, data);
      return { success: true, result };
    } catch (error) {
      // Fallback strategy
      console.log(`Agent ${agentName} failed, trying fallback...`);

      const fallbackAgent = this.findFallbackAgent(agentName);
      if (fallbackAgent) {
        return await this.delegateToAgent(fallbackAgent, task, data);
      }

      return { success: false, error: error.message };
    }
  }
}
```

## Scaling Orchestration

### From Simple to Complex

**Level 1: Single Orchestrator (2-5 agents)**
```
Orchestrator → [Agent1, Agent2, Agent3]
```

**Level 2: Hierarchical (5-15 agents)**
```
Main Orchestrator
  ├→ Data Orchestrator → [DataAgent1, DataAgent2]
  ├→ Viz Orchestrator → [ChartAgent, GraphAgent]
  └→ Export Orchestrator → [PDFAgent, ExcelAgent]
```

**Level 3: Distributed (15+ agents)**
```
Load Balancer
  ├→ Orchestrator1 → [Agents 1-10]
  ├→ Orchestrator2 → [Agents 11-20]
  └→ Orchestrator3 → [Agents 21-30]
```

### Performance Optimization

**1. Agent Pooling**
```typescript
// Reuse agent instances
const agentPool = new Map();

function getAgent(name) {
  if (!agentPool.has(name)) {
    agentPool.set(name, createAgent(name));
  }
  return agentPool.get(name);
}
```

**2. Caching**
```typescript
// Cache expensive operations
const cache = new Map();

async function executeWithCache(agent, task, data) {
  const key = `${agent}:${task}:${hash(data)}`;

  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = await execute(agent, task, data);
  cache.set(key, result);
  return result;
}
```

**3. Batch Processing**
```typescript
// Group similar tasks
const batchedTasks = groupByAgent(tasks);

for (const [agent, agentTasks] of batchedTasks) {
  await executeBatch(agent, agentTasks);
}
```

## Deployment Patterns

### Pattern 1: All Local (Development)

```typescript
// All agents in same process
const orchestrator = new AgentOrchestrator();
orchestrator.registerAgent({
  name: 'chart_agent',
  instance: new ChartAgent()
});
```

### Pattern 2: Microservices (Production)

```typescript
// Agents as separate services
orchestrator.registerAgent({
  name: 'data_agent',
  endpoint: 'http://data-service:8000'
});

orchestrator.registerAgent({
  name: 'chart_agent',
  endpoint: 'http://chart-service:8001'
});
```

### Pattern 3: Hybrid

```typescript
// Critical agents local, others remote
orchestrator.registerAgent({
  name: 'orchestrator_helper',
  instance: new LocalAgent()  // Fast, always available
});

orchestrator.registerAgent({
  name: 'ml_agent',
  endpoint: 'http://ml-service:8000'  // GPU-intensive, separate service
});
```

## Monitoring & Debugging

### Logging

```typescript
class AgentOrchestrator {
  async delegateToAgent(agent, task, data) {
    const startTime = Date.now();

    console.log(`[${new Date().toISOString()}] Delegating to ${agent}`);
    console.log(`  Task: ${task}`);

    const result = await this.execute(agent, task, data);

    console.log(`  Duration: ${Date.now() - startTime}ms`);
    console.log(`  Success: ${!result.error}`);

    return result;
  }
}
```

### Metrics

```typescript
class OrchestratorMetrics {
  agentCalls = new Map<string, number>();
  agentLatencies = new Map<string, number[]>();
  errorCounts = new Map<string, number>();

  recordCall(agent, latency, success) {
    this.agentCalls.set(agent, (this.agentCalls.get(agent) || 0) + 1);

    const latencies = this.agentLatencies.get(agent) || [];
    latencies.push(latency);
    this.agentLatencies.set(agent, latencies);

    if (!success) {
      this.errorCounts.set(agent, (this.errorCounts.get(agent) || 0) + 1);
    }
  }

  getReport() {
    // Generate metrics report
  }
}
```

## Best Practices

### 1. **Keep Agents Focused**
Each agent should do one thing well.
```
✓ Good: data_analysis_agent, chart_creation_agent
✗ Bad: everything_agent
```

### 2. **Use Timeouts**
```typescript
const result = await Promise.race([
  delegateToAgent(agent, task),
  timeout(30000) // 30s timeout
]);
```

### 3. **Implement Retries**
```typescript
async function retryAgent(agent, task, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await delegateToAgent(agent, task);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000); // Exponential backoff
    }
  }
}
```

### 4. **Validate Agent Responses**
```typescript
function validateAgentResponse(result, expectedSchema) {
  if (!result.success) {
    throw new Error('Agent returned error');
  }

  if (!matchesSchema(result.data, expectedSchema)) {
    throw new Error('Invalid response format');
  }

  return result;
}
```

### 5. **Use Circuit Breakers**
```typescript
class CircuitBreaker {
  constructor(private threshold = 5) {}
  private failures = 0;
  private isOpen = false;

  async call(fn) {
    if (this.isOpen) {
      throw new Error('Circuit breaker is open');
    }

    try {
      const result = await fn();
      this.failures = 0;
      return result;
    } catch (error) {
      this.failures++;
      if (this.failures >= this.threshold) {
        this.isOpen = true;
        setTimeout(() => this.isOpen = false, 60000); // Reset after 1min
      }
      throw error;
    }
  }
}
```

## Testing Multi-Agent Systems

```typescript
describe('Orchestrator', () => {
  it('should execute sequential workflow', async () => {
    const orchestrator = new AgentOrchestrator();

    const result = await orchestrator.executeWorkflow([
      { agent: 'data_agent', task: 'analyze' },
      { agent: 'chart_agent', task: 'visualize' }
    ]);

    expect(result.success).toBe(true);
    expect(result.steps).toHaveLength(2);
  });

  it('should handle agent failure gracefully', async () => {
    const orchestrator = new AgentOrchestrator();

    const result = await orchestrator.delegateToAgent(
      'non_existent_agent',
      'task'
    );

    expect(result.error).toBeDefined();
  });
});
```

## Resources

- [Google ADK Multi-Agent Docs](https://google.github.io/adk-docs/agents/multi-agents/)
- [Agent2Agent Protocol](https://developers.googleblog.com/building-agents-with-the-adk-and-the-new-interactions-api/)
- [Orchestrator Examples](./examples/orchestrator-examples.ts)

## Summary

An orchestrator enables you to:

✅ Coordinate agents in any language (TypeScript, Python, Go, Java)
✅ Execute complex workflows (sequential, parallel, conditional)
✅ Scale from 2 agents to dozens
✅ Handle failures gracefully
✅ Optimize performance
✅ Monitor and debug effectively

**The key is:** Let each agent specialize, and let the orchestrator coordinate!
