import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Person, Relationship, RelationshipType, Family } from '../types';
import { wouldCreateCycle } from '../utils/graphUtils';

interface FamilyStore {
    families: Family[];
    activeFamilyId: string | null;

    // Family Management
    createFamily: (name: string) => void;
    switchFamily: (id: string) => void;
    deleteFamily: (id: string) => void;
    renameFamily: (id: string, name: string) => void;

    // Active Family Data Getters (facilitates easier component updates)
    getPeople: () => Person[];
    getRelationships: () => Relationship[];

    // Actions (operate on active family)
    addPerson: (person: Omit<Person, 'id'>) => string;
    updatePerson: (id: string, updates: Partial<Person>) => void;
    deletePerson: (id: string) => void;
    addRelationship: (sourceId: string, targetId: string, type: 'parent' | 'spouse', label?: string, status?: 'married' | 'divorced' | 'separated' | 'demised') => boolean;
    removeRelationship: (id: string) => void;
    updateRelationshipStatus: (id: string, status: 'married' | 'divorced' | 'separated' | 'demised') => void;
    connectPeople: (newPersonId: string, relatedToId: string, relType: RelationshipType, status?: 'married' | 'divorced' | 'separated' | 'demised') => void;
    exportAllData: () => string;
    importAllData: (jsonData: string) => boolean;
}

