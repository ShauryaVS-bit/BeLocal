import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { PriceCheckFormData, ItemCategory } from "../lib/types";
import { itemCategories } from "../lib/types";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { sampleLocations, categorizedSampleItems, allSampleItems } from "../lib/sampleData";
import { supabase } from '../lib/supabase';

const formSchema = z.object({
  location: z.string()
    .min(1, { message: "Please enter a location." })
    .min(2, { message: "Location must be at least 2 characters." }),
  category: z.custom<ItemCategory>((val) => itemCategories.map(ic => ic.value).includes(val as ItemCategory), {
    message: "Please select a category.",
  }),
  itemName: z.string()
    .min(1, { message: "Please enter an item or service." })
    .min(2, { message: "Item or service must be at least 2 characters." }),
});

interface PriceCheckFormProps {
  onSubmit: (data: PriceCheckFormData) => void;
  isSubmitting?: boolean;
}

export default function PriceCheckForm({ onSubmit, isSubmitting }: PriceCheckFormProps) {
  const form = useForm<PriceCheckFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      category: "food",
      itemName: "",
    },
  });

  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const [availableItemsForCategory, setAvailableItemsForCategory] = useState<string[]>(
    categorizedSampleItems[form.getValues("category")] || allSampleItems
  );
  const [itemSuggestions, setItemSuggestions] = useState<string[]>([]);
  const [showItemSuggestions, setShowItemSuggestions] = useState(false);

  const selectedCategory = form.watch("category");

  useEffect(() => {
    const newItems = categorizedSampleItems[selectedCategory] || allSampleItems;
    setAvailableItemsForCategory(newItems);
    form.setValue('itemName', '', { shouldValidate: false });
    setItemSuggestions([]);
    setShowItemSuggestions(false);
  }, [selectedCategory, form]);

  // Test Supabase connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('prices').select('count').limit(1);
        if (error) {
          console.error('Supabase connection test failed:', error);
        } else {
          console.log('Supabase connection successful');
        }
      } catch (err) {
        console.error('Supabase connection test error:', err);
      }
    };
    testConnection();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="e.g., Bangkok, Thailand"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const currentValue = e.target.value;
                      if (currentValue.trim()) {
                        const filtered = sampleLocations.filter(loc =>
                          loc.toLowerCase().includes(currentValue.toLowerCase())
                        );
                        setLocationSuggestions(filtered);
                        setShowLocationSuggestions(filtered.length > 0);
                      } else {
                        setLocationSuggestions([]);
                        setShowLocationSuggestions(false);
                      }
                    }}
                    onFocus={() => {
                      const currentValue = field.value;
                      if (currentValue && currentValue.trim()) {
                        const filtered = sampleLocations.filter(loc =>
                          loc.toLowerCase().includes(currentValue.toLowerCase())
                        );
                        setLocationSuggestions(filtered);
                        setShowLocationSuggestions(filtered.length > 0);
                      } else {
                        setLocationSuggestions(sampleLocations.slice(0, 5));
                        setShowLocationSuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowLocationSuggestions(false), 150);
                    }}
                    autoComplete="off"
                  />
                </FormControl>
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {locationSuggestions.map((suggestion) => (
                      <div
                        key={suggestion}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onMouseDown={() => {
                          form.setValue("location", suggestion, { shouldValidate: true });
                          setLocationSuggestions([]);
                          setShowLocationSuggestions(false);
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <FormDescription>
                Enter the location you're interested in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {itemCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the category of the item or service.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="itemName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item or Service</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="e.g., Street food Pad Thai"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const currentValue = e.target.value;
                      if (currentValue.trim()) {
                        const filtered = availableItemsForCategory.filter(item =>
                          item.toLowerCase().includes(currentValue.toLowerCase())
                        );
                        setItemSuggestions(filtered);
                        setShowItemSuggestions(filtered.length > 0);
                      } else {
                        setItemSuggestions([]);
                        setShowItemSuggestions(false);
                      }
                    }}
                    onFocus={() => {
                      const currentValue = field.value;
                      if (currentValue && currentValue.trim()) {
                        const filtered = availableItemsForCategory.filter(item =>
                          item.toLowerCase().includes(currentValue.toLowerCase())
                        );
                        setItemSuggestions(filtered);
                        setShowItemSuggestions(filtered.length > 0);
                      } else {
                        setItemSuggestions(availableItemsForCategory.slice(0, 5));
                        setShowItemSuggestions(availableItemsForCategory.length > 0);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowItemSuggestions(false), 150);
                    }}
                    autoComplete="off"
                  />
                </FormControl>
                {showItemSuggestions && itemSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {itemSuggestions.map((suggestion) => (
                      <div
                        key={suggestion}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onMouseDown={() => {
                          form.setValue("itemName", suggestion, { shouldValidate: true });
                          setItemSuggestions([]);
                          setShowItemSuggestions(false);
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <FormDescription>
                What item or service are you interested in?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <Search className="mr-2 h-4 w-4" />
          {isSubmitting ? "Checking..." : "Check Price"}
        </Button>
      </form>
    </Form>
  );
} 