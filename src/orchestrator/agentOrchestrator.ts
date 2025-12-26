/**
 * Agent Orchestrator - Coordinates multiple agents across languages
 *
 * This orchestrator can manage:
 * - TypeScript agents (Chart, API, Export)
 * - Python agents (Data, NLP, ML)
 * - Any other ADK-compatible agents
 *
 * Orchestration Patterns:
 * 1. Task Delegation: Route tasks to appropriate agents
 * 2. Sequential Workflow: Chain agents in order
 * 3. Parallel Execution: Run agents concurrently
 * 4. Conditional Routing: Choose agents based on conditions
 */

import { LlmAgent, FunctionTool } from '@google/adk';
import { z } from 'zod';
import { ChartAgent } from '../agent/chartAgent.js';

/**
 * Agent Registry - Track all available agents
 */
interface AgentInfo {
  name: string;
  language: 'typescript' | 'python' | 'go' | 'java';
  capabilities: string[];
  endpoint?: string; // For remote agents
  instance?: any; // For local agents
}

/**
 * Task Context - Shared state between agents
 */
interface TaskContext {
  taskId: string;
  request: string;
  data?: any;
  results: Map<string, any>;
  metadata: {
    startTime: number;
    steps: Array<{
      agent: string;
      action: string;
      result: any;
      duration: number;
    }>;
  };
}

/**
 * Orchestrator Agent
 */
export class AgentOrchestrator {
  private agents: Map<string, AgentInfo>;
  private orchestratorAgent: LlmAgent;

  constructor() {
    this.agents = new Map();
    this.registerDefaultAgents();
    this.orchestratorAgent = this.createOrchestrator();
  }

  /**
   * Register default agents
   */
  private registerDefaultAgents() {
    // TypeScript Chart Agent
    this.registerAgent({
      name: 'chart_agent',
      language: 'typescript',
      capabilities: [
        'create_line_chart',
        'create_bar_chart',
        'create_pie_chart',
        'create_scatter_plot',
        'visualize_data'
      ],
      instance: new ChartAgent()
    });

    // Python Data Agent (simulated)
    this.registerAgent({
      name: 'data_agent',
      language: 'python',
      capabilities: [
        'calculate_statistics',
        'transform_data',
        'generate_insights',
        'analyze_patterns'
      ],
      endpoint: 'http://localhost:8000/data-agent' // Would be actual endpoint
    });

    // More agents can be registered...
  }

  /**
   * Register a new agent
   */
  registerAgent(agent: AgentInfo) {
    this.agents.set(agent.name, agent);
    console.log(`✓ Registered ${agent.language} agent: ${agent.name}`);
  }

  /**
   * Unregister an agent
   */
  unregisterAgent(name: string) {
    this.agents.delete(name);
  }

  /**
   * Find agents by capability
   */
  findAgentsByCapability(capability: string): AgentInfo[] {
    return Array.from(this.agents.values()).filter(
      agent => agent.capabilities.includes(capability)
    );
  }

  /**
   * Create the orchestrator agent
   */
  private createOrchestrator(): LlmAgent {
    // Tool: Delegate task to specific agent
    const delegateTaskTool = new FunctionTool({
      name: 'delegate_to_agent',
      description: 'Delegate a task to a specific agent by name',
      parameters: z.object({
        agentName: z.string().describe('Name of the agent to delegate to'),
        task: z.string().describe('Task description for the agent'),
        data: z.any().optional().describe('Data to pass to the agent')
      }),
      func: async ({ agentName, task, data }) => {
        return await this.delegateToAgent(agentName, task, data);
      }
    });

    // Tool: Find best agent for capability
    const findAgentTool = new FunctionTool({
      name: 'find_agent_for_task',
      description: 'Find the best agent for a specific capability or task',
      parameters: z.object({
        capability: z.string().describe('Required capability (e.g., "create_chart", "analyze_data")')
      }),
      func: async ({ capability }) => {
        const agents = this.findAgentsByCapability(capability);
        return {
          found: agents.length > 0,
          agents: agents.map(a => ({ name: a.name, language: a.language })),
          count: agents.length
        };
      }
    });

    // Tool: Execute workflow (sequential)
    const executeWorkflowTool = new FunctionTool({
      name: 'execute_workflow',
      description: 'Execute a sequential workflow across multiple agents',
      parameters: z.object({
        workflow: z.array(
          z.object({
            agent: z.string(),
            task: z.string(),
            useResultFrom: z.string().optional()
          })
        ).describe('Array of steps in the workflow')
      }),
      func: async ({ workflow }) => {
        return await this.executeWorkflow(workflow);
      }
    });

    // Tool: Execute in parallel
    const executeParallelTool = new FunctionTool({
      name: 'execute_parallel',
      description: 'Execute tasks on multiple agents in parallel',
      parameters: z.object({
        tasks: z.array(
          z.object({
            agent: z.string(),
            task: z.string(),
            data: z.any().optional()
          })
        ).describe('Array of tasks to execute in parallel')
      }),
      func: async ({ tasks }) => {
        return await this.executeParallel(tasks);
      }
    });

    // Create orchestrator agent
    return new LlmAgent({
      name: 'orchestrator',
      description: 'Coordinates multiple agents to complete complex tasks',
      model: 'gemini-3-flash',
      instruction: `You are an orchestrator agent that coordinates multiple specialized agents.

Available Agents:
${Array.from(this.agents.entries()).map(([name, info]) =>
  `- ${name} (${info.language}): ${info.capabilities.join(', ')}`
).join('\n')}

Your Role:
1. Analyze user requests to determine which agents are needed
2. Delegate tasks to appropriate agents based on their capabilities
3. Coordinate workflows when multiple agents need to collaborate
4. Combine results from different agents into a cohesive response

Strategies:
- Use delegate_to_agent for single-agent tasks
- Use execute_workflow for sequential multi-agent tasks
- Use execute_parallel for independent concurrent tasks
- Use find_agent_for_task when you need to discover capabilities

Always explain your orchestration strategy to the user.`,
      tools: [
        delegateTaskTool,
        findAgentTool,
        executeWorkflowTool,
        executeParallelTool
      ]
    });
  }

  /**
   * Pattern 1: Task Delegation
   * Route a task to a specific agent
   */
  private async delegateToAgent(
    agentName: string,
    task: string,
    data?: any
  ): Promise<any> {
    const agent = this.agents.get(agentName);

    if (!agent) {
      return { error: `Agent ${agentName} not found` };
    }

    console.log(`\n→ Delegating to ${agentName} (${agent.language})`);
    console.log(`  Task: ${task}`);

    try {
      // Local TypeScript agent
      if (agent.instance && agent.language === 'typescript') {
        const result = await agent.instance.processMessage(task);
        return { success: true, agent: agentName, result };
      }

      // Remote agent (Python, Go, etc.) - would make HTTP call
      if (agent.endpoint) {
        // Simulated for now - would be actual HTTP request
        return {
          success: true,
          agent: agentName,
          result: `[Simulated ${agent.language} agent response]`,
          note: `Would call ${agent.endpoint}`
        };
      }

      return { error: 'Agent has no instance or endpoint' };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  /**
   * Pattern 2: Sequential Workflow
   * Execute agents in sequence, passing results forward
   */
  private async executeWorkflow(
    workflow: Array<{ agent: string; task: string; useResultFrom?: string }>
  ): Promise<any> {
    console.log('\n→ Executing Sequential Workflow');
    console.log(`  Steps: ${workflow.length}`);

    const results = new Map<string, any>();
    const steps: any[] = [];

    for (let i = 0; i < workflow.length; i++) {
      const step = workflow[i];
      const startTime = Date.now();

      console.log(`\n  Step ${i + 1}/${workflow.length}: ${step.agent}`);

      // Get data from previous step if specified
      let data = undefined;
      if (step.useResultFrom && results.has(step.useResultFrom)) {
        data = results.get(step.useResultFrom);
        console.log(`    Using result from: ${step.useResultFrom}`);
      }

      // Execute step
      const result = await this.delegateToAgent(step.agent, step.task, data);
      results.set(step.agent, result);

      steps.push({
        step: i + 1,
        agent: step.agent,
        task: step.task,
        duration: Date.now() - startTime,
        success: !result.error
      });
    }

    return {
      success: true,
      workflowType: 'sequential',
      steps,
      finalResult: results.get(workflow[workflow.length - 1].agent)
    };
  }

  /**
   * Pattern 3: Parallel Execution
   * Execute multiple agents concurrently
   */
  private async executeParallel(
    tasks: Array<{ agent: string; task: string; data?: any }>
  ): Promise<any> {
    console.log('\n→ Executing Parallel Tasks');
    console.log(`  Agents: ${tasks.length}`);

    const startTime = Date.now();

    // Execute all tasks in parallel
    const promises = tasks.map(async (task) => {
      const result = await this.delegateToAgent(task.agent, task.task, task.data);
      return { agent: task.agent, result };
    });

    const results = await Promise.all(promises);

    return {
      success: true,
      executionType: 'parallel',
      totalDuration: Date.now() - startTime,
      results
    };
  }

  /**
   * Pattern 4: Conditional Routing
   * Route to different agents based on conditions
   */
  async routeByCondition(
    request: string,
    condition: (request: string) => string
  ): Promise<any> {
    const targetAgent = condition(request);
    console.log(`\n→ Conditional Routing: ${targetAgent}`);
    return await this.delegateToAgent(targetAgent, request);
  }

  /**
   * High-level orchestration interface
   */
  async orchestrate(request: string): Promise<string> {
    console.log('\n' + '='.repeat(60));
    console.log('ORCHESTRATOR PROCESSING REQUEST');
    console.log('='.repeat(60));
    console.log(`Request: ${request}\n`);

    try {
      const response = await this.orchestratorAgent.generate(request);
      return response.text || 'Task completed';
    } catch (error) {
      console.error('Orchestration error:', error);
      return `Error: ${(error as Error).message}`;
    }
  }

  /**
   * Get orchestrator status
   */
  getStatus() {
    return {
      totalAgents: this.agents.size,
      agents: Array.from(this.agents.entries()).map(([name, info]) => ({
        name,
        language: info.language,
        capabilities: info.capabilities.length,
        status: info.instance || info.endpoint ? 'ready' : 'not configured'
      }))
    };
  }

  /**
   * Manual workflow execution (without LLM orchestration)
   * Useful for deterministic workflows
   */
  async executeManualWorkflow(request: {
    type: 'sequential' | 'parallel';
    steps: Array<{ agent: string; task: string; data?: any }>;
  }): Promise<any> {
    if (request.type === 'sequential') {
      return await this.executeWorkflow(
        request.steps.map(s => ({
          agent: s.agent,
          task: s.task
        }))
      );
    } else {
      return await this.executeParallel(request.steps);
    }
  }
}
