export interface CategoryMutation {
  name: string;
  description: string;
}

export interface PlaceMutation {
  name: string;
  description: string;
}

export interface ItemMutation {
  category_id: string;
  place_id: string;
  name: string;
  description: string;
  image: string | null;
}