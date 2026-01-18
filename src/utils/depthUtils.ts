import type { Person, Relationship } from '../types';

export const calculateDepths = (people: Person[], relationships: Relationship[]): Record<string, number> => {
    const depths: Record<string, number> = {};
    people.forEach(p => depths[p.id] = 0);

    let changed = true;
    let iterations = 0;
    // We iterate to propagate depths through the whole network
    // A child's depth is always max(parents' depths) + 1
    // A spouse's depth is always same as their partner
    while (changed && iterations < 20) {
        changed = false;
        iterations++;

        // 1. Parent-Child Propagation
        relationships.forEach(r => {
            if (r.type === 'parent') {
                const parentDepth = depths[r.source];
                const childDepth = depths[r.target];
                if (childDepth <= parentDepth) {
                    depths[r.target] = parentDepth + 1;
                    changed = true;
                }
            }
        });

        // 2. Spouse Reconciliation
        relationships.forEach(r => {
            if (r.type === 'spouse') {
                const d1 = depths[r.source];
                const d2 = depths[r.target];
                if (d1 !== d2) {
                    const maxD = Math.max(d1, d2);
                    if (depths[r.source] !== maxD) { depths[r.source] = maxD; changed = true; }
                    if (depths[r.target] !== maxD) { depths[r.target] = maxD; changed = true; }
                }
            }
        });
    }

    return depths;
};
