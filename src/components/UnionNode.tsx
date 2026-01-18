import { memo } from 'react';
import { Handle, Position } from 'reactflow';

const UnionNode = () => {
    return (
        <div className="w-2 h-2 flex items-center justify-center">
            {/* Minimal invisible point to anchor family branches */}
            <Handle type="target" position={Position.Top} className="!opacity-0 !w-0 !h-0" />
            <div className="w-1 h-1 bg-emerald-500 rounded-full opacity-40" />
            <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-0 !h-0" />
        </div>
    );
};

export default memo(UnionNode);
