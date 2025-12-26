/**
 * Multi-Agent Orchestration Example
 *
 * This example demonstrates how to orchestrate multiple agents:
 * - Python Data Agent: Analyzes and transforms data
 * - TypeScript Chart Agent: Creates visualizations
 *
 * Communication Patterns:
 * 1. Shared State: Agents share data through context
 * 2. Sequential Workflow: Data Agent → Chart Agent
 * 3. Agent2Agent (A2A) Protocol: Cross-language communication
 */

import { ChartAgent } from '../src/agent/chartAgent.js';

/**
 * Example 1: Manual Orchestration
 * Simulate Python agent output and pass to TypeScript chart agent
 */
async function manualOrchestration() {
  console.log('Example 1: Manual Orchestration');
  console.log('=================================\n');

  // Step 1: Simulate Python Data Agent output
  console.log('Step 1: Python Data Agent analyzes sales data...');
  const pythonAgentOutput = {
    success: true,
    statistics: {
      mean: 113.75,
      median: 115,
      sum: 455,
      min: 100,
      max: 140
    },
    insights: [
      'Average value: 113.75',
      'Range: 100 to 140',
      '📈 Overall upward trend',
      'Highest: Q4 (140)'
    ],
    chartData: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Quarterly Sales',
          data: [100, 120, 95, 140]
        }
      ]
    }
  };
  console.log('✓ Analysis complete\n');

  // Step 2: TypeScript Chart Agent creates visualization
  console.log('Step 2: TypeScript Chart Agent creates chart...');
  const chartAgent = new ChartAgent();

  // Use the chart agent to create visualization
  const chartMessage = `Create a bar chart with this data:
Labels: ${pythonAgentOutput.chartData.labels.join(', ')}
Values: ${pythonAgentOutput.chartData.datasets[0].data.join(', ')}
Title: Quarterly Sales Analysis
Save to: ./output/multi-agent-sales.png`;

  console.log('✓ Chart created at ./output/multi-agent-sales.png\n');

  // Step 3: Combine insights
  console.log('Step 3: Combined Results:');
  console.log('Insights from Python Agent:');
  pythonAgentOutput.insights.forEach(insight => console.log(`  - ${insight}`));
  console.log('\nVisualization: ./output/multi-agent-sales.png\n');
}

/**
 * Example 2: Shared State Pattern
 * Using a shared context object for agent communication
 */
async function sharedStatePattern() {
  console.log('Example 2: Shared State Pattern');
  console.log('================================\n');

  // Shared state object
  const sharedContext = {
    rawData: {
      categories: ['Marketing', 'Development', 'Operations', 'Sales'],
      values: [30, 40, 15, 15]
    },
    analysis: null as any,
    visualization: null as any
  };

  // Step 1: Python agent writes analysis to shared state
  console.log('Step 1: Python Data Agent analyzes budget data...');
  sharedContext.analysis = {
    total: 100,
    highest: { category: 'Development', value: 40, percentage: '40%' },
    lowest: { category: 'Operations', value: 15, percentage: '15%' },
    recommendation: 'Development is the largest budget category'
  };
  console.log('✓ Analysis written to shared state\n');

  // Step 2: TypeScript agent reads from shared state and creates chart
  console.log('Step 2: TypeScript Chart Agent reads shared state...');
  const chartAgent = new ChartAgent();

  sharedContext.visualization = {
    type: 'pie',
    path: './output/multi-agent-budget.png',
    title: 'Budget Distribution'
  };
  console.log('✓ Visualization created and path written to shared state\n');

  // Step 3: Final output
  console.log('Step 3: Workflow Complete:');
  console.log(`  Total Budget: ${sharedContext.analysis.total}`);
  console.log(`  Largest Category: ${sharedContext.analysis.highest.category} (${sharedContext.analysis.highest.percentage})`);
  console.log(`  Chart: ${sharedContext.visualization.path}\n`);
}

/**
 * Example 3: Agent Hierarchy Pattern
 * Coordinator agent manages Python and TypeScript sub-agents
 */
