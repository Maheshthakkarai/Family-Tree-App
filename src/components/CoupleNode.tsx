import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { Person } from '../types';
import { Heart, HeartOff, UserMinus, Skull } from 'lucide-react';

interface SpouseEntry {
    person: Person;
    status: 'married' | 'divorced' | 'separated' | 'demised';
}

interface CoupleNodeData {
    p1: Person;
    spouses: SpouseEntry[];
    depth: number;
}

const CoupleNode = ({ data, selected }: NodeProps<CoupleNodeData>) => {
    const { p1, spouses } = data;

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'divorced':
                return {
                    icon: <HeartOff size={24} className="text-red-600" />,
                    label: 'Divorced',
                    color: 'text-red-900 border-red-900/10 bg-red-600/10',
                };
            case 'separated':
                return {
                    icon: <UserMinus size={24} className="text-orange-700" />,
                    label: 'Separated',
                    color: 'text-orange-900 border-orange-900/10 bg-orange-600/10',
                };
            case 'demised':
                return {
                    icon: <Skull size={24} className="text-gray-700" />,
                    label: 'Demised',
                    color: 'text-gray-900 border-gray-900/10 bg-gray-600/10',
                };
            default:
                return {
                    icon: <Heart size={24} className="text-[#1a1a1a] fill-[#1a1a1a]" />,
                    label: 'Married',
                    color: 'text-[#1a1a1a] border-[#1a1a1a]/10 bg-[#1a1a1a]/5',
                };
        }
    };

    const getInitials = (person: Person) => {
        return `${person.firstName?.[0] || ''}${person.lastName?.[0] || ''}`.toUpperCase();
    };

    return (
        <div className="group relative">
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-[#FFC107] !border-[#1a1a1a] !w-3 !h-3"
            />

            <div className={`flex flex-col gap-20 p-24 rounded-[80px] transition-all duration-500
                    ${selected ? 'bg-[#e0a800] ring-8 ring-white shadow-2xl scale-105 z-20' : 'bg-[#FFC107] hover:bg-[#ffc82a] shadow-xl'}
                    text-[#1a1a1a]`}>

                <div className="flex items-center gap-20">
                    {/* Main Person Avatar */}
                    <div className="flex flex-col items-center gap-8">
                        <div className={`w-[450px] h-[450px] rounded-[60px] border-4 flex items-center justify-center shadow-inner
              ${selected ? 'border-white/50 bg-black/5' : 'border-[#1a1a1a]/10 bg-black/5'}
              ${p1.lifeStatus === 'demised' ? 'grayscale opacity-70' : ''}`}>
                            <span className={`text-[120px] font-display font-bold text-[#1a1a1a]`}>
                                {getInitials(p1)}
                            </span>
                        </div>
                        <div className="text-6xl font-display font-bold text-[#1a1a1a] uppercase tracking-tight">{p1.firstName}</div>
                    </div>

                    {/* Spouses List */}
                    <div className="flex flex-col gap-3">
                        {spouses.map((s, idx) => {
                            const styles = getStatusStyles(s.status);
                            return (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full border border-[#1a1a1a]/20 flex items-center justify-center bg-white/20">
                                            {styles.icon}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pr-2">
                                        <div className={`w-[350px] h-[350px] rounded-[40px] border-2 flex items-center justify-center bg-black/5
                      ${s.person.lifeStatus === 'demised' ? 'grayscale opacity-70' : ''}
                      border-[#1a1a1a]/10`}>
                                            <span className="text-[100px] font-display font-bold text-[#1a1a1a]/80">
                                                {getInitials(s.person)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="text-5xl font-display font-bold text-[#1a1a1a]/90 uppercase leading-none">{s.person.firstName}</div>
                                            <div className={`text-2xl font-black uppercase tracking-widest mt-2 ${styles.color} px-4 py-2 rounded-xl bg-black/5`}>
                                                {styles.label}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-[#FFC107] !border-[#1a1a1a] !w-3 !h-3"
            />
        </div>
    );
};

export default memo(CoupleNode);

