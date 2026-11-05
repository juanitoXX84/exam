import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

function Svg({
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconHeart({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M19.5 12.6 12 20l-7.5-7.4a4.5 4.5 0 1 1 6.4-6.3L12 7.1l.1-.1a4.5 4.5 0 1 1 6.4 6.6Z" />
    </Svg>
  );
}

export function IconCompass({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m14.5 9.5-1.2 4.8-4.8 1.2 1.2-4.8z" />
    </Svg>
  );
}

export function IconStar({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m12 3.2 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.6 7.2 18.1l.9-5.4-3.9-3.8 5.4-.8z" />
    </Svg>
  );
}

export function IconSuitcase({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3.5" y="8" width="17" height="12" rx="2" />
      <path d="M9 8V6.5A2.5 2.5 0 0 1 11.5 4h1A2.5 2.5 0 0 1 15 6.5V8" />
      <path d="M3.5 13h17" />
    </Svg>
  );
}

export function IconMap({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m9 4-6 2.2v13.6L9 18l6 2.2 6-2.2V4.4L15 6.6z" />
      <path d="M9 4v14" />
      <path d="M15 6.6V20.2" />
    </Svg>
  );
}

export function IconPin({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </Svg>
  );
}

export function IconGlobe({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
    </Svg>
  );
}

export function IconChevron({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m9 6 6 6-6 6" />
    </Svg>
  );
}

export function IconChevronDown({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconUser({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19.2a6.5 6.5 0 0 1 13 0" />
    </Svg>
  );
}

export function IconLock({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Svg>
  );
}

export function IconLogout({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2" />
      <path d="M15 12H3" />
      <path d="m6 9-3 3 3 3" />
    </Svg>
  );
}

export function IconPlane({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M21 12 8.5 18.5l.7-4.2L3 12l6.2-2.3.7-4.2z" />
    </Svg>
  );
}

export function IconCamera({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 8.5h2.2l1.2-2h9.2l1.2 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" />
      <circle cx="12" cy="13.5" r="3.2" />
    </Svg>
  );
}

export function IconTrash({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 7h16" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M7 7l.75 11.5A1.5 1.5 0 0 0 9.25 20h5.5a1.5 1.5 0 0 0 1.5-1.5L17 7" />
    </Svg>
  );
}
