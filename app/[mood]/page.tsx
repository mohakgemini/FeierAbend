import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RadioApp from "@/components/RadioApp";
import { vibes } from "@/data/vibes";

export const dynamicParams = false;

export function generateStaticParams() {
  return vibes.map((vibe) => ({ mood: vibe.id }));
}

export function generateMetadata({ params }: { params: { mood: string } }): Metadata {
  const vibe = vibes.find((item) => item.id === params.mood);
  return vibe
    ? { title: `${vibe.title} — Feierabend.fm`, description: vibe.subtitle }
    : {};
}

export default function MoodPage({ params }: { params: { mood: string } }) {
  const vibe = vibes.find((item) => item.id === params.mood);
  if (!vibe) notFound();
  return <RadioApp initialVibe={vibe} />;
}
