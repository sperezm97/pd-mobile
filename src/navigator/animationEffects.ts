import { TransitionSpec } from '@react-navigation/stack/lib/typescript/src/types';

/// https://reactnavigation.org/docs/stack-navigator/#animations
export const SettingNavigation : TransitionSpec = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
  };