export const useFamilyStore = create<FamilyStore>()(
    persist(
        (set, get) => ({
            families: [
                {
                    id: 'default-family',
                    name: 'Main Family',
                    people: [],
                    relationships: []
                }
            ],
            activeFamilyId: 'default-family',

            getPeople: () => {
                const { families, activeFamilyId } = get();
                const active = families.find(f => f.id === activeFamilyId) || families[0];
                return active ? active.people : [];
            },

            getRelationships: () => {
                const { families, activeFamilyId } = get();
                const active = families.find(f => f.id === activeFamilyId) || families[0];
                return active ? active.relationships : [];
            },

            createFamily: (name) => {
                const newFamily: Family = {
                    id: crypto.randomUUID(),
                    name,
                    people: [],
                    relationships: []
                };
                set((state) => ({
                    families: [...state.families, newFamily],
                    activeFamilyId: newFamily.id
                }));
            },

            switchFamily: (id) => {
                set({ activeFamilyId: id });
            },

            deleteFamily: (id) => {
                set((state) => {
                    const newFamilies = state.families.filter(f => f.id !== id);
                    const newActiveId = id === state.activeFamilyId
                        ? (newFamilies[0]?.id || null)
                        : state.activeFamilyId;
                    return { families: newFamilies, activeFamilyId: newActiveId };
                });
            },

            renameFamily: (id, name) => {
                set((state) => ({
                    families: state.families.map(f => f.id === id ? { ...f, name } : f)
                }));
            },

            addPerson: (personData) => {
                const id = crypto.randomUUID();
                const newPerson = { ...personData, id };
                const { activeFamilyId } = get();

                set((state) => ({
                    families: state.families.map(f =>
                        f.id === activeFamilyId
                            ? { ...f, people: [...f.people, newPerson] }
                            : f
                    )
                }));
                return id;
            },

            updatePerson: (id, updates) => {
                const { activeFamilyId } = get();
                set((state) => ({
                    families: state.families.map(f =>
                        f.id === activeFamilyId
                            ? { ...f, people: f.people.map(p => p.id === id ? { ...p, ...updates } : p) }
                            : f
                    )
                }));
            },

            deletePerson: (id) => {
                const { activeFamilyId } = get();
                set((state) => ({
                    families: state.families.map(f =>
                        f.id === activeFamilyId
                            ? {
                                ...f,
                                people: f.people.filter(p => p.id !== id),
                                relationships: f.relationships.filter(r => r.source !== id && r.target !== id)
                            }
                            : f
                    )
                }));
            },

            addRelationship: (sourceId, targetId, type, label, status) => {
                const { families, activeFamilyId } = get();
                const active = families.find(f => f.id === activeFamilyId);
                if (!active) return false;

                const exists = active.relationships.find(
                    (r) => r.source === sourceId && r.target === targetId && r.type === type
                );
                if (exists) return false;
                if (sourceId === targetId) return false;

                if (type === 'parent' && wouldCreateCycle(active.relationships, sourceId, targetId, 'parent')) {
                    return false;
                }

                const newRel: Relationship = {
                    id: crypto.randomUUID(),
                    source: sourceId,
                    target: targetId,
                    type,
                    label,
                    status,
                };

                set((state) => ({
                    families: state.families.map(f =>
                        f.id === activeFamilyId
                            ? { ...f, relationships: [...f.relationships, newRel] }
                            : f
                    )
                }));
                return true;
            },

            removeRelationship: (id) => {
                const { activeFamilyId } = get();
                set((state) => ({
                    families: state.families.map(f =>
                        f.id === activeFamilyId
                            ? { ...f, relationships: f.relationships.filter(r => r.id !== id) }
                            : f
                    )
                }));
            },

            updateRelationshipStatus: (id, status) => {
                const { activeFamilyId } = get();
                set((state) => ({
                    families: state.families.map(f =>
                        f.id === activeFamilyId
                            ? { ...f, relationships: f.relationships.map(r => r.id === id ? { ...r, status } : r) }
                            : f
                    )
                }));
            },

            connectPeople: (newId, relatedId, type, status) => {
                const store = get();
                const relationships = store.getRelationships();

                switch (type) {
                    case 'father':
                    case 'mother':
                    case 'parent':
                        store.addRelationship(newId, relatedId, 'parent', type.charAt(0).toUpperCase() + type.slice(1));
                        break;
                    case 'son':
                    case 'daughter':
                    case 'child': {
                        store.addRelationship(relatedId, newId, 'parent', type.charAt(0).toUpperCase() + type.slice(1));
                        const spouseRel = relationships.find(
                            r => r.type === 'spouse' && (r.source === relatedId || r.target === relatedId)
                        );
                        if (spouseRel) {
                            const otherParent = spouseRel.source === relatedId ? spouseRel.target : spouseRel.source;
                            store.addRelationship(otherParent, newId, 'parent', 'Parent');
                        }
                        break;
                    }
                    case 'spouse': {
                        store.addRelationship(relatedId, newId, 'spouse', 'Spouse', status || 'married');
                        const existingChildren = relationships
                            .filter(r => r.source === relatedId && r.type === 'parent')
                            .map(r => r.target);
                        existingChildren.forEach(childId => {
                            store.addRelationship(newId, childId, 'parent', 'Parent');
                        });
                        break;
                    }
                    case 'brother':
                    case 'sister': {
                        const parents = relationships
                            .filter(r => r.target === relatedId && r.type === 'parent')
                            .map(r => r.source);
                        if (parents.length > 0) {
                            parents.forEach(pId => store.addRelationship(pId, newId, 'parent', type === 'brother' ? 'Son' : 'Daughter'));
                        }
                        break;
                    }
                }
            },

            exportAllData: () => {
                const state = get();
                const data = {
                    families: state.families,
                    activeFamilyId: state.activeFamilyId
                };
                return JSON.stringify(data, null, 2);
            },

            importAllData: (jsonData: string) => {
                try {
                    const data = JSON.parse(jsonData);
                    if (data.families && Array.isArray(data.families)) {
                        set({
                            families: data.families,
                            activeFamilyId: data.activeFamilyId || data.families[0]?.id || null
                        });
                        return true;
                    }
                    return false;
                } catch (e) {
                    console.error('Import failed', e);
                    return false;
                }
            },
        }),
        {
            name: 'family-tree-storage',
            migrate: (persistedState: any) => {
                let state = persistedState;
                if (persistedState.people && !persistedState.families) {
                    state = {
                        families: [
                            {
                                id: 'main-family',
                                name: 'My Primary Family',
                                people: persistedState.people || [],
                                relationships: persistedState.relationships || []
                            }
                        ],
                        activeFamilyId: 'main-family'
                    };
                }

                if (state.families) {
                    state.families = state.families.map((f: any) => ({
                        ...f,
                        people: f.people.map((p: any) => ({
                            ...p,
                            lifeStatus: p.lifeStatus || (p.deathDate ? 'demised' : 'living')
                        }))
                    }));
                }

                return state;
            }
        }
    )
);
