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
    const { p1, spouses, depth } = data;

    const generationColors = [
        'border-[#7B61FF]', // Gen 0
        'border-[#00C48C]', // Gen 1
        'border-[#0071E3]', // Gen 2
        'border-[#97D700]', // Gen 3
        'border-[#F59E0B]'  // Gen 4
    ];

    const borderColor = generationColors[Math.min(depth, generationColors.length - 1)];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'divorced':
                return {
                    icon: <HeartOff size={10} className="text-red-500" />,
                    label: 'Divorced',
                    color: 'bg-red-50 text-red-600 border-red-100',
                    divider: 'bg-red-200'
                };
            case 'separated':
                return {
                    icon: <UserMinus size={10} className="text-orange-500" />,
                    label: 'Separated',
                    color: 'bg-orange-50 text-orange-600 border-orange-100',
                    divider: 'bg-orange-200'
                };
            case 'demised':
                return {
                    icon: <Skull size={10} className="text-gray-500" />,
                    label: 'Demised',
                    color: 'bg-gray-50 text-gray-600 border-gray-100',
                    divider: 'bg-gray-200'
                };
            default:
                return {
                    icon: <Heart size={10} className="text-pink-500 fill-pink-500" />,
                    label: 'Married',
                    color: 'bg-pink-50 text-pink-600 border-pink-100',
                    divider: 'bg-gray-200'
                };
        }
    };

    return (
        <div className="group relative">
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-slate-300 !border-white !w-2 !h-2"
            />

            <div className={`flex items-stretch bg-white border-2 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${borderColor} ${selected ? 'ring-4 ring-blue-500/20 scale-105 z-10' : 'hover:shadow-2xl'}`}>
                {/* Main Person (P1) */}
                <div className={`w-[120px] px-3 py-4 flex flex-col justify-center text-center border-r border-gray-100 bg-[#F8FAFC]/50 ${p1.lifeStatus === 'demised' ? 'grayscale opacity-70' : ''}`}>
                    <div className="text-[12px] font-black text-[#1D1D1F] leading-tight uppercase tracking-tight relative">
                        {p1.firstName}
                        {p1.lifeStatus === 'demised' && <Skull size={8} className="absolute -right-2 -top-1 opacity-40" />}
                    </div>
                    <div className="text-[10px] font-bold text-[#64748B] leading-tight uppercase mt-0.5 tracking-tighter">
                        {p1.lastName}
                    </div>
                </div>

                {/* Spouses Column */}
                <div className="flex flex-col flex-1 divide-y divide-gray-100">
                    {spouses.map((s, idx) => {
                        const styles = getStatusStyles(s.status);
                        return (
                            <div key={idx} className="flex items-stretch min-w-[140px]">
                                {/* Divider/Status Point */}
                                <div className="flex flex-col items-center justify-center bg-white px-2 relative border-r border-gray-50">
                                    <div className={`w-[1px] h-full ${styles.divider}`} />
                                    <div className={`absolute inset-0 flex items-center justify-center`}>
                                        <div className={`w-5 h-5 rounded-full border shadow-sm flex items-center justify-center bg-white z-10`}>
                                            {styles.icon}
                                        </div>
                                    </div>
                                </div>

                                {/* Spouse Box */}
                                <div className={`flex-1 px-3 py-4 flex flex-col justify-center text-center bg-white relative ${s.person.lifeStatus === 'demised' ? 'grayscale opacity-70' : ''}`}>
                                    <div className="text-[12px] font-black text-[#1D1D1F] leading-tight uppercase tracking-tight relative">
                                        {s.person.firstName}
                                        {s.person.lifeStatus === 'demised' && <Skull size={8} className="absolute -right-2 -top-1 opacity-40" />}
                                    </div>
                                    <div className="text-[10px] font-bold text-[#64748B] leading-tight uppercase mt-0.5 tracking-tighter">
                                        {s.person.lastName}
                                    </div>

                                    {/* Small Status Badge for each spouse */}
                                    <div className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[6px] font-black uppercase tracking-wider ${styles.color}`}>
                                        {styles.label}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-emerald-500 !border-white !w-2 !h-2"
            />
        </div>
    );
};

export default memo(CoupleNode);
