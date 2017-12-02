import React from 'react';

interface ConditionalProps {
    condition: boolean;
}

/// A component for platform-specific children
export const Conditional: React.FunctionComponent<ConditionalProps> = (props) => {
    let children: React.ReactNode | null = null;
    if (props.condition) {
        children = props.children;
    }
    return <>{children}</>;
};
