
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

type ArticleCardProps = {
  title: string;
  description?: string;
  stats?: {
    views?: number;
    comments?: number;
    likes?: number;
  };
  compact?: boolean;
};

export const ArticleCard = ({ title, description, stats, compact = false }: ArticleCardProps) => {
  return (
    <Card className={`border shadow-sm hover:shadow-md transition-shadow cursor-pointer ${compact ? 'h-28' : ''}`}>
      <CardHeader className={`${compact ? 'p-3' : 'p-4'}`}>
        <CardTitle className={`${compact ? 'text-sm' : 'text-lg'}`}>{title}</CardTitle>
        {description && !compact && (
          <CardDescription className="text-sm line-clamp-2">{description}</CardDescription>
        )}
      </CardHeader>
      {stats && !compact && (
        <CardFooter className="pt-0 pb-3 px-4 flex gap-3 text-xs text-gray-500">
          {stats.views && <span>👁️ {stats.views}</span>}
          {stats.comments && <span>💬 {stats.comments}</span>}
          {stats.likes && <span>👍 {stats.likes}</span>}
        </CardFooter>
      )}
    </Card>
  );
};
