"use client";

import URLShortener from "./components/URLShortener";
import { URLProps } from "@/types";
import { useState } from "react";

export default function Home() {
  const [links, setLinks] = useState<URLProps[]>([]);

  return (
      <div className="page-background">
        <URLShortener
            append={(newLink: URLProps) => {
              setLinks([newLink]);
            }}
        />
      </div>
  );
}