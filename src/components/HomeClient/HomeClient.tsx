'use client';
import useModalStore from '@/store/useModalStore';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  Button,
  Navigation,
  Carousel,
  CarouselContent,
  CarouselItem,
  GameListCard,
} from '@/components';
import { GamesResponse } from '@/types/api';

const DUMMY_DATA = [
  {
    title: 'HOME',
    href: '/',
  },
  {
    title: 'ABOUT US',
    href: '/about',
  },
];

interface HomeClientProps {
  games: GamesResponse[];
}

const HomeClient = ({ games }: HomeClientProps) => {
  const currentPath = usePathname();
  const { openModal } = useModalStore();

  return (
    <main className="flex flex-col h-screen p-800">
      <section
        id="navigation"
        className="flex justify-between pb-300"
      >
        <Button variant="link">Logo</Button>
        <section className="flex">
          <Navigation
            items={DUMMY_DATA}
            disabled={currentPath}
          />
        </section>
      </section>
      {games.length > 0 ? (
        <section
          id="gamelist"
          className="flex flex-col grow items-center"
        >
          <span className="text-lg pt-1000">Game List</span>
          <span className="text-md pb-200">▽</span>
          <section className="flex gap-200">
            <Carousel className="w-full max-w-xl">
              <CarouselContent>
                {games.map((game, index) => (
                  <CarouselItem
                    key={index}
                    className="grid gap-500"
                  >
                    <GameListCard
                      key={game.id}
                      id={game.id}
                      className="w-80"
                      title={game.nameKr}
                      description={game.descriptionKr}
                      src={game.thumbnailUrl}
                      onClick={() => {
                        const modalName = game.nameEn.replaceAll(' ', '');
                        return openModal(`Create${modalName}Modal`);
                      }}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>
        </section>
      ) : (
        <section className="flex h-full justify-center items-center">
          <span>게임 준비중입니다</span>
        </section>
      )}
    </main>
  );
};
export default HomeClient;