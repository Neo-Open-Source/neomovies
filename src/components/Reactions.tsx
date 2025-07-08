'use client';

import React, { useState, useEffect } from 'react';
import { reactionsAPI, Reaction } from '@/lib/reactionsApi';
import { toast } from 'react-hot-toast';
import cn from 'classnames';
import { formatNumber } from '@/lib/utils';
import { FaFireAlt } from 'react-icons/fa';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { RiEmotionNormalFill } from 'react-icons/ri';
import { MdMoodBad } from 'react-icons/md';

const reactionTypes: Reaction['type'][] = ['fire', 'nice', 'think', 'bore', 'shit'];

const reactionIcons: Record<Reaction['type'], React.ElementType> = {
  fire: FaFireAlt,
  nice: AiFillLike,
  think: RiEmotionNormalFill,
  bore: MdMoodBad,
  shit: AiFillDislike,
};

interface ReactionsProps {
  mediaId: string;
  mediaType: 'movie' | 'tv';
}

const Reactions: React.FC<ReactionsProps> = ({ mediaId, mediaType }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<Reaction['type'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReactions = async () => {
      setIsLoading(true);
      try {
        const [countsRes, myReactionRes] = await Promise.all([
          reactionsAPI.getReactionCounts(mediaType, mediaId),
          token ? reactionsAPI.getMyReaction(mediaType, mediaId) : Promise.resolve(null),
        ]);
        setReactionCounts(countsRes.data);
        if (myReactionRes?.data) {
          setUserReaction(myReactionRes.data?.type ?? null);
        }
      } catch (error) {
        console.error('Failed to fetch reactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReactions();
  }, [mediaId, token]);

  const handleReactionClick = async (type: Reaction['type']) => {
    if (!token) {
      toast.error('Войдите в аккаунт, чтобы ставить реакции');
      return;
    }

    const oldReaction = userReaction;
    const oldCounts = { ...reactionCounts };

    // Оптимистичное обновление
    setUserReaction(prev => (prev === type ? null : type));
    setReactionCounts(prev => {
      const newCounts = { ...prev };
      // Если снимаем реакцию
      if (oldReaction === type) {
        newCounts[type] = (newCounts[type] || 1) - 1;
      } else {
        // Если ставим новую реакцию
        newCounts[type] = (newCounts[type] || 0) + 1;
        // Если до этого стояла другая реакция, уменьшаем ее счетчик
        if (oldReaction) {
          newCounts[oldReaction] = (newCounts[oldReaction] || 1) - 1;
        }
      }
      return newCounts;
    });

    try {
      await reactionsAPI.setReaction(mediaType, mediaId, type);
    } catch (error) {
      console.error('Failed to set reaction:', error);
      toast.error('Не удалось сохранить реакцию');
      // Откат изменений в случае ошибки
      setUserReaction(oldReaction);
      setReactionCounts(oldCounts);
    }
  };

  const renderButtons = () => (
    <div className="flex items-center gap-4">
      {reactionTypes.map((type) => {
        const Icon = reactionIcons[type];
        return (
          <div key={type} className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleReactionClick(type)}
              disabled={isLoading}
              className={cn(
                'w-16 h-12 flex items-center justify-center text-2xl transition-all duration-200 ease-in-out rounded-lg bg-secondary hover:bg-primary/20',
                {
                  'bg-primary/30 text-primary scale-110': userReaction === type,
                  'text-gray-400 hover:text-white': userReaction !== type,
                }
              )}
              title={!token ? `Войдите, чтобы поставить реакцию` : ''}
            >
              <Icon />
            </button>
            <span className="text-sm font-medium text-gray-400">
              {formatNumber(reactionCounts[type] || 0)}
            </span>
          </div>
        );
      })}
    </div>
  );

  if (isLoading && Object.keys(reactionCounts).length === 0) {
    return <div>Загрузка реакций...</div>;
  }

  return renderButtons();
};

export default Reactions;