/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {
  Button,
  Chatting,
  FinalResultChart,
  PartialResultChart,
  Spinner,
  UserInfoCard,
} from '@/components';
import { QUERYKEY } from '@/constants/querykey';
import { PATH } from '@/constants/router';
import { useFetchParticalResult, useFetchRoomDetail } from '@/hooks/api';
import { useToast } from '@/hooks/useToast';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Player } from '@/types/api';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import PrevGame from './PrevGame';
import BalanceGameProgress from '@/components/BalanceGameProgress';
import useBalanceGameStore from '@/store/useBalanceGameStore';
import { SOCKET } from '@/constants/websocket';
import { BarProps } from '@/components/FinalResultChart/Bar';
import useRoomStore from '@/store/useRoomStore';
import { useRouter } from 'next/navigation';
import { getBalanceGameResults } from '@/services/balanceGames';

const WaitingRoom = () => {
  const path = usePathname();
  const router = useRouter();
  const {
    roomStatus,
    setRoomStatus,
    round,
    selectedPlayers,
    resetSelectedPlayers,
  } = useBalanceGameStore();
  const roomId = path.split('/')[2];

  const { myName } = useRoomStore();
  const { connect, sendMessage, chatMessages, disconnect } = useWebSocket();
  const { toast } = useToast();

  const { data: roomDetail, isError } = useFetchRoomDetail(roomId);
  const { data: partialResult } = useFetchParticalResult({
    roomId: roomId,
    round: round.currentRound,
  });
  const queryClient = useQueryClient();
  const players: Player[] = roomDetail?.players || [];

  const [finalResult, setFinalResult] = useState<BarProps[]>([]);

  const isRoomManager = roomDetail?.hostName === myName;

  useEffect(() => {
    if (
      players.length !== 0 &&
      new Set(selectedPlayers).size === players.length
    ) {
      setRoomStatus('result');

      queryClient.invalidateQueries({
        queryKey: [QUERYKEY.PARTIAL_RESULT, round.currentRound],
      });

      resetSelectedPlayers();
    }
  }, [selectedPlayers]);

  useEffect(() => {
    if (roomDetail) {
      if (
        roomDetail.status === 'PLAYING' &&
        roomDetail.players.findIndex((user) => user.name === myName) === -1
      ) {
        toast({
          title: '게임이 이미 시작되었어요! 게임이 끝나면 다시 들어와주세요.',
        });
        router.push(PATH.HOME);
      } else if (myName !== '') {
        connect({ roomId, name: myName });
        queryClient.invalidateQueries({
          queryKey: [QUERYKEY.ROOM_DETAIL],
        });
      }
    }
  }, [myName, roomDetail]);

  useEffect(() => {
    if (roomStatus === 'finalResult') {
      getBalanceGameResults({ roomId: roomId })
        .then((data) => {
          if (data) {
            const finalResult: BarProps[] = data.map((data) => ({
              candidate1: data.a,
              candidate2: data.b,
              votes1: data.result.a.length,
              votes2: data.result.b.length,
            }));

            setFinalResult(finalResult);
          }
        })
        .catch(() => {
          toast({
            variant: 'destructive',
            title: '문제가 생겼습니다. 다시 시도해주세요.',
          });
        });
    }
  }, [roomStatus]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries({
        queryKey: [QUERYKEY.ROOM_DETAIL],
      });
      disconnect();
    };
  }, []);

  const handleLinkCopy = () => {
    const currentUrl = window.document.location.href;
    navigator.clipboard.writeText(currentUrl);
    toast({
      title: '클립보드에 복사되었어요!',
      duration: 1500,
    });
  };

  const handleEnterNextRound = async () => {
    sendMessage({
      destination: `${SOCKET.ENDPOINT.BALANCE_GAME.NEXT}`,
    });
    queryClient.removeQueries({
      queryKey: [QUERYKEY.PARTIAL_RESULT],
    });
  };

  const handleMoveToWaitingRoom = () => {
    sendMessage({
      destination: `${SOCKET.ENDPOINT.BALANCE_GAME.END}`,
    });
  };

  if (isError) {
    toast({
      variant: 'destructive',
      title: '문제가 생겼습니다. 다시 시도해주세요.',
    });
    router.push(PATH.HOME);
  }

  if (!myName || !roomDetail) {
    return <Spinner />;
  }

  return (
    <section className="w-screen h-screen flex items-center justify-center px-10 gap-10 shrink-0">
      <section className="flex flex-col gap-3 h-4/5 min-w-[15rem] max-w-[20rem] relative">
        {roomStatus === 'idle' && (
          <Button
            className="absolute -top-12 left-0"
            size={'sm'}
            variant={'secondary'}
            onClick={handleLinkCopy}
          >
            <Link />
            초대 링크 복사
          </Button>
        )}
        {players.map((data, index) => (
          <UserInfoCard
            key={index}
            name={data.name}
            isReady={roomStatus === 'idle' ? data.isReady : false}
            fileName={data.avatar}
          />
        ))}
      </section>

      <section className="h-4/5 min-w-[45rem] max-w-[70rem] w-full bg-container/50 rounded-lg">
        {roomStatus === 'idle' && (
          <PrevGame
            roomDetail={roomDetail}
            players={players}
            isRoomManager={isRoomManager}
            sendMessage={sendMessage}
          />
        )}
        {roomStatus === 'progress' && (
          <BalanceGameProgress sendMessage={sendMessage} />
        )}
        {roomStatus === 'result' &&
          partialResult &&
          partialResult.length !== 0 && (
            <PartialResultChart data={partialResult} />
          )}
        {roomStatus === 'finalResult' && finalResult.length !== 0 && (
          <FinalResultChart data={finalResult} />
        )}
      </section>

      <section className="flex flex-col h-4/5 min-w-[15rem] max-w-[20rem]">
        <Chatting
          myName={myName}
          chatMessages={chatMessages}
          sendMessage={sendMessage}
        />
        {roomStatus === 'result' && isRoomManager && (
          <Button
            className="w-full"
            onClick={handleEnterNextRound}
          >
            {round.currentRound === round.totalRounds
              ? '최종 결과 보기'
              : '다음 라운드로 이동'}
          </Button>
        )}
        {roomStatus === 'finalResult' && isRoomManager && (
          <Button
            className="w-full"
            onClick={handleMoveToWaitingRoom}
          >
            대기실로 이동
          </Button>
        )}
      </section>
    </section>
  );
};

export default WaitingRoom;
