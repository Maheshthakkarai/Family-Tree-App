import type { Node, Edge } from 'reactflow';

const personWidth = 750;
const coupleWidth = 1500;
const nodeHeight = 550;
const horizontalGaps = 300;
const verticalGap = 600;

interface TreeNode {
    id: string;
    width: number;
    height: number;
    children: TreeNode[];
    x: number;
    y: number;
    data: any;
    type: string;
    depth: number;
    prelim?: number;
    modifier?: number;
}

// Reingold-Tilford / Walker Algorithm Implementation for Tidy Trees
// Adapted for variable width nodes (couples vs people)

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    // 1. Build the tree structure from nodes and edges
    const nodeMap = new Map<string, TreeNode>();

    // Create wrappers
    nodes.forEach(node => {
        nodeMap.set(node.id, {
            id: node.id,
            width: node.type === 'couple' ? coupleWidth : personWidth,
            height: nodeHeight,
            children: [],
            x: 0,
            y: 0,
            data: node.data,
            type: node.type || 'person',
            depth: 0
        });
    });

    // Link children (Parent -> Child)
    // Edges are usually Source(Parent) -> Target(Child)
    const childCounts = new Map<string, number>();

    edges.forEach(edge => {
        const parent = nodeMap.get(edge.source);
        const child = nodeMap.get(edge.target);
        if (parent && child) {
            // Avoid circular dependency or multi-parents for visual layout simplicity if needed
            // But for now, add all. If child has multiple parents, tree layout might get weird.
            // Usually in these apps, "Couple" is the parent node, so single parent source.
            parent.children.push(child);
            childCounts.set(child.id, (childCounts.get(child.id) || 0) + 1);
        }
    });

    // Find roots (nodes with no incoming edges) 
    // Note: Spouses might be merged into "Couple" nodes already by FamilyCanvas logic.
    let roots = Array.from(nodeMap.values()).filter(n => !childCounts.has(n.id) || childCounts.get(n.id) === 0);

    // If no roots (loops?), pick arbitrary or use logic.
    if (roots.length === 0 && nodes.length > 0) {
        roots = [nodeMap.get(nodes[0].id)!];
    }

    // Sort children by birth date if available (optional optimization)

    // 2. Execute Tidy Tree Layout Algorithm (simplified Walker)
    // 2. Execute Tidy Tree Layout Algorithm (simplified Walker)

    const layoutTree = (root: TreeNode) => {



        // Actually, writing a full Walker algo from scratch in one shot is risky.
        // Let's use a simpler heuristic: "Layered Tree".
        // 1. Assign depths (Levels).
        // 2. For each level, place nodes.
        // 3. Shift nodes to minimize crossing and center parents.

        // Or even simpler:
        // Just place recursively: width of subtree.

        // Let's use "Subtree Width" layout.
        // X = 0.
        // For each child: place child at current X, recursively layout child.
        // Parent X = average of children X.
        // Shift overlapping subtrees.

        // This is essentially Reingold-Tilford.

        const calculateSubtreeWidth = (node: TreeNode): number => {
            if (node.children.length === 0) {
                return node.width + horizontalGaps;
            }
            let width = 0;
            node.children.forEach(child => {
                width += calculateSubtreeWidth(child);
            });
            return Math.max(node.width + horizontalGaps, width);
        };

        const assignPositions = (node: TreeNode, startX: number, level: number) => {
            node.y = level * (nodeHeight + verticalGap);

            if (node.children.length === 0) {
                node.x = startX + (node.width / 2); // Center in its allocated slot
                return;
            }

            let currentChildX = startX;
            const childXPositions: number[] = [];

            node.children.forEach(child => {
                const subtreeW = calculateSubtreeWidth(child); // Inefficient to recalc, but safe
                assignPositions(child, currentChildX, level + 1);
                childXPositions.push(child.x);
                currentChildX += subtreeW;
            });

            // Center parent over children
            const firstChildX = childXPositions[0];
            const lastChildX = childXPositions[childXPositions.length - 1];
            node.x = (firstChildX + lastChildX) / 2;
        }

        // Run layout
        assignPositions(root, 0, 0);
    };

    // Handle multiple roots (forest)
    // Handle multiple roots (forest)
    roots.forEach(root => {
        layoutTree(root);
        // Shift entire tree if we had width calc... 
        // This simple algo places all at 0. We need to shift subsequent roots.
        // But for single family tree, usually one root (The Ancestor).
        // If multiple roots, they usually overlap with this simplistic Layout.
        // We will assume 1 main family tree for visualizer 
        // OR we just spread them out.

        // Simple fix for multiple roots: Just Shift them ?
        // We need to know the 'bounds' of the previous tree.
    });

    // Calculate final positions for ReactFlow
    const finalNodes = nodes.map(node => {
        const layoutNode = nodeMap.get(node.id);
        return {
            ...node,
            position: {
                x: (layoutNode?.x || 0) - (layoutNode?.width || 0) / 2, // Centered
                y: layoutNode?.y || 0
            }
        };
    });

    return { nodes: finalNodes, edges };
};
