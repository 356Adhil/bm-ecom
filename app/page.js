"use client";
import { motion } from "framer-motion";
import { Navigation } from "./components/layout/Navigation";
import { HeroSection } from "./components/home/HeroSection";
import { Categories } from "./components/home/Categories";
import { FeaturedProducts } from "./components/home/FeaturedProducts";
import { SpecialOffer } from "./components/home/SpecialOffer";
import { useStore } from "./lib/store";
import { useModals } from "./contexts/ModalContext";

export default function Home() {
  const { cart } = useStore();
  const { openAuth } = useModals();

  return (
    <div className="min-h-screen bg-zinc-50">
      <main>
        <HeroSection />
        <Categories />
        <FeaturedProducts />
        <SpecialOffer onSignUpClick={openAuth} />
      </main>
    </div>
  );
}
