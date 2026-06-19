import { Box, Flex, Text } from "@mantine/core";
import { useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { FaCompass, FaMapMarkerAlt, FaMap } from "react-icons/fa";

export default function Compass() {
  const [heading, setHeading] = useState<string>("E"); // Es: N, NE, E, SE, S, SW, W, NW
  const [street, setStreet] = useState<string>("San Andreas Ave");
  const [zone, setZone] = useState<string>("Pillbox Hill");

  useNuiEvent("updateCompass", (data: any) => {
    if (data.heading !== undefined) setHeading(data.heading);
    if (data.street !== undefined) setStreet(data.street);
    if (data.zone !== undefined) setZone(data.zone);
  });

  return (
    <Box
      pos="absolute"
      top={20} 
      left="50%" 
      style={{ 
        pointerEvents: "none",
        transform: "translateX(-50%)"
      }} 
    >
      <Flex gap={8} align="center">
        
        <Flex 
          align="center" 
          gap={8} 
          bg="rgba(0, 0, 0, 0.65)" 
          px={12} 
          py={4} 
          style={{ 
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.05)' 
          }}
        >
          <FaCompass color="#e5aa45" size={12} />
          <Text 
            c="white" 
            fz="xs" 
            fw={700}
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {heading}
          </Text>
        </Flex>

        <Flex 
          align="center" 
          gap={8} 
          bg="rgba(0, 0, 0, 0.65)" 
          px={12} 
          py={4} 
          style={{ 
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <FaMapMarkerAlt color="#e53e3e" size={12} />
          <Text 
            c="white" 
            fz="xs" 
            fw={700}
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {street}
          </Text>
        </Flex>

        <Flex 
          align="center" 
          gap={8} 
          bg="rgba(0, 0, 0, 0.65)" 
          px={12} 
          py={4} 
          style={{ 
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <FaMap color="#55b9e1" size={12} />
          <Text 
            c="white" 
            fz="xs" 
            fw={700}
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {zone}
          </Text>
        </Flex>

      </Flex>
    </Box>
  );
}