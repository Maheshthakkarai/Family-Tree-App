import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { Person } from '../types';
import { Skull } from 'lucide-react';

const PersonNode = ({ data, selected }: NodeProps<Person & { depth?: number }>) => {
    const { firstName, lastName, lifeStatus } = data;

    const getInitials = () => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    return (
        <div className="group relative">
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-[#FFC107] !border-[#1a1a1a] !w-3 !h-3"
            />

            <div className={`relative flex flex-col items-center justify-center transition-all duration-500 ${selected ? 'scale-110 z-20' : 'hover:scale-105'}`}>
                {/* Glow Effect */}
                {selected && (
                    <div className="absolute inset-0 rounded-full bg-[#FFC107]/40 blur-xl animate-pulse" />
                )}

                {/* Circular Avatar */}
                <div
                    className={`relative w-[700px] h-[450px] rounded-[60px] border-8 flex items-center justify-center transition-all duration-300 shadow-2xl
            ${selected ? 'border-white shadow-xl bg-[#e0a800] scale-105' : 'border-[#FFC107]/50 bg-[#FFC107] hover:border-white/50'}`}
                >
                    <div className={`w-full h-full rounded-[60px] flex items-center justify-center overflow-hidden mix-blend-multiply opacity-10
            ${selected ? 'bg-black/10' : 'bg-transparent'}`}>
                        <span className={`text-[120px] font-display font-bold text-[#1a1a1a]`}>
                            {getInitials()}
                        </span>
                    </div>

                    {lifeStatus === 'demised' && (
                        <div className="absolute -top-1 -right-1 w-8 h-8 glass rounded-full flex items-center justify-center text-white/40 border-white/10">
                            <Skull size={14} />
                        </div>
                    )}
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full z-10 pointer-events-none">
                    <div className="text-[140px] font-display font-bold text-[#1a1a1a]/10 absolute inset-0 flex items-center justify-center select-none">
                        {getInitials()}
                    </div>
                    <div className={`text-6xl font-display font-black leading-none mb-6 text-[#1a1a1a] drop-shadow-sm`}>
                        {firstName}
                    </div>
                    <div className="text-3xl font-sans font-black text-[#1a1a1a]/80 uppercase tracking-[0.4em]">
                        {lastName}
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

export default memo(PersonNode);

