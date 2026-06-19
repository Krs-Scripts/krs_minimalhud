import { Box, Flex, Text } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { FaGasPump } from "react-icons/fa";
import { TbEngineFilled } from "react-icons/tb";
import { PiSeatbeltFill, PiHeadlightsFill } from "react-icons/pi";

export default function CarHUD() {
  const [rpm, setRpm] = useState<number>(0);     
  const [fuel, setFuel] = useState<number>(0);    
  const [engine, setEngine] = useState<boolean>(false);
  const [engineHealth, setEngineHealth] = useState<number>(1000); 
  const [seatbelt, setSeatbelt] = useState<boolean>(false);
  const [lights, setLights] = useState<boolean>(false);
  const [displaySpeed, setDisplaySpeed] = useState<number>(0); 
  const targetSpeed = useRef<number>(0); 
  const currentSpeed = useRef<number>(0); 

  useNuiEvent("updateCarHUD", (data: any) => {
    if (data.speed !== undefined) targetSpeed.current = data.speed;
    if (data.rpm !== undefined) setRpm(data.rpm);
    if (data.fuel !== undefined) setFuel(data.fuel);
    if (data.engine !== undefined) setEngine(data.engine);
    if (data.engineHealth !== undefined) setEngineHealth(data.engineHealth); 
    if (data.seatbelt !== undefined) setSeatbelt(data.seatbelt);
    if (data.lights !== undefined) setLights(data.lights);
  });

  useEffect(() => {
    let animationFrameId: number;

    const animateSpeed = () => {
      const diff = targetSpeed.current - currentSpeed.current;

      if (Math.abs(diff) > 0.5) {
        currentSpeed.current += diff * 0.3;
        setDisplaySpeed(Math.round(currentSpeed.current));
      } else if (currentSpeed.current !== targetSpeed.current) {
        currentSpeed.current = targetSpeed.current;
        setDisplaySpeed(targetSpeed.current);
      }

      animationFrameId = requestAnimationFrame(animateSpeed);
    };

    animationFrameId = requestAnimationFrame(animateSpeed);
    return () => cancelAnimationFrame(animationFrameId); 
  }, []);

  const getEngineColor = () => {
    if (!engine) return "#292929e0";
    if (engineHealth > 800) return "#eaeaeae1"; 
    if (engineHealth > 500) return "#fffb00e3"; 
    if (engineHealth > 300) return "#ff8801e7";
    return "#ee4040e8"; 
  };

  return (
    <Box
      pos="absolute"
      bottom={20}
      right={20} 
      style={{ 
        pointerEvents: "none",
        transform: "perspective(1200px) rotateX(4deg) rotateY(4deg) rotateZ(1deg)",
        transformOrigin: "bottom right"
      }} 
    >
      <Flex direction="column" w={260} gap={8}> 
        
        <Flex w="100%" justify="space-between" align="flex-end" pb={2}>
          
          <Flex align="baseline" gap={4}>
            <Text 
              c="white" 
              fz={44} 
              fw={900} 
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)', lineHeight: 0.8 }}
            >
              {displaySpeed} 
            </Text>
            <Text 
              c="white" 
              fz="sm" 
              fw={800}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)', paddingBottom: '2px' }}
            >
              MPH
            </Text>
          </Flex>

          <Flex gap={10} pb={4}>
            <Box>
              <TbEngineFilled color={getEngineColor()} size={16} />
            </Box>
            <Box>
              <PiSeatbeltFill color={seatbelt ? "#a6ff02e3" : "#eaeaeae1"} size={16} />
            </Box>
            <Box>
              <PiHeadlightsFill color={lights ? "#00a2ffe3" : "#eaeaeae1"} size={16} />
            </Box>
          </Flex>
          
        </Flex>

        <Flex w="100%" gap={4}>
          {[...Array(12)].map((_, index) => (
            <Box
              key={index}
              style={{ 
                flex: 1, 
                height: '24px', 
                backgroundColor: index < Math.floor(rpm / (100 / 12)) 
                  ? (index >= 10 ? "#e53e3e" : "#bffa1d") 
                  : "#1a1a1a",
                border: '2px solid #111',
                transform: 'skewX(-25deg)', 
                transition: "background 0.1s" 
              }}
            />
          ))}
        </Flex>

        <Flex w="100%" align="center" gap={6}>

          <Text 
            w={24} 
            ta="left"
            c="white" 
            fz="xs" 
            fw={800}
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {Math.round(fuel)}
          </Text>

          <Box w={14} display="flex" style={{ justifyContent: "center" }}>
            <FaGasPump color="white" size={12} />
          </Box>

          <Flex flex={1} gap={3} ml={8}>
            {[...Array(10)].map((_, index) => (
              <Box
                key={index}
                style={{ 
                  flex: 1, 
                  height: '8px',
                  backgroundColor: index < Math.floor(fuel / 10) 
                    ? (fuel <= 20 ? "#f59e0b" : "#e5aa45") 
                    : "#1a1a1a",
                  border: '1.5px solid #111',
                  transform: 'skewX(-25deg)',
                  transition: "background 0.5s" 
                }}
              />
            ))}
          </Flex>
          
        </Flex>

      </Flex>
    </Box>
  );
}