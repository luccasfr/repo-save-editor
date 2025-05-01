import React from "react";
import { LocaleSelector } from "./locale-select";
import { Save } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex px-12 fixed w-full justify-between py-2 border-b items-center font-mono bg-background/50 backdrop-blur z-50">
      <div className="text-xl font-bold tracking-tight flex gap-2">
        <Save className="size-6" />
        <h1>repo-save-editor</h1>
      </div>
      <LocaleSelector />
    </div>
  );
}
