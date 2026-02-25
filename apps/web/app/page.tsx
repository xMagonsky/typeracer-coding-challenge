"use client";

import dynamic from "next/dynamic";

const TypeRacer = dynamic(() => import("./components/TypeRacer").then(mod => ({ default: mod.TypeRacer })), {
  ssr: false,
});

export default function Home() {
  return <TypeRacer />;
}
