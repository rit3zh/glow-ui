interface AvatarItem {
  uri: string;
  name?: string;
}

export interface AvatarGroupProps {
  image: AvatarItem;
  size?: number;
  onPress?(id: string): void;
}
