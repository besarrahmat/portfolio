"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const unflip = (s: string) => [...s].reverse().join("");

// The alias never exists whole in HTML or the RSC payload (Cloudflare's obfuscation cannot reach either):
// the server sends both halves reversed, and this button rebuilds the address only when a person asks.
export function Email({ parts }: { parts: [string, string] }) {
  const [address, setAddress] = useState<string>();
  const [copied, setCopied] = useState(false);
  const link = useRef<HTMLAnchorElement>(null);

  // The button that had focus is gone once the address shows; hand focus to the address.
  useEffect(() => {
    if (address) link.current?.focus();
  }, [address]);

  if (!address)
    return (
      <Button
        onClick={() => setAddress(`${unflip(parts[1])}@${unflip(parts[0])}`)}
      >
        Show email
      </Button>
    );

  return (
    <span className="ct-email">
      <a ref={link} href={`mailto:${address}`}>
        {address}
      </a>
      <Button
        variant="quiet"
        onClick={async () => {
          await navigator.clipboard.writeText(address);
          setCopied(true);
        }}
      >
        {copied ? "Copied" : "Copy"}
      </Button>
      <span className="ui-visually-hidden" role="status">
        {copied ? "Email address copied" : ""}
      </span>
    </span>
  );
}
