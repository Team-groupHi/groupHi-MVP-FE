import { BalanceGameRoundResponse, Player } from '@/types/api';
import { create } from 'zustand';

type roomStatusType = 'idle' | 'progress' | 'result' | 'finalResult';

interface BalanceGameStoreProps {
  totalRounds: number; // === totalRounds, 리셋 시 0?
  roomStatus: roomStatusType;
  round: BalanceGameRoundResponse;
  selectedPlayers: string[];
  setRound: (round: BalanceGameRoundResponse) => void;
  setTotalRounds: (count: number) => void;
  setRoomStatus: (status: roomStatusType) => void;
  addSelectedPlayers: (player: string) => void;
  resetSelectedPlayers: () => void;
  reset: () => void;
}

const useBalanceGameStore = create<BalanceGameStoreProps>((set) => ({
  totalRounds: 0,
  round: {
    totalRounds: 0,
    q: '',
    a: '',
    b: '',
    currentRound: 0,
    startTime: '',
    endTime: '',
  },
  roomStatus: 'idle',
  selectedPlayers: [],
  setRound: (round: BalanceGameRoundResponse) =>
    set({
      round,
    }),
  setRoomStatus: (status) => set({ roomStatus: status }),
  setTotalRounds: (count) =>
    set((state) => ({
      round: {
        ...state.round,
        totalRounds: count,
      },
    })),
  addSelectedPlayers: (player) =>
    set((state) => ({
      selectedPlayers: [...state.selectedPlayers, player],
    })),
  resetSelectedPlayers: () => {
    set({
      selectedPlayers: [],
    });
  },
  reset: () =>
    set({
      totalRounds: 0,
      roomStatus: 'idle',
    }),
}));

export default useBalanceGameStore;
