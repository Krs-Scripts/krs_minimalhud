Framework = {}
QBCore, ESX = nil, nil
Config = Config or {}

if GetResourceState("qbx_core") == "started" then
    Config.Framework = "Qbox"
elseif GetResourceState("qb-core") == "started" then
    QBCore = exports['qb-core']:GetCoreObject()
    Config.Framework = "QBCore"
elseif GetResourceState("es_extended") == "started" then
    ESX = exports["es_extended"]:getSharedObject()
    Config.Framework = "ESX"
else
    Config.Framework = "none"
end

print("[HUD] Framework detected and started: " .. Config.Framework)

if not IsDuplicityVersion() then
    Framework.PlayerLoggedIn = false
    Framework.Hunger = 100
    Framework.Thirst = 100

    function Framework.GetPlayerData()
        if Config.Framework == "QBCore" then
            return QBCore.Functions.GetPlayerData()
        elseif Config.Framework == "Qbox" then
            return exports.qbx_core:GetPlayerData()
        elseif Config.Framework == "ESX" then
            return ESX.GetPlayerData()
        end
        return nil
    end

    function Framework.GetVehicleFuel(vehicle)
        if not DoesEntityExist(vehicle) then return 0 end

        local sys = Config.FuelSystem
        
        if sys == "ox_fuel" then
            return Entity(vehicle).state.fuel or 0
        elseif sys == "Renewed-Fuel" then
            return GetVehicleFuelLevel(vehicle)
        elseif sys == "LegacyFuel" or sys == "ps-fuel" or sys == "lj-fuel" or sys == "cdn-fuel" then
            return exports[sys]:GetFuel(vehicle)
        elseif sys == "ti_fuel" then
            return exports["ti_fuel"]:getFuel(vehicle)
        elseif sys == "rcore_fuel" then
            return exports["rcore_fuel"]:GetFuel(vehicle) 
        end
        
        return 100
    end

    function Framework.InitNeedsEvents()
        local player = GetPlayerServerId(cache.playerId)

        if Config.Framework == "ESX" then
            RegisterNetEvent("esx_status:onTick")
            AddEventHandler("esx_status:onTick", function(data)
                for i = 1, #data do
                    if data[i].name == "thirst" then 
                        Framework.Thirst = math.floor(data[i].percent) 
                    end
                    if data[i].name == "hunger" then 
                        Framework.Hunger = math.floor(data[i].percent) 
                    end
                end
            end)
        elseif Config.Framework == "QBCore" then
            RegisterNetEvent("hud:client:UpdateNeeds", function(newHunger, newThirst)
                Framework.Hunger = newHunger
                Framework.Thirst = newThirst
            end)
        elseif Config.Framework == "Qbox" then
            if LocalPlayer.state.hunger then Framework.Hunger = LocalPlayer.state.hunger end
            if LocalPlayer.state.thirst then Framework.Thirst = LocalPlayer.state.thirst end

            AddStateBagChangeHandler("hunger", ("player:%s"):format(player), function(_, _, value)
                Framework.Hunger = value
            end)
            AddStateBagChangeHandler("thirst", ("player:%s"):format(player), function(_, _, value)
                Framework.Thirst = value
            end)
        end
    end

 function Framework.PlayerLoginHud()
        if Config.Framework == "QBCore" then
            RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
                Framework.PlayerLoggedIn = true
            end)

            RegisterNetEvent("QBCore:Client:OnPlayerUnload", function()
                Framework.PlayerLoggedIn = false
            end)

        elseif Config.Framework == "Qbox" then
            AddStateBagChangeHandler("isLoggedIn", ("player:%s"):format(cache.serverId), function(_, _, loggedIn)
                Framework.PlayerLoggedIn = loggedIn
            end)

        elseif Config.Framework == "ESX" then
            
            local function AwaitESXPlayer()
                CreateThread(function()
                    local timer = 0
                    while not Framework.GetPlayerData() or PlayerPedId() == 0 do
                        Wait(100)
                        timer = timer + 100
                        if timer >= 30000 then
                            print("[krs_hud] ERROR: Ped has not loaded or GetPlayerData returned false (waited 30 seconds)")
                            return
                        end
                    end
                    Framework.PlayerLoggedIn = true
                end)
            end

            RegisterNetEvent("esx:playerLoaded", function()
                AwaitESXPlayer()
            end)

            RegisterNetEvent("esx:onPlayerSpawn", function()
                AwaitESXPlayer()
            end)

            RegisterNetEvent("esx:onPlayerLogout", function()
                Framework.PlayerLoggedIn = false
            end)

        else
            CreateThread(function()
                local timer = 0
                while PlayerPedId() == 0 do
                    Wait(100)
                    timer = timer + 100
                    if timer >= 500000 then
                        print("[krs_hud] ERROR: [Standalone] Ped never loaded in; could not login (waited 500 seconds)")
                        return
                    end
                end
                Framework.PlayerLoggedIn = true
            end)
        end
    end

    CreateThread(function()
        Framework.PlayerLoginHud()
        Framework.InitNeedsEvents()
    end)

    AddEventHandler('onResourceStart', function(resourceName)
        if GetCurrentResourceName() ~= resourceName then return end
        
        Wait(1000) 
        
        if Config.Framework == "QBCore" then
            local PlayerData = QBCore.Functions.GetPlayerData()
            if PlayerData and next(PlayerData) then 
                Framework.PlayerLoggedIn = true 
            end
        elseif Config.Framework == "Qbox" then
            if LocalPlayer.state.isLoggedIn then 
                Framework.PlayerLoggedIn = true 
            end
        elseif Config.Framework == "ESX" then
            if ESX.IsPlayerLoaded() then 
                Framework.PlayerLoggedIn = true 
            end
        else
            if PlayerPedId() > 0 then 
                Framework.PlayerLoggedIn = true 
            end
        end
    end)

else
    function Framework.GetPlayer(source)
        if Config.Framework == "QBCore" then
            return QBCore.Functions.GetPlayer(source)
        elseif Config.Framework == "Qbox" then
            return exports.qbx_core:GetPlayer(source)
        elseif Config.Framework == "ESX" then
            return ESX.GetPlayerFromId(source)
        end
        return nil
    end

    function Framework.Notify(source, text, type, length)
        type = type or "info"
        length = length or 5000

        if Config.Framework == "QBCore" then
            if type == "info" then type = "primary" end
            TriggerClientEvent('QBCore:Notify', source, text, type, length)
            
        elseif Config.Framework == "Qbox" then
            exports.qbx_core:Notify(source, text, type, length)
            
        elseif Config.Framework == "ESX" then
            TriggerClientEvent('esx:showNotification', source, text, type, length)
        else
            TriggerClientEvent('ox_lib:notify', source, {
                title = 'Notification',
                description = text,
                type = type,
                duration = length
            })
        end
    end
end


