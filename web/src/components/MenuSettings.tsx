import { Box, Flex, Text } from "@mantine/core";
import { useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { Colors, Radius, Fonts, Shadow } from "../theme";
import { IoIosBackspace } from "react-icons/io";

const fetchNui = async (event: string, data?: any) => {
  try {
    await fetch(`https://krs_hud/${event}`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(data ?? {}),
    });
  } catch (e) {
    
  }
};

type RadarMode = "always" | "vehicle" | "hidden";

interface Settings {
  cinematic: boolean;
  hideAll: boolean;
  radarMode: RadarMode;
}

interface Locales {
  hud_settings: string;
  cinematic_mode: string;
  hide_all_components: string;
  radar: string;
  radar_always: string;
  radar_vehicle: string;
  radar_hidden: string;
  save: string;
  saved: string;
}

const defaultLocales: Locales = {
  hud_settings: "HUD Settings",
  cinematic_mode: "Cinematic Mode",
  hide_all_components: "Hide all components",
  radar: "RADAR",
  radar_always: "Always active",
  radar_vehicle: "Vehicle only",
  radar_hidden: "Hidden",
  save: "Save",
  saved: "Saved ✓",
};

export default function MenuSettings() {
  const [open, setOpen] = useState<boolean>(false);
  const [cinematic, setCinematic] = useState<boolean>(false);
  const [hideAll, setHideAll] = useState<boolean>(false);
  const [radarMode, setRadarMode] = useState<RadarMode>("vehicle");
  const [saved, setSaved] = useState<boolean>(false);
  const [t, setT] = useState<Locales>(defaultLocales);

  useNuiEvent<boolean>("setMenu", (state) => setOpen(state));

  useNuiEvent<Partial<Locales>>("setLocales", (data) => {
    setT((prev) => ({ ...prev, ...data }));
  });

  useNuiEvent<Settings>("loadSettings", (data) => {
    if (data.cinematic !== undefined) setCinematic(data.cinematic);
    if (data.hideAll !== undefined) setHideAll(data.hideAll);
    if (data.radarMode !== undefined) setRadarMode(data.radarMode);
  });

  const closeMenu = () => {
    setOpen(false);
    fetchNui("closeMenu");
  };

  const toggleCinematic = () => {
    const v = !cinematic;
    setCinematic(v);
    setSaved(false);
    fetchNui("toggleCinematic", { state: v });
  };

  const toggleHideAll = () => {
    const v = !hideAll;
    setHideAll(v);
    setSaved(false);
    fetchNui("toggleHideAll", { state: v });
  };

  const selectRadar = (mode: RadarMode) => {
    setRadarMode(mode);
    setSaved(false);
    fetchNui("setRadarMode", { mode });
  };

  const saveSettings = () => {
    fetchNui("saveSettings", { cinematic, hideAll, radarMode });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  if (!open) return null;

  const ToggleRow = ({
    label,
    value,
    onClick,
  }: {
    label: string;
    value: boolean;
    onClick: () => void;
  }) => (
    <Flex
      justify="space-between"
      align="center"
      py={10}
      px={14}
      style={{
        borderRadius: Radius.panel,
        cursor: "pointer",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = Colors.menuHover)
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      onClick={onClick}
    >
      <Text c={Colors.white} fz="sm" fw={Fonts.weightRegular}>
        {label}
      </Text>
      <Box
        w={40}
        h={20}
        style={{
          borderRadius: 20,
          backgroundColor: value ? Colors.menuActive : Colors.menuInactive,
          position: "relative",
          transition: "background 0.2s",
        }}
      >
        <Box
          w={16}
          h={16}
          style={{
            borderRadius: "50%",
            backgroundColor: Colors.white,
            position: "absolute",
            top: 2,
            left: value ? 22 : 2,
            transition: "left 0.2s",
          }}
        />
      </Box>
    </Flex>
  );

  return (
    <Box
      pos="absolute"
      top={0}
      left={0}
      w="100%"
      h="100%"
      style={{
        backgroundColor: "rgba(0,0,0,0.4)",
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
      }}
      onClick={closeMenu}
    >
      <Box
        w={360}
        p={20}
        style={{
          backgroundColor: Colors.menuBg,
          border: `1px solid ${Colors.menuBorder}`,
          borderRadius: Radius.menu,
          fontFamily: Fonts.family,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Flex justify="space-between" align="center" mb={14}>
          <Text
            c={Colors.menuAccent}
            fz={18}
            fw={Fonts.weightBlack}
            style={{ textShadow: Shadow.text }}
          >
            {t.hud_settings}
          </Text>

          <Box
            display="flex"
            style={{
              cursor: "pointer",
              alignItems: "center",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            onClick={closeMenu}
          >
            <IoIosBackspace color={Colors.white} size={26} />
          </Box>
        </Flex>

        <ToggleRow
          label={t.cinematic_mode}
          value={cinematic}
          onClick={toggleCinematic}
        />
        <ToggleRow
          label={t.hide_all_components}
          value={hideAll}
          onClick={toggleHideAll}
        />

        <Text
          c={Colors.voiceIdle}
          fz="xs"
          fw={Fonts.weightBold}
          mt={16}
          mb={8}
          px={14}
        >
          {t.radar}
        </Text>

        <Flex direction="column" gap={4}>
          {(
            [
              { key: "always", label: t.radar_always },
              { key: "vehicle", label: t.radar_vehicle },
              { key: "hidden", label: t.radar_hidden },
            ] as { key: RadarMode; label: string }[]
          ).map((opt) => (
            <Flex
              key={opt.key}
              align="center"
              gap={10}
              py={9}
              px={14}
              style={{
                borderRadius: Radius.panel,
                cursor: "pointer",
                backgroundColor:
                  radarMode === opt.key ? Colors.menuHover : "transparent",
                transition: "background 0.15s",
              }}
              onClick={() => selectRadar(opt.key)}
            >
              <Box
                w={14}
                h={14}
                style={{
                  borderRadius: "50%",
                  border: `2px solid ${
                    radarMode === opt.key
                      ? Colors.menuActive
                      : Colors.menuInactive
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {radarMode === opt.key && (
                  <Box
                    w={6}
                    h={6}
                    style={{
                      borderRadius: "50%",
                      backgroundColor: Colors.menuActive,
                    }}
                  />
                )}
              </Box>
              <Text c={Colors.white} fz="sm" fw={Fonts.weightRegular}>
                {opt.label}
              </Text>
            </Flex>
          ))}
        </Flex>

        <Box
          mt={20}
          py={11}
          w="100%"
          style={{
            borderRadius: Radius.panel,
            backgroundColor: saved ? Colors.menuActive : Colors.menuAccent,
            cursor: "pointer",
            transition: "background 0.2s, filter 0.15s",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onMouseEnter={(e) => {
            if (!saved) e.currentTarget.style.filter = "brightness(0.88)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
          }}
          onClick={saveSettings}
        >
          <Text c="#000" fz="sm" fw={Fonts.weightBold}>
            {saved ? t.saved : t.save}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}