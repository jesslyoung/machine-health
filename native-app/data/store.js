import {create} from 'zustand';

const useStore = create(set => ({
  isFetching: false,
  isDataLoaded: false,
  isDbLoaded: false,
  dataLastUpdated: new Date().toISOString(),
  setFetching: (status) => set({ isFetching: status }),
  setDbLoaded: (status) => set({ isDbLoaded: status }),
  setIsDataLoaded: (status) => set({ isDataLoaded: status }),
  onDataUpdated: () => set({ dataLastUpdated: new Date().toISOString() }),
}));

export default useStore;
