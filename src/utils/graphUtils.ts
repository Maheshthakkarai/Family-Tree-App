import type { Relationship, RelationshipType } from '../types';

/**
 * Checks if adding a relationship would create a circular dependency.
 * Specifically for 'parent' relationships.
 * source is parent of target.
 * We need to check if source is already a descendant of target.
 */
export const wouldCreateCycle = (
    relationships: Relationship[],
    sourceId: string,
    targetId: string,
    type: RelationshipType
): boolean => {
    if (type !== 'parent') return false;

    const getDescendants = (id: string, visited: Set<string> = new Set()): Set<string> => {
        visited.add(id);
        const children = relationships
            .filter(r => r.source === id && r.type === 'parent')
            .map(r => r.target);

        for (const child of children) {
            if (!visited.has(child)) {
                getDescendants(child, visited);
            }
        }
        return visited;
    };

    const descendantsOfTarget = getDescendants(targetId);
    return descendantsOfTarget.has(sourceId);
};
