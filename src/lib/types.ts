export type ItemCategory = "food" | "accommodation" | "transportation" | "activities" | "shopping";

export interface PriceCheckFormData {
  location: string;
  category: ItemCategory;
  itemName: string;
}

export const itemCategories = [
  { value: "food", label: "Food & Drinks" },
  { value: "accommodation", label: "Accommodation" },
  { value: "transportation", label: "Transportation" },
  { value: "activities", label: "Activities & Entertainment" },
  { value: "shopping", label: "Shopping" },
] as const; 