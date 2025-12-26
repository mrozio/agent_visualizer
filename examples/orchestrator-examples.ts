/**
 * Orchestrator Examples - Practical Multi-Agent Coordination
 *
 * These examples show how an orchestrator coordinates multiple agents
 * across different languages (TypeScript, Python, etc.)
 */

import { AgentOrchestrator } from '../src/orchestrator/agentOrchestrator.js';

/**
 * Example 1: Simple Task Delegation
 * Orchestrator routes request to the appropriate agent
 */
async function example1_SimpleDelegation() {
  console.log('Example 1: Simple Task Delegation');
  console.log('==================================\n');

  const orchestrator = new AgentOrchestrator();

  // User request - orchestrator decides which agent to use
  const request = 'Create a bar chart showing Q1-Q4 sales: 100, 120, 95, 140';

  console.log('User Request:', request);
  console.log('\nOrchestrator Analysis:');
  console.log('→ Task requires chart creation');
  console.log('→ Routing to chart_agent (TypeScript)');

  // Orchestrator handles it automatically
  const result = await orchestrator.orchestrate(request);

  console.log('\nResult:', result);
  console.log('\n✓ Simple delegation complete\n');
}

/**
 * Example 2: Sequential Workflow
 * Data flows from one agent to the next
 */
async function example2_SequentialWorkflow() {
  console.log('Example 2: Sequential Workflow');
  console.log('===============================\n');

  const orchestrator = new AgentOrchestrator();

  const request = 'Analyze this sales data and create a visualization: [100, 120, 95, 140]';

  console.log('User Request:', request);
  console.log('\nOrchestrator Workflow:');
  console.log('1. data_agent (Python) → Analyze data');
  console.log('2. chart_agent (TypeScript) → Visualize results');

  // Manual workflow execution
  const result = await orchestrator.executeManualWorkflow({
    type: 'sequential',
    steps: [
      {
        agent: 'data_agent',
        task: 'Calculate statistics: mean, median, trend for [100, 120, 95, 140]'
      },
      {
        agent: 'chart_agent',
        task: 'Create line chart with labels Q1,Q2,Q3,Q4 and values 100,120,95,140'
      }
    ]
  });

  console.log('\nWorkflow Result:', JSON.stringify(result, null, 2));
  console.log('\n✓ Sequential workflow complete\n');
}

/**
 * Example 3: Parallel Execution
 * Multiple agents work simultaneously
 */
async function example3_ParallelExecution() {
  console.log('Example 3: Parallel Execution');
  console.log('==============================\n');

  const orchestrator = new AgentOrchestrator();

  console.log('Scenario: Generate monthly business report');
  console.log('\nTasks to execute in parallel:');
  console.log('1. data_agent: Calculate monthly KPIs');
  console.log('2. chart_agent: Create sales trend chart');
  console.log('3. chart_agent: Create regional distribution chart');

  const result = await orchestrator.executeManualWorkflow({
    type: 'parallel',
    steps: [
      {
        agent: 'data_agent',
        task: 'Calculate KPIs: revenue growth, conversion rate, customer retention'
      },
      {
        agent: 'chart_agent',
        task: 'Create line chart for sales trend over 12 months'
      },
      {
        agent: 'chart_agent',
        task: 'Create pie chart for regional sales distribution'
      }
    ]
  });

  console.log('\nParallel Execution Result:');
  console.log(`Total Duration: ${result.totalDuration}ms`);
  console.log(`Tasks Completed: ${result.results.length}`);

  result.results.forEach((r: any, i: number) => {
    console.log(`  ${i + 1}. ${r.agent}: ${r.result.success ? '✓' : '✗'}`);
  });

  console.log('\n✓ Parallel execution complete\n');
}

/**
 * Example 4: Conditional Routing
 * Orchestrator chooses agent based on request type
 */
async function example4_ConditionalRouting() {
  console.log('Example 4: Conditional Routing');
  console.log('================================\n');

  const orchestrator = new AgentOrchestrator();

  const requests = [
    'Calculate the average of [10, 20, 30, 40]',
    'Create a chart showing these values',
    'Analyze sentiment in customer reviews',
    'Export data to PDF'
  ];

  console.log('Processing multiple requests with conditional routing:\n');

  for (const request of requests) {
    console.log(`Request: "${request}"`);

    // Condition function determines which agent to use
    const routingResult = await orchestrator.routeByCondition(
      request,
      (req) => {
        if (req.includes('calculate') || req.includes('average') || req.includes('analyze')) {
          return 'data_agent';
        } else if (req.includes('chart') || req.includes('visualize')) {
          return 'chart_agent';
        } else if (req.includes('sentiment') || req.includes('nlp')) {
          return 'nlp_agent'; // Would be registered
        } else if (req.includes('export') || req.includes('pdf')) {
          return 'export_agent'; // Would be registered
        }
        return 'data_agent'; // default
      }
    );

    console.log(`  Routed to: ${routingResult.agent || 'unknown'}`);
    console.log();
  }

  console.log('✓ Conditional routing complete\n');
}

/**
 * Example 5: Complex Business Workflow
 * Real-world scenario with multiple agents
 */
async function example5_ComplexWorkflow() {
  console.log('Example 5: Complex Business Workflow');
  console.log('=====================================\n');

  const orchestrator = new AgentOrchestrator();

  console.log('Scenario: Automated Monthly Business Report\n');

  console.log('Workflow Steps:');
  console.log('1. data_agent: Fetch and analyze sales data');
  console.log('2. data_agent: Calculate growth metrics');
  console.log('3. chart_agent: Create sales trend chart');
  console.log('4. chart_agent: Create product distribution chart');
  console.log('5. chart_agent: Create regional comparison chart');
  console.log('6. nlp_agent: Generate executive summary (simulated)');
  console.log('7. export_agent: Compile PDF report (simulated)\n');

  // Mixed sequential and parallel execution
  console.log('Execution Strategy:');
  console.log('→ Steps 1-2: Sequential (data analysis)');
  console.log('→ Steps 3-5: Parallel (chart creation)');
  console.log('→ Steps 6-7: Sequential (summary and export)\n');

  // Step 1-2: Data analysis (sequential)
  const analysisResult = await orchestrator.executeManualWorkflow({
    type: 'sequential',
    steps: [
      {
        agent: 'data_agent',
        task: 'Fetch December 2025 sales data'
      },
      {
        agent: 'data_agent',
        task: 'Calculate month-over-month growth'
      }
    ]
  });

  console.log('✓ Data analysis complete');

  // Step 3-5: Chart creation (parallel)
  const chartsResult = await orchestrator.executeManualWorkflow({
    type: 'parallel',
    steps: [
      {
        agent: 'chart_agent',
        task: 'Create sales trend line chart'
      },
      {
        agent: 'chart_agent',
        task: 'Create product distribution pie chart'
      },
      {
        agent: 'chart_agent',
        task: 'Create regional comparison bar chart'
      }
    ]
  });

  console.log('✓ Charts created in parallel');
  console.log(`  Duration: ${chartsResult.totalDuration}ms`);
  console.log(`  Charts: ${chartsResult.results.length}`);

  console.log('\n✓ Complex workflow complete');
  console.log('\nFinal Output:');
  console.log('  - Analysis insights from data_agent');
  console.log('  - 3 charts from chart_agent');
  console.log('  - Executive summary (would be from nlp_agent)');
  console.log('  - PDF report (would be from export_agent)\n');
}

/**
 * Example 6: Agent Discovery
 * Orchestrator finds agents by capability
 */
async function example6_AgentDiscovery() {
  console.log('Example 6: Agent Discovery');
  console.log('==========================\n');

  const orchestrator = new AgentOrchestrator();

  // Get orchestrator status
  const status = orchestrator.getStatus();

  console.log('Registered Agents:');
  console.log(`Total: ${status.totalAgents}\n`);

  status.agents.forEach(agent => {
    console.log(`${agent.name} (${agent.language})`);
    console.log(`  Capabilities: ${agent.capabilities}`);
    console.log(`  Status: ${agent.status}\n`);
  });

  // Find agents by capability
  console.log('Finding agents by capability:\n');

  const capabilities = ['create_chart', 'analyze_data', 'calculate_statistics'];

  for (const capability of capabilities) {
    const agents = orchestrator.findAgentsByCapability(capability);
    console.log(`"${capability}"`);
    console.log(`  Found: ${agents.map(a => a.name).join(', ') || 'none'}\n`);
  }

  console.log('✓ Agent discovery complete\n');
}

/**
 * Example 7: Error Handling and Fallbacks
 * Orchestrator handles agent failures gracefully
 */
async function example7_ErrorHandling() {
  console.log('Example 7: Error Handling & Fallbacks');
  console.log('======================================\n');

  const orchestrator = new AgentOrchestrator();

  console.log('Scenario: Agent failure with fallback strategy\n');

  console.log('Attempt 1: Try primary agent');
  try {
    // This would fail if agent is unavailable
    const result = await orchestrator.routeByCondition(
      'Analyze complex data',
      () => 'advanced_analytics_agent' // Doesn't exist
    );

    if (result.error) {
      console.log(`  ✗ Primary agent failed: ${result.error}`);
      console.log('\nAttempt 2: Fallback to basic data agent');

      const fallback = await orchestrator.routeByCondition(
        'Calculate basic statistics',
        () => 'data_agent'
      );

      console.log(`  ✓ Fallback successful: ${fallback.agent}`);
    }
  } catch (error) {
    console.log('  Handled error gracefully');
  }

  console.log('\nFallback Strategies:');
  console.log('1. Try alternative agent with similar capability');
  console.log('2. Break complex task into simpler subtasks');
  console.log('3. Return partial results with error notification');
  console.log('4. Queue for retry with exponential backoff\n');

  console.log('✓ Error handling complete\n');
}

/**
 * Example 8: Dynamic Agent Registration
 * Add and remove agents at runtime
 */
async function example8_DynamicRegistration() {
  console.log('Example 8: Dynamic Agent Registration');
  console.log('======================================\n');

  const orchestrator = new AgentOrchestrator();

  console.log('Initial agents:', orchestrator.getStatus().totalAgents);

  // Register a new agent
  console.log('\nRegistering new NLP agent...');
  orchestrator.registerAgent({
    name: 'nlp_agent',
    language: 'python',
    capabilities: [
      'sentiment_analysis',
      'text_classification',
      'entity_extraction',
      'summarization'
    ],
    endpoint: 'http://localhost:8001/nlp-agent'
  });

  console.log('Updated agents:', orchestrator.getStatus().totalAgents);

  // Register export agent
  console.log('\nRegistering export agent...');
  orchestrator.registerAgent({
    name: 'export_agent',
    language: 'go',
    capabilities: [
      'export_pdf',
      'export_excel',
      'export_csv',
      'generate_report'
    ],
    endpoint: 'http://localhost:8002/export-agent'
  });

  console.log('Final agents:', orchestrator.getStatus().totalAgents);

  // Show all capabilities
  console.log('\nAll Available Capabilities:');
  const status = orchestrator.getStatus();
  status.agents.forEach(agent => {
    console.log(`  ${agent.name}: ${agent.capabilities} capabilities`);
  });

  console.log('\n✓ Dynamic registration complete\n');
}

/**
 * Main - Run all examples
 */
async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('ORCHESTRATOR EXAMPLES - Multi-Agent Coordination');
  console.log('='.repeat(70) + '\n');

  try {
    await example1_SimpleDelegation();
    await example2_SequentialWorkflow();
    await example3_ParallelExecution();
    await example4_ConditionalRouting();
    await example5_ComplexWorkflow();
    await example6_AgentDiscovery();
    await example7_ErrorHandling();
    await example8_DynamicRegistration();

    console.log('='.repeat(70));
    console.log('ALL EXAMPLES COMPLETED');
    console.log('='.repeat(70));

    console.log('\nKey Takeaways:');
    console.log('1. Orchestrator coordinates agents across multiple languages');
    console.log('2. Supports sequential, parallel, and conditional execution');
    console.log('3. Agents can be registered/unregistered dynamically');
    console.log('4. Built-in error handling and fallback strategies');
    console.log('5. Automatic capability discovery and routing');
    console.log('6. Scales from 2 agents to dozens of specialized agents\n');

  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run examples
main().catch(console.error);
