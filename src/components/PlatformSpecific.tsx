import React from 'react';
import { PlatformOSType } from 'react-native';
import { Config } from '~/services/Config/AppConfig';

interface PlatformSpecificProps {
    exclude?: PlatformOSType[];
    include?: PlatformOSType[];
}

/// A component for platform-specific children
export const PlatformSpecific: React.FunctionComponent<PlatformSpecificProps> = (props) => {
    let shouldRenderChildren = true;
    if (props.exclude && props.exclude.indexOf(Config.platformOS) > -1) {
        shouldRenderChildren = false;
    }
    if (props.include && props.include.indexOf(Config.platformOS) === -1) {
        shouldRenderChildren = false;
    }
    let children: React.ReactNode | null = null;
    if (shouldRenderChildren) {
        children = props.children;
    }
    return <>{children}</>;
};