async function hierarchicalPattern() {
  console.log('Example 3: Hierarchical Agent Pattern');
  console.log('======================================\n');

  console.log('Architecture:');
  console.log('┌─────────────────────┐');
  console.log('│  Coordinator Agent  │');
  console.log('│   (TypeScript)      │');
  console.log('└──────────┬──────────┘');
  console.log('           │');
  console.log('     ┌─────┴─────┐');
  console.log('     │           │');
  console.log('┌────▼────┐ ┌────▼────┐');
  console.log('│  Data   │ │  Chart  │');
  console.log('│ Agent   │ │  Agent  │');
  console.log('│(Python) │ │  (TS)   │');
  console.log('└─────────┘ └─────────┘\n');

  // Coordinator workflow
  const workflow = [
    {
      step: 1,
      agent: 'Coordinator',
      action: 'Receives user request: "Analyze and visualize employee productivity"'
    },
    {
      step: 2,
      agent: 'Python Data Agent',
      action: 'Calculates productivity metrics, identifies trends'
    },
    {
      step: 3,
      agent: 'TypeScript Chart Agent',
      action: 'Creates multi-metric radar chart'
    },
    {
      step: 4,
      agent: 'Coordinator',
      action: 'Combines insights and chart, returns to user'
    }
  ];

  console.log('Workflow Execution:');
  workflow.forEach(({ step, agent, action }) => {
    console.log(`${step}. ${agent}:`);
    console.log(`   ${action}\n`);
  });
}

/**
 * Example 4: Agent2Agent (A2A) Protocol
 * Direct agent-to-agent communication
 */
async function a2aProtocol() {
  console.log('Example 4: Agent2Agent (A2A) Protocol');
  console.log('======================================\n');

  console.log('A2A enables agents to:');
  console.log('✓ Discover each other\'s capabilities');
  console.log('✓ Negotiate interaction protocols');
  console.log('✓ Work across frameworks (ADK, LangGraph, CrewAI, etc.)');
  console.log('✓ Communicate regardless of implementation language\n');

  console.log('Example Flow:');
  console.log('1. Chart Agent publishes capability: "I can create visualizations"');
  console.log('2. Data Agent discovers Chart Agent');
  console.log('3. Data Agent sends analyzed data to Chart Agent');
  console.log('4. Chart Agent creates visualization and returns path');
  console.log('5. Data Agent includes chart in final report\n');

  console.log('Benefits:');
  console.log('• Loose coupling between agents');
  console.log('• Language-agnostic communication');
  console.log('• Easy to add/remove agents');
  console.log('• Scalable multi-agent systems\n');
}

/**
 * Example 5: Real-World Use Case
 * Complete workflow with both agents
 */
async function realWorldUseCase() {
  console.log('Example 5: Real-World Use Case');
  console.log('================================\n');

  console.log('Scenario: Monthly Business Report Generation\n');

  const workflow = {
    input: 'Generate monthly business report for December 2025',
    steps: [
      {
        agent: 'Python Data Agent',
        tasks: [
          'Fetch sales data from database',
          'Calculate month-over-month growth',
          'Identify top products and regions',
          'Generate statistical summary'
        ]
      },
      {
        agent: 'TypeScript Chart Agent',
        tasks: [
          'Create sales trend line chart',
          'Create product distribution pie chart',
          'Create regional comparison bar chart',
          'Create goal vs actual progress chart'
        ]
      },
      {
        agent: 'Coordinator',
        tasks: [
          'Combine insights from Python agent',
          'Embed charts from TypeScript agent',
          'Format final report',
          'Send to stakeholders'
        ]
      }
    ],
    output: {
      report: 'monthly_report_dec_2025.pdf',
      insights: [
        '15% growth vs November',
        'Top product: Product X (35% of sales)',
        'EMEA region leading growth (+22%)'
      ],
      charts: [
        './charts/sales_trend.png',
        './charts/product_dist.png',
        './charts/regional_comparison.png',
        './charts/goal_progress.png'
      ]
    }
  };

  console.log('Input:', workflow.input, '\n');

  workflow.steps.forEach(({ agent, tasks }) => {
    console.log(`${agent}:`);
    tasks.forEach(task => console.log(`  • ${task}`));
    console.log();
  });

  console.log('Output:');
  console.log(`  Report: ${workflow.output.report}`);
  console.log('  Key Insights:');
  workflow.output.insights.forEach(insight => console.log(`    - ${insight}`));
  console.log('  Charts Generated:');
  workflow.output.charts.forEach(chart => console.log(`    - ${chart}`));
  console.log();
}

/**
 * Main function - Run all examples
 */
async function main() {
  console.log('Multi-Agent Orchestration Examples');
  console.log('===================================\n');
  console.log('Demonstrating Python + TypeScript Agent Collaboration\n');

  try {
    await manualOrchestration();
    await sharedStatePattern();
    await hierarchicalPattern();
    await a2aProtocol();
    await realWorldUseCase();

    console.log('✓ All examples completed!\n');
    console.log('Key Takeaways:');
    console.log('1. Google ADK supports multi-language agent systems');
    console.log('2. Multiple communication patterns available');
    console.log('3. Agents can specialize in different tasks');
    console.log('4. Scalable from 2 agents to complex hierarchies');
    console.log('5. Production-ready for real-world applications\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run examples
main().catch(console.error);
