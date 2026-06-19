import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'dark',
  defaultRadius: 'md',

  fontFamily: 'Inter, sans-serif',

  headings: {
    fontFamily: 'Inter, sans-serif',
  },
});


export const Colors = {
  // General
  white: "#ffffff",
  textShadow: "rgba(0,0,0,0.8)",
  panelBg: "rgba(0, 0, 0, 0.65)",
  panelBorder: "rgba(255,255,255,0.05)",
  trackBg: "#1a1a1a",
  trackBorder: "#111",
  darkInner: "#111",

  // Status
  health: "#98ce44",
  armor: "#4a90e2",
  hunger: "#f59e0b",
  thirst: "#3b82f6",
  oxygen: "#06b6d4",
  stamina: "#6ee7b7",
  fingerprint: "#e32b59",

  // Voice
  voiceMuted: "#3a3a3a",
  voiceTalking: "#bffa1d",
  voiceIdle: "#eaeaea",
  voiceEmpty: "#222222",
  micMuted: "#e53e3e",

  // CarHUD
  rpmNormal: "#bffa1d",
  rpmRedline: "#e53e3e",
  fuelBar: "#e5aa45",
  fuelLow: "#f59e0b",
  iconIdle: "#eaeaeae1",
  engineOff: "#292929e0",
  engineGood: "#eaeaeae1",
  engineWarn: "#fffb00e3",
  engineDanger: "#ff8801e7",
  engineCritical: "#ee4040e8",
  seatbeltOn: "#a6ff02e3",
  lightsOn: "#00a2ffe3",

  // Compass
  compassIcon: "#e5aa45",
  markerIcon: "#e53e3e",
  mapIcon: "#55b9e1",

  // Menu
  menuBg: "rgba(15, 15, 15, 0.92)",
  menuBorder: "rgba(255,255,255,0.08)",
  menuAccent: "#ecb14a",
  menuActive: "#98ce44",
  menuInactive: "#3a3a3a",
  menuHover: "rgba(255,255,255,0.06)",
};

export const Radius = {
  panel: 12,
  menu: 12,
  pill: 12,
  dot: "50%",
};

export const Fonts = {
  family:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Segoe UI", sans-serif',
  weightRegular: 700,
  weightBold: 800,
  weightBlack: 900,
};

export const Shadow = {
  text: "1px 1px 2px rgba(0,0,0,0.8)",
  textLarge: "2px 2px 4px rgba(0,0,0,0.8)",
};