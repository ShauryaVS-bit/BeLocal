import Navbar from "./components/ui/navbar";
import Hero from "./components/Hero";
import Footer from "./components/ui/footer";
import { Card } from "./components/ui/card";
import { Heading } from "./components/ui/heading";
import PriceCheckForm from "./components/PriceCheckForm";
import type { PriceCheckFormData } from "./lib/types";
import { supabase } from "./lib/supabase";
import { useState } from "react";

export default function App() {
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: PriceCheckFormData) => {
    setIsSubmitting(true);
    setError(null);
    setPrice(null);
    try {
      const { data: priceData, error: supabaseError } = await supabase
        .from("prices")
        .select("price")
        .eq("location", data.location.toLowerCase().trim())
        .eq("item", data.itemName.toLowerCase().trim())
        .single();
      if (supabaseError) throw supabaseError;
      if (priceData) setPrice(priceData.price);
      else setError("No price found for this location and item combination");
    } catch (err) {
      setError("Error fetching price data. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 via-sky-400 to-pink-400">
      <Navbar />
      <Hero />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <Card>
          <Heading>Find a Local Price</Heading>
          <PriceCheckForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 animate-fade-in">
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}
          {price !== null && (
            <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3 animate-fade-in">
              <span className="text-sm font-medium text-green-800">
                Price: <span className="font-bold text-lg">${price.toFixed(2)}</span>
              </span>
            </div>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}
