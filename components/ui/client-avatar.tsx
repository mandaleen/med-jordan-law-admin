"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarPalette, getInitials } from "@/lib/avatar-utils";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export interface ClientAvatarProps {
  name?: string;
  src?: string;
  initials?: string;
  className?: string;
  fallbackClassName?: string;
  alt?: string;
  shape?: "rounded" | "circle";
  size?: "default" | "sm" | "lg";
  title?: string;
}

export function ClientAvatar({
  name,
  src,
  initials,
  className,
  fallbackClassName,
  alt,
  shape = "rounded",
  size = "default",
  title,
}: ClientAvatarProps) {
  const resolvedInitials = getInitials(name, initials);
  const palette = getAvatarPalette(name || initials || "client");
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-lg";

  return (
    <Avatar
      size={size}
      title={title || name}
      className={cn(
        shapeClass,
        "ring-1 ring-black/10 shrink-0 select-none shadow-2xs",
        className
      )}
    >
      {src && (
        <AvatarImage
          src={src}
          alt={alt || name || "Avatar"}
          className="object-cover"
        />
      )}
      <AvatarFallback
        className={cn(
          "bg-gradient-to-br",
          palette.gradient,
          "text-white font-bold tracking-wide select-none",
          "shadow-[inset_0_1px_1px_rgba(255,255,255,0.32)] ring-1 ring-inset ring-white/20",
          "flex items-center justify-center",
          shapeClass,
          fallbackClassName
        )}
      >
        {resolvedInitials ? (
          <span className="leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
            {resolvedInitials}
          </span>
        ) : (
          <User className="w-1/2 h-1/2 text-white/90 stroke-[2.2]" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
