export interface Song {
  id: string;
  title: string;
  description: string;
  file: string;
}

export interface Emotion {
  name: string;
  color: string;
}

export interface Memory {
  id: number;
  type: 'image' | 'video';
  title: string;
  description: string;
  media: string;
}

export interface SectionCard {
  title: string;
  description: string;
  href: string;
  icon: string;
}
