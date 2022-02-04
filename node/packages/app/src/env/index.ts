import DEV from './dev';
import { Environment, EnvType } from './types';

let PHASE: EnvType = EnvType.DEV;

export function getPhase(): EnvType {
  return PHASE;
}

export function setPhase(env: EnvType): void {
  PHASE = env;
}

export default function getEnv(): Environment {
  switch (PHASE) {
    case EnvType.DEV:
    default:
      return DEV;
  }
}
