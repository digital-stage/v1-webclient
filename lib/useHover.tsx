import {MutableRefObject, useEffect, useState} from 'react';

// Hook
export default function useHover<T extends HTMLElement>(parent: MutableRefObject<T>) {
    const [value, setValue] = useState(false);

    const handleMouseOver = () => setValue(true);
    const handleMouseOut = () => setValue(false);

    useEffect(
        () => {
            const node = parent.current;
            if (node) {
                node.addEventListener('mouseover', handleMouseOver);
                node.addEventListener('mouseout', handleMouseOut);

                return () => {
                    node.removeEventListener('mouseover', handleMouseOver);
                    node.removeEventListener('mouseout', handleMouseOut);
                };
            }
        },
        [parent.current] // Recall only if ref changes
    );

    return value;
}
