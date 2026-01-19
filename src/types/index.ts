export type RelationshipType =
    | 'father' | 'mother' | 'parent'
    | 'spouse'
    | 'son' | 'daughter' | 'child'
    | 'brother' | 'sister';

export type Gender = 'male' | 'female' | 'not_specified';

export type LifeStatus = 'living' | 'demised';

export interface Person {
    id: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    lifeStatus: LifeStatus;
    birthDate?: string;
    deathDate?: string;
    photoUrl?: string;
    bio?: string;
    occupation?: string;
}

export interface Relationship {
    id: string;
    source: string; // The "Senior" node (Parent/Spouse)
    target: string; // The "Junior" node (Child/Spouse)
    type: 'parent' | 'spouse'; // We simplify the underlying storage to these two core types
    label?: string; // Metadata label like "Father", "Daughter" etc.
    status?: 'married' | 'divorced' | 'separated' | 'demised';
}

export interface Family {
    id: string;
    name: string;
    people: Person[];
    relationships: Relationship[];
}

export interface FamilyState {
    families: Family[];
    activeFamilyId: string | null;
}
