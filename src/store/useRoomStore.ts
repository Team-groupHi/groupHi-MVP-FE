import { create } from 'zustand';

interface RoomStoreProps {
  roomId: string | null;
  hostName: string | null;
  myName: string | null;
  setRoomId: (id: string) => void;
  setHostName: (name: string) => void;
  setMyName: (name: string) => void;
  reset: () => void;
}

const useRoomStore = create<RoomStoreProps>((set) => ({
  roomId: null,
  hostName: null,
  myName: null,
  setRoomId: (id) => set({ roomId: id }),
  setHostName: (name) => set({ hostName: name }),
  setMyName: (name) => set({ myName: name }),
  reset: () =>
    set({
      roomId: null,
      hostName: null,
      myName: null,
    }),
}));

export default useRoomStore;
