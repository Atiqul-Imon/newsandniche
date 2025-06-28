"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined" || headings.length < 2) return;

    const handleScroll = () => {
      let current = "";
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (el && el.getBoundingClientRect().top < 120) {
          current = heading.id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <div className="hidden lg:block bg-gray-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
      <nav className="space-y-2">
        {headings.map((heading, idx) => (
          <a
            key={heading.id || heading.text || idx}
            href={`#${heading.id}`}
            className={`block text-sm transition-colors hover:text-blue-600 ${
              activeId === heading.id 
                ? 'text-blue-600 font-semibold' 
                : 'text-gray-600'
            }`}
            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
} 