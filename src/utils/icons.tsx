import React from 'react';
import { Sun, Moon, Sparkles, Compass, Wind, Heart, Eye } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  sun: <Sun className="w-8 h-8 text-spiritual-gold" />,
  moon: <Moon className="w-8 h-8 text-spiritual-gold" />,
  sparkles: <Sparkles className="w-8 h-8 text-spiritual-gold" />,
  compass: <Compass className="w-8 h-8 text-spiritual-gold" />,
  wind: <Wind className="w-8 h-8 text-spiritual-gold" />,
  heart: <Heart className="w-8 h-8 text-spiritual-gold" />,
  eye: <Eye className="w-8 h-8 text-spiritual-gold" />,
};

export const getIcon = (iconName: string): React.ReactNode => {
  return iconMap[iconName.toLowerCase()] || <Sun className="w-8 h-8 text-spiritual-gold" />;
};
