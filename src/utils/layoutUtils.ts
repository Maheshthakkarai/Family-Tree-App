import dagre from 'dagre';
import type { Node, Edge } from 'reactflow';

const personWidth = 140;
const coupleWidth = 260; // 120 + 120 + divider + padding
const nodeHeight = 70;

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({
        rankdir: 'TB',
        nodesep: 150,
        ranksep: 100,
        marginx: 100,
        marginy: 100,
    });

    nodes.forEach((node) => {
        const isCouple = node.type === 'couple';
        dagreGraph.setNode(node.id, {
            width: isCouple ? coupleWidth : personWidth,
            height: nodeHeight
        });
    });

    edges.forEach((edge) => {
        // High priority for parental flow
        dagreGraph.setEdge(edge.source, edge.target, { weight: 100, minlen: 1 });
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const isCouple = node.type === 'couple';
        const depth = node.data.depth || 0;

        // Force strict vertical positioning by generation
        const verticalY = depth * 220 + 50;

        return {
            ...node,
            position: {
                x: nodeWithPosition.x - (isCouple ? coupleWidth / 2 : personWidth / 2),
                y: verticalY,
            },
        };
    });

    return { nodes: newNodes, edges };
};
