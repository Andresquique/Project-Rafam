import { create } from 'zustand';
import { 
  BaseVideoState, 
  BaseVideoActions, 
  initialVideoState, 
  createBaseVideoActions 
} from './videosBase.store';

// El store de usuario solo usa las funciones base
export const useVideoUserStore = create<BaseVideoState & BaseVideoActions>((set, get) => ({
  ...initialVideoState,
  ...createBaseVideoActions(set, get),
}));