
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  formatter?: (value: number | string) => string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, formatter, description }) => {
  const formattedValue = formatter ? formatter(value) : value;

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-fin-neutral-500">{title}</h3>
          <div className="h-8 w-8 bg-fin-blue-100 rounded-full flex items-center justify-center text-fin-blue-500">
            {icon}
          </div>
        </div>
        <div className="mt-2 flex items-end">
          <p className="text-2xl font-bold text-fin-neutral-900">{formattedValue}</p>
        </div>
        {description && (
          <p className="mt-1 text-xs text-fin-neutral-500">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
