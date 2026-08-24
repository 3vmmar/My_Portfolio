"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Defers the command palette until someone actually asks for it.
 *
 * The palette returns `null` until opened, so on a normal visit its code —
 * the dialog, the fuzzy matcher and the project index it searches — was
 * downloaded, parsed and executed to render nothing. This wrapper carries only
 * the three key bindings; the palette chunk is fetched on the first ⌘K, "/" or
 * `open-command-palette` event and never on a visit that does not use it.
 *
 * `ssr: false` is legal here and not in app/layout.tsx: layout is a Server
 * Component, where Next both rejects the flag and declines to code-split the
 * dynamic import at all. Hence the thin client wrapper.
 */
const CommandPalette = dynamic(() => import("@/components/CommandPalette"), {
  ssr: false,
});

export default function CommandPaletteLoader() {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (armed) return;

    const arm = () => setArmed(true);

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        arm();
        return;
      }
      // Same guard as the palette's own handler: "/" is a shortcut only when
      // the caret is not in a field.
      if (e.key === "/" && !typing) {
        e.preventDefault();
        arm();
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", arm);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", arm);
    };
  }, [armed]);

  // `autoOpen` rather than replaying the event: the palette mounts a tick after
  // `armed` flips (the chunk has to arrive first), so a re-dispatched event
  // would land before its listener exists.
  return armed ? <CommandPalette autoOpen /> : null;
}
