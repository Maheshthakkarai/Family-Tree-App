import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { Person } from '../types';
import { Skull } from 'lucide-react';

const PersonNode = ({ data, selected }: NodeProps<Person & { depth?: number }>) => {
    const { firstName, lastName, lifeStatus } = data;

    const generationColors = [
        'border-[#7B61FF] bg-white', // Gen 0
        'border-[#00C48C] bg-white', // Gen 1
        'border-[#0071E3] bg-white', // Gen 2
        'border-[#97D700] bg-white', // Gen 3
        'border-[#F59E0B] bg-white'  // Gen 4
    ];

    const depth = (data as any).depth || 0;
    const borderColor = generationColors[Math.min(depth, generationColors.length - 1)].split(' ')[0];

    return (
        <div className="group relative">
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-slate-300 !border-white !w-2 !h-2"
            />

            <div className={`w-[140px] px-2 py-3 border-2 rounded-lg shadow-sm transition-all duration-300 flex flex-col justify-center text-center bg-white ${borderColor} ${selected ? 'ring-4 ring-blue-500/20 border-blue-500 z-10' : 'hover:shadow-md'} ${lifeStatus === 'demised' ? 'grayscale-[0.5] opacity-80' : ''}`}>
                <div className="text-[12px] font-black text-[#1D1D1F] leading-tight uppercase tracking-tight">
                    {firstName}
                </div>
                <div className="text-[10px] font-bold text-[#4B5563] leading-tight uppercase mt-0.5 tracking-tighter">
                    {lastName}
                </div>

                {lifeStatus === 'demised' && (
                    <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 shadow-sm">
                        <Skull size={12} />
                    </div>
                )}
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-slate-300 !border-white !w-2 !h-2"
            />
        </div>
    );
};

export default memo(PersonNode);
