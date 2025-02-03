/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Chatting, Spinner } from '@/components';
import { QUERYKEY } from '@/constants/querykey';
import { PATH } from '@/constants/router';
import useFetchRoomDetail from '@/hooks/useFetchRoomDetail';
import { useToast } from '@/hooks/useToast';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Player } from '@/types/api';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import useRoomStore from '@/store/useRoomStore';
import { useRouter } from 'next/navigation';
import UserList from './_component/UserList';
import RoomControl from './_component/RoomControl';
import GamePanel from './_component/GamePanel';

const WaitingRoom = () => {
  const path = usePathname();
  const router = useRouter();
  const roomId = path.split('/')[2];

  const { toast } = useToast();
  const { connect, sendMessage, chatMessages, disconnect } = useWebSocket();

  const { data: roomDetail, isError } = useFetchRoomDetail(roomId);
  const queryClient = useQueryClient();

  const { myName } = useRoomStore();

  const players: Player[] = roomDetail?.players || [];
  const isRoomManager = roomDetail?.hostName === myName;

  useEffect(() => {
    return () => {
      queryClient.removeQueries({
        queryKey: [QUERYKEY.ROOM_DETAIL],
      });
      disconnect();
    };
  }, []);

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
    <section className="w-screen h-screen flex items-center gap-10 shrink-0">
      <UserList players={players} />

      <GamePanel
        roomId={roomId}
        roomDetail={roomDetail}
        players={players}
        isRoomManager={isRoomManager}
        sendMessage={sendMessage}
      />

      <section className="flex flex-col h-4/5 min-w-[15rem] max-w-[20rem] mr-10 gap-2">
        <Chatting
          myName={myName}
          chatMessages={chatMessages}
          sendMessage={sendMessage}
        />
        <RoomControl
          isRoomManager={isRoomManager}
          sendMessage={sendMessage}
        />
      </section>
    </section>
  );
};

export default WaitingRoom;
