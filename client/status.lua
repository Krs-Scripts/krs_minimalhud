local isMuted = false
local isTalkingNormal = false
local isTalkingRadio = false
local proximityLevel = 2 -- Default: 1 = Whisper, 2 = Normal, 3 = Scream

RegisterCommand(Config.MuteCommand, function()
    isMuted = not isMuted
    MumbleSetAudioInputIntent(isMuted and `none` or `speech`)
end, false)

AddEventHandler("pma-voice:setTalkingMode", function(mode)
    proximityLevel = mode
end)

AddEventHandler("pma-voice:radioActive", function(radioTalking)
    isTalkingRadio = radioTalking
end)

CreateThread(function()
    while not cache.ped do
        Wait(500)
    end

    while true do
        Wait(200)

        if cache.ped then
            local health = GetEntityHealth(cache.ped) - 100
            if health < 0 then health = 0 end
            local armor = GetPedArmour(cache.ped)
            
            local stamina = 100 - GetPlayerSprintStaminaRemaining(cache.playerId)
            
            local currentOxygen = GetPlayerUnderwaterTimeRemaining(cache.playerId)
            local maxOxygen = 10.0
            local oxygen = 100
            
            if currentOxygen >= 0.0 then
                oxygen = math.floor((currentOxygen / maxOxygen) * 100)
            end
            
            if oxygen < 0 then 
                oxygen = 0 
            elseif oxygen > 100 then 
                oxygen = 100 
            end

            local isUnderwater = IsPedSwimmingUnderWater(cache.ped)

            isTalkingNormal = NetworkIsPlayerTalking(cache.playerId)

            local isTalking = (isTalkingNormal or isTalkingRadio) and not isMuted

            SendNUIMessage({
                action = "updateStatus",
                data = {
                    health = health,
                    armor = armor,
                    hunger = Framework.Hunger or 100,
                    thirst = Framework.Thirst or 100,
                    stamina = math.floor(stamina),
                    oxygen = oxygen,
                    isUnderwater = isUnderwater, 
                    id = cache.serverId,
                    voice = {
                        isMuted = isMuted,
                        isTalking = isTalking,
                        isRadio = isTalkingRadio,
                        proximity = proximityLevel
                    }
                }
            })
        end
    end
end)