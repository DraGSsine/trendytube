// object types
export interface Feature {
  id: string;
  className?: string;
  image: string;
  alt: string;
  badge: { text: string; color: string };
  title: string;
  description: string;
  index?: number;
}

export interface HowItWorkCardProps {
  step: string;
  feature: string;
  description: string;
  icon: LucideIcon;
  isActive: boolean;
  className?: string;
  activeClassName?: string;
  onStepClick: (step: string) => void;
}

export interface MetadataParams {
  title: string;
  description: string;
  path?: string;
  image?: string;
}
