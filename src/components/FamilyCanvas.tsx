import { useCallback, useEffect, useState, useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Panel,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import type {
    Edge,
    Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useFamilyStore } from '../store/useFamilyStore';
import type { Person } from '../types';
import PersonNode from './PersonNode';
import CoupleNode from './CoupleNode';
import { getLayoutedElements } from '../utils/layoutUtils';
import { calculateDepths } from '../utils/depthUtils';
import { RefreshCcw } from 'lucide-react';

const nodeTypes = {
    person: PersonNode,
    couple: CoupleNode,
};

const FamilyCanvas = ({ onNodeClick }: {
    onNodeClick: (personId: string) => void
}) => {
    const { families, activeFamilyId } = useFamilyStore();
    const activeFamily = families.find(f => f.id === activeFamilyId) || families[0];
    const people = activeFamily?.people || [];
    const relationships = activeFamily?.relationships || [];
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

    const layoutTree = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
        if (currentNodes.length === 0) {
            setNodes([]);
            setEdges([]);
            return;
        }
        const layouted = getLayoutedElements(currentNodes, currentEdges);
        setNodes([...layouted.nodes as any]);
        setEdges([...layouted.edges]);
    }, [setNodes, setEdges]);

    useEffect(() => {
        const depthMap = calculateDepths(people, relationships);
        const finalNodes: Node[] = [];
        const finalEdges: Edge[] = [];
        const processedPersonIds = new Set<string>();

        // 1. Identify Unions (Grouped Spouses)
        const spouseRels = relationships.filter(r => r.type === 'spouse');
        const unions: Map<string, { p1: Person, spouses: { person: Person, status: any }[], relIds: string[] }> = new Map();
        const processedRelIds = new Set<string>();

        const children = new Set(relationships.filter(r => r.type === 'parent').map(r => r.target));

        people.forEach(p => {
            const rels = spouseRels.filter(r => !processedRelIds.has(r.id) && (r.source === p.id || r.target === p.id));
            if (rels.length > 0) {
                const shouldBeAnchor = children.has(p.id) || rels.length > 1 || !rels.some(r => {
                    const spouseId = r.source === p.id ? r.target : r.source;
                    return children.has(spouseId);
                });

                if (shouldBeAnchor) {
                    const group = { p1: p, spouses: [] as any[], relIds: [] as string[] };
                    rels.forEach(rel => {
                        const spouseId = rel.source === p.id ? rel.target : rel.source;
                        const spouse = people.find(s => s.id === spouseId);
                        if (spouse) {
                            group.spouses.push({ person: spouse, status: rel.status || 'married' });
                            group.relIds.push(rel.id);
                            processedRelIds.add(rel.id);
                        }
                    });
                    unions.set(p.id, group);
                    processedPersonIds.add(p.id);
                    group.spouses.forEach(s => processedPersonIds.add(s.person.id));
                }
            }
        });

        spouseRels.forEach(rel => {
            if (processedRelIds.has(rel.id)) return;
            const p1 = people.find(p => p.id === rel.source);
            const p2 = people.find(p => p.id === rel.target);
            if (p1 && p2) {
                unions.set(p1.id, {
                    p1,
                    spouses: [{ person: p2, status: rel.status || 'married' }],
                    relIds: [rel.id]
                });
                processedPersonIds.add(p1.id);
                processedPersonIds.add(p2.id);
                processedRelIds.add(rel.id);
            }
        });

        unions.forEach((union, anchorId) => {
            const cId = `union_${anchorId}`;
            const cDepth = depthMap[anchorId] || 0;
            finalNodes.push({
                id: cId,
                type: 'couple',
                data: { p1: union.p1, spouses: union.spouses, depth: cDepth },
                position: { x: 0, y: 0 },
            });
        });

        people.forEach(p => {
            if (!processedPersonIds.has(p.id)) {
                finalNodes.push({
                    id: p.id,
                    type: 'person',
                    data: { ...p, depth: depthMap[p.id] || 0 },
                    position: { x: 0, y: 0 },
                });
            }
        });

        const childLinks = new Map<string, string[]>();
        relationships.filter(r => r.type === 'parent').forEach(r => {
            if (!childLinks.has(r.target)) childLinks.set(r.target, []);
            childLinks.get(r.target)!.push(r.source);
        });

        childLinks.forEach((parentIds, childId) => {
            const childNodeId = finalNodes.find(n =>
                n.id === childId || (n.type === 'couple' && (n.data.p1.id === childId || n.data.spouses.some((s: any) => s.person.id === childId)))
            )?.id;

            if (!childNodeId) return;

            let linkedToCouple = false;

            unions.forEach((union, anchorId) => {
                const coupleNodeId = `union_${anchorId}`;
                const isAnchorParent = parentIds.includes(union.p1.id);
                const spouseParentIds = union.spouses.filter(s => parentIds.includes(s.person.id)).map(s => s.person.id);

                if (isAnchorParent && spouseParentIds.length > 0) {
                    finalEdges.push({
                        id: `parent_edge_${coupleNodeId}_to_${childNodeId}`,
                        source: coupleNodeId,
                        target: childNodeId,
                        type: 'step',
                        style: { stroke: 'rgba(255, 193, 7, 0.4)', strokeWidth: 4 },
                    });
                    linkedToCouple = true;
                }
            });

            if (!linkedToCouple) {
                parentIds.forEach(pId => {
                    const parentNodeId = finalNodes.find(n =>
                        n.id === pId || (n.type === 'couple' && (n.data.p1.id === pId || n.data.spouses.some((s: any) => s.person.id === pId)))
                    )?.id;

                    if (parentNodeId) {
                        finalEdges.push({
                            id: `direct_edge_${parentNodeId}_to_${childNodeId}`,
                            source: parentNodeId,
                            target: childNodeId,
                            type: 'step',
                            style: { stroke: 'rgba(255, 193, 7, 0.4)', strokeWidth: 4 },
                        });
                    }
                });
            }
        });

        layoutTree(finalNodes, finalEdges);
    }, [people, relationships, layoutTree]);


    const styledNodes = useMemo(() => {
        if (!hoveredNodeId) return nodes;
        return nodes.map(node => {
            const isDirectlyConnected = edges.some(e =>
                (e.source === hoveredNodeId && e.target === node.id) ||
                (e.target === hoveredNodeId && e.source === node.id)
            );
            const isHovered = node.id === hoveredNodeId;

            return {
                ...node,
                style: {
                    ...node.style,
                    opacity: isHovered || isDirectlyConnected ? 1 : 0.3,
                    transition: 'opacity 0.3s ease',
                }
            };
        });
    }, [nodes, edges, hoveredNodeId]);

    const styledEdges = useMemo(() => {
        if (!hoveredNodeId) return edges;
        return edges.map(edge => {
            const isConnected = edge.source === hoveredNodeId || edge.target === hoveredNodeId;
            return {
                ...edge,
                style: {
                    ...edge.style,
                    stroke: isConnected ? '#FFC107' : 'rgba(255, 255, 255, 0.1)',
                    strokeWidth: isConnected ? 3 : 1,
                    opacity: isConnected ? 1 : 0.2,
                }
            };
        });
    }, [edges, hoveredNodeId]);

    return (
        <div className="w-full h-full bg-[#1a1a1a]">
            <ReactFlow
                nodes={styledNodes}
                edges={styledEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onNodeClick={(_, node) => {
                    if (node.type === 'person') onNodeClick(node.id);
                    if (node.type === 'couple') onNodeClick(node.data.p1.id);
                }}
                onNodeMouseEnter={(_, node) => setHoveredNodeId(node.id)}
                onNodeMouseLeave={() => setHoveredNodeId(null)}
                fitView
                fitViewOptions={{ padding: 0 }}
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={true}
                minZoom={0.001}
                maxZoom={4}
            >
                <Background color="rgba(255, 193, 7, 0.05)" gap={30} size={1} />
                <Controls showInteractive={false} className="glass" />
                <Panel position="top-right" className="flex gap-2">
                    <button
                        onClick={() => layoutTree(nodes, edges)}
                        className="flex items-center gap-2 glass px-5 py-2.5 rounded-2xl shadow-xl hover:bg-white/10 transition-all font-bold text-xs text-white/80 active:scale-95 border-white/5"
                    >
                        <RefreshCcw size={14} className="text-[#FFC107]" />
                        REFRESH LAYOUT
                    </button>
                </Panel>
            </ReactFlow>
        </div>
    );
};

export default FamilyCanvas;

