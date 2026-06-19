import { Box, Flex, Text } from "@mantine/core";
import { useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";

import { 
  FaHeart, 
  FaShieldAlt, 
  FaHamburger, 
  FaSwimmer, 
  FaRunning, 
  FaFingerprint,
  FaMicrophoneAlt,
  FaMicrophoneAltSlash
} from "react-icons/fa";

import { FaBottleWater } from "react-icons/fa6";

interface VoiceData {
  isMuted: boolean;
  isTalking: boolean;
  isRadio: boolean;
  proximity: number; 
}

export default function Status() {
  const [health, setHealth] = useState<number>(80);
  const [armor, setArmor] = useState<number>(60);
  const [hunger, setHunger] = useState<number>(75);
  const [thirst, setThirst] = useState<number>(40);
  const [oxygen, setOxygen] = useState<number>(100);
  const [stamina, setStamina] = useState<number>(85);
  const [playerId, setPlayerId] = useState<number>(1);
  const [isUnderwater, setIsUnderwater] = useState<boolean>(false); 
  const [voice, setVoice] = useState<VoiceData>({
    isMuted: false,
    isTalking: false,
    isRadio: false,
    proximity: 2
  });

  useNuiEvent("updateStatus", (data: any) => {
    if (data.health !== undefined) setHealth(data.health);
    if (data.armor !== undefined) setArmor(data.armor);
    if (data.hunger !== undefined) setHunger(data.hunger);
    if (data.thirst !== undefined) setThirst(data.thirst);
    if (data.oxygen !== undefined) setOxygen(data.oxygen);
    if (data.stamina !== undefined) setStamina(data.stamina);
    if (data.id !== undefined) setPlayerId(data.id);
    if (data.isUnderwater !== undefined) setIsUnderwater(data.isUnderwater); 
    if (data.voice !== undefined) setVoice(data.voice);
  });

  const getProximityColor = (dotIndex: number) => {
    if (voice.isMuted) return "#3a3a3a"; 
    if (dotIndex <= voice.proximity) {
      return voice.isTalking ? "#bffa1d" : "#eaeaea"; 
    }
    return "#222222"; 
  };

  return (
    <Box
      pos="absolute"
      bottom={20}
      left={20}
      style={{ 
        pointerEvents: "none",
        transform: "perspective(1200px) rotateX(4deg) rotateY(-4deg) rotateZ(-1deg)",
        transformOrigin: "bottom left"
      }} 
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes voicePulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        .talking-dot {
          animation: voicePulse 0.35s infinite ease-in-out;
        }
      `}} />

      <Flex align="flex-end" gap={16}>
        
        <Flex direction="column" gap={5}>
          
          <Flex align="center" gap={6}>
            <Box w={16} display="flex" style={{ justifyContent: "center" }}>
              <FaHeart color="white" size={14} />
            </Box>
            
            <Text 
              w={24} 
              ta="center" 
              c="white" 
              fz="xs" 
              fw={700}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            >
              {Math.round(health)}
            </Text>

            <Box 
              w={204}
              h={12}
              bg="#1a1a1a"
              style={{ 
                border: '2px solid #111',
                transform: 'skewX(-25deg)',
                overflow: 'hidden'
              }}
            >
              <Box 
                w={`${health}%`} 
                h="100%" 
                bg="#98ce44"
                style={{ transition: "width 0.3s ease-in-out" }}
              />
            </Box>
          </Flex>

          <Flex align="center" gap={6}>
            <Box w={16} display="flex" style={{ justifyContent: "center" }}>
              <FaShieldAlt color="white" size={14} />
            </Box>
            
            <Text 
              w={24}
              ta="center"
              c="white" 
              fz="xs" 
              fw={700}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            >
              {Math.round(armor)}
            </Text>

            <Flex w={200} gap={3}>
              {[...Array(10)].map((_, index) => (
                <Box
                  key={index}
                  style={{ 
                    flex: 1, 
                    height: '12px',
                    backgroundColor: index < Math.floor(armor / 10) ? "#4a90e2" : "#1a1a1a",
                    border: '2px solid #111',
                    transform: 'skewX(-25deg)',
                    transition: "background 0.3s" 
                  }}
                />
              ))}
            </Flex>
          </Flex>
          
        </Flex>

        <Flex align="flex-end" gap={12} pb={2}>
          
          <Flex align="center" gap={4}>
            <Box 
              w={5} h={26} bg="#111" 
              style={{ borderRadius: 10, display: "flex", alignItems: "flex-end", overflow: "hidden", border: '1px solid #000' }}
            >
              <Box w="100%" h={`${hunger}%`} bg="#f59e0b" style={{ transition: "height 0.3s ease" }} />
            </Box>
            <FaHamburger color="#eaeaea" size={14} />
          </Flex>

          <Flex align="center" gap={4}>
            <Box 
              w={5} h={26} bg="#111" 
              style={{ borderRadius: 10, display: "flex", alignItems: "flex-end", overflow: "hidden", border: '1px solid #000' }}
            >
              <Box w="100%" h={`${thirst}%`} bg="#3b82f6" style={{ transition: "height 0.3s ease" }} />
            </Box>
            <FaBottleWater color="#eaeaea" size={14} />
          </Flex>

          {isUnderwater && (
            <Flex align="center" gap={4}>
              <Box 
                w={5} h={26} bg="#111" 
                style={{ borderRadius: 10, display: "flex", alignItems: "flex-end", overflow: "hidden", border: '1px solid #000' }}
              >
                <Box w="100%" h={`${oxygen}%`} bg="#06b6d4" style={{ transition: "height 0.3s ease" }} />
              </Box>
              <FaSwimmer color="#eaeaea" size={14} />
            </Flex>
          )}

          <Flex align="center" gap={4}>
            <Box 
              w={5} h={26} bg="#111" 
              style={{ borderRadius: 10, display: "flex", alignItems: "flex-end", overflow: "hidden", border: '1px solid #000' }}
            >
              <Box w="100%" h={`${stamina}%`} bg="#6ee7b7" style={{ transition: "height 0.3s ease" }} />
            </Box>
            <FaRunning color="#eaeaea" size={14} />
          </Flex>

          <Flex direction="column" align="center" gap={5} w={24}>
            <Box style={{ display: "flex", justifyContent: "center" }}>
              {voice.isMuted ? (
                <FaMicrophoneAltSlash color="#e53e3e" size={14} />
              ) : (
                <FaMicrophoneAlt color="white" size={14} /> 
              )}
            </Box>
            
            <Flex gap={3} justify="center" align="center" h={8}>
              {[1, 2, 3].map((dotIndex) => (
                <Box
                  key={dotIndex}
                  className={voice.isTalking && dotIndex <= voice.proximity ? "talking-dot" : ""}
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: getProximityColor(dotIndex),
                    border: '0.5px solid #000',
                    transition: "background-color 0.15s ease"
                  }}
                />
              ))}
            </Flex>
          </Flex>

          <Flex direction="column" align="center" ml={4}>
            <FaFingerprint color="#e32b59" size={16} />
            <Text 
              c="white" 
              fw={700} 
              fz={14} 
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)', marginTop: '2px' }}
            >
              {playerId}
            </Text>
          </Flex>
          
        </Flex>

      </Flex>
    </Box>
  );
}