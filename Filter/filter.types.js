type ControlKey = string;
type ControlValue = string;

export type ControlPair = [ControlKey, ControlValue];

export type Control = void => ?ControlPair;
