"use client";

import { Workflow } from "@/actions/workflows/getWorkflowsUser";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect } from "react";

import "@xyflow/react/dist/style.css";
import NodeComponent from "./nodes/NodeComponent";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import { AppNode } from "@/types/appNode";
import DeletableEdge from "./edges/DeletableEdge";

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const edgeTypes = {
  default: DeletableEdge,
};

const snapGrid: [number, number] = [50, 50];

const WorkflowEditor = ({ workflow }: { workflow: Workflow }) => {
  const fitViewOptions = { padding: 1 };
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const taskType = e.dataTransfer.getData("application/reactflow");

    if (typeof taskType === undefined) return;

    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });

    const newNode = CreateFlowNode(taskType as TaskType, position);
    setNodes((nodes) => nodes.concat(newNode));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((edges) => addEdge({ ...connection, animated: true }, edges));
  }, []);

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;

      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;

      setViewport({ x, y, zoom });
    } catch (err) {}
  }, [setEdges, setNodes, workflow.definition, setViewport]);

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        fitView
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Cross} gap={12} size={4} />
      </ReactFlow>
    </main>
  );
};

export default WorkflowEditor;
