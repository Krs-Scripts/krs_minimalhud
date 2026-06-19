local vehicleTick = false
local mapLoaded = false


local function loadMap()
    if mapLoaded then return end
    mapLoaded = true

    CreateThread(function()
        local minimap = RequestScaleformMovie('minimap')
        while not HasScaleformMovieLoaded(minimap) do
            Wait(10)
        end

        local defaultAspectRatio = 1920 / 1080
        local resolutionX, resolutionY = GetActiveScreenResolution()
        local aspectRatio = resolutionX / resolutionY
        local minimapOffset = 0
        if aspectRatio > defaultAspectRatio then
            minimapOffset = ((defaultAspectRatio - aspectRatio) / 3.6) - 0.008
        end

        lib.requestStreamedTextureDict('krs_minimap')
        SetMinimapClipType(1)
        AddReplaceTexture('platform:/textures/graphics', 'radarmasksm', 'krs_minimap', 'radarkrs')
        AddReplaceTexture('platform:/textures/graphics', 'radarmask1g', 'krs_minimap', 'radarkrs')

        SetMinimapComponentPosition('minimap', 'L', 'B', 0.0 + minimapOffset, -0.047, 0.1638, 0.183)
        SetMinimapComponentPosition('minimap_mask', 'L', 'B', 0.0 + minimapOffset, 0.0, 0.128, 0.20)
        SetMinimapComponentPosition('minimap_blur', 'L', 'B', -0.01 + minimapOffset, 0.025, 0.262, 0.300)

        SetBlipAlpha(GetNorthRadarBlip(), 0)
        SetMinimapClipType(1)

        SetBigmapActive(true, false)
        Wait(50)
        SetBigmapActive(false, false)

        SetStreamedTextureDictAsNoLongerNeeded('krs_minimap')
        DisplayRadar(false)
    end)
end

CreateThread(function()
    while not cache.ped do 
        Wait(500) 
    end

    while not Framework.PlayerLoggedIn do
        Wait(500)
    end

    Wait(1000)
    
    loadMap()
end)

CreateThread(function()
    while true do
        Wait(500)
        if vehicleTick then
            SetBigmapActive(false, false)
            SetRadarZoom(1000)
        end
    end
end)

local function GetDirection(heading)
    if heading >= 337.5 or heading < 22.5 then return "N"
    elseif heading >= 22.5 and heading < 67.5 then return "NW"
    elseif heading >= 67.5 and heading < 112.5 then return "W"
    elseif heading >= 112.5 and heading < 157.5 then return "SW"
    elseif heading >= 157.5 and heading < 202.5 then return "S"
    elseif heading >= 202.5 and heading < 247.5 then return "SE"
    elseif heading >= 247.5 and heading < 292.5 then return "E"
    elseif heading >= 292.5 and heading < 337.5 then return "NE"
    end
    return "N"
end

lib.onCache('vehicle', function(vehicle)
    if vehicle and not IsPedInFlyingVehicle(cache.ped) then
        
        vehicleTick = true
        DisplayRadar(true) 
        SendNUIMessage({ action = "setShowCarHUD", data = true })

        CreateThread(function()
            local tick = 4 
            local currentFuel = 0
            local currentEngine = false
            local currentLights = false
            local currentHeading = "N"
            local currentStreet = ""
            local currentZone = ""
            local lastCoords = vector3(0,0,0)
            local lastSpeed = -1
            local lastRpm = -1
            local lastSeatbelt = nil
            local forceUpdate = true 

            while vehicleTick do
                Wait(135) 
                
                local ped = cache.ped
                local coords = GetEntityCoords(ped)

                if tick >= 4 then
                    tick = 0
                    
                    local fuel = Framework.GetVehicleFuel(vehicle)
                    local engine = GetIsVehicleEngineRunning(vehicle)
                    local _, lightsOn, highbeams = GetVehicleLightsState(vehicle)
                    local lights = (lightsOn == 1 or highbeams == 1)

                    if fuel ~= currentFuel or engine ~= currentEngine or lights ~= currentLights then
                        currentFuel = fuel
                        currentEngine = engine
                        currentLights = lights
                        forceUpdate = true
                    end

                    if #(coords - lastCoords) > 10.0 then
                        lastCoords = coords
                        
                        local streetHash, _ = GetStreetNameAtCoord(coords.x, coords.y, coords.z)
                        local zoneHash = GetNameOfZone(coords.x, coords.y, coords.z)
                        local newStreet = GetStreetNameFromHashKey(streetHash)
                        local newZone = GetLabelText(zoneHash)
                        local newHeading = GetDirection(GetEntityHeading(ped))

                        if newStreet ~= currentStreet or newZone ~= currentZone or newHeading ~= currentHeading then
                            currentStreet = newStreet
                            currentZone = newZone
                            currentHeading = newHeading
                            
                            SendNUIMessage({
                                action = "updateCompass",
                                data = {
                                    heading = currentHeading,
                                    street = currentStreet,
                                    zone = currentZone
                                }
                            })
                        end
                    else
                        local newHeading = GetDirection(GetEntityHeading(ped))
                        if newHeading ~= currentHeading then
                            currentHeading = newHeading
                            SendNUIMessage({
                                action = "updateCompass",
                                data = { heading = currentHeading, street = currentStreet, zone = currentZone }
                            })
                        end
                    end
                end

                local speed = math.floor(GetEntitySpeed(vehicle) * 2.236936)
                local rpm = math.floor(GetVehicleCurrentRpm(vehicle) * 100)
                local seatbelt = LocalPlayer.state.seatbelt or false
                local engineHealth = math.floor(GetVehicleEngineHealth(vehicle))

                if speed ~= lastSpeed or rpm ~= lastRpm or seatbelt ~= lastSeatbelt or forceUpdate then
                    SendNUIMessage({
                        action = "updateCarHUD",
                        data = {
                            speed = speed,
                            rpm = rpm,
                            fuel = currentFuel,
                            engine = currentEngine,
                            engineHealth = engineHealth,
                            seatbelt = seatbelt,
                            lights = currentLights
                        }
                    })
                    
                    lastSpeed = speed
                    lastRpm = rpm
                    lastSeatbelt = seatbelt
                    forceUpdate = false
                end

                tick = tick + 1
            end
        end)
    else
        vehicleTick = false
        DisplayRadar(false)
        SendNUIMessage({ action = "setShowCarHUD", data = false })
    end
end)