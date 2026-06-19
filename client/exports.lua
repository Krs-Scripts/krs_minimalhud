HudState = HudState or {}
HudState.Visible = true          
HudState.RadarMode = "vehicle"   -- "always" | "vehicle" | "hidden"
HudState.MenuOpen = false
HudState.Cinematic = false
HudState.HideAll = false

local KVP_KEY = "krs_hud:settings"

lib.locale()

local function GetLocales()
    return {
        hud_settings        = locale("hud_settings"),
        cinematic_mode      = locale("cinematic_mode"),
        hide_all_components = locale("hide_all_components"),
        radar               = locale("radar"),
        radar_always        = locale("radar_always"),
        radar_vehicle       = locale("radar_vehicle"),
        radar_hidden        = locale("radar_hidden"),
        save                = locale("save"),
        saved               = locale("saved"),
    }
end

local function SendLocales()
    SendNUIMessage({ action = "setLocales", data = GetLocales() })
end

exports("SendHudLocales", SendLocales)

local function SaveSettings()
    local data = {
        cinematic = HudState.Cinematic,
        hideAll   = HudState.HideAll,
        radarMode = HudState.RadarMode,
    }
    SetResourceKvp(KVP_KEY, json.encode(data))
end

local function GetSavedSettings()
    local raw = GetResourceKvpString(KVP_KEY)
    if not raw then return nil end
    local ok, data = pcall(json.decode, raw)
    if ok and type(data) == "table" then return data end
    return nil
end

local function HideHud()
    HudState.Visible = false
    SendNUIMessage({ action = "setHideAll", data = true })
end

local function ShowHud()
    HudState.Visible = true
    SendNUIMessage({ action = "setHideAll", data = false })
end

local function ToggleHud(state)
    if state == nil then state = not HudState.Visible end
    if state then ShowHud() else HideHud() end
end

exports("HideHud", HideHud)
exports("ShowHud", ShowHud)
exports("ToggleHud", ToggleHud)

exports("IsHudVisible", function()
    return HudState.Visible
end)

local function ApplyRadarMode()
    if HudState.Cinematic or HudState.HideAll then
        DisplayRadar(false)
        return
    end

    if HudState.RadarMode == "always" then
        DisplayRadar(true)
    elseif HudState.RadarMode == "hidden" then
        DisplayRadar(false)
    elseif HudState.RadarMode == "vehicle" then
        DisplayRadar(cache.vehicle ~= nil and cache.vehicle ~= false)
    end
end

CreateThread(function()
    while true do
        Wait(500)
        ApplyRadarMode()
    end
end)

local function SetRadarMode(mode)
    HudState.RadarMode = mode
    ApplyRadarMode()
end

exports("SetRadarMode", SetRadarMode)

local function ApplyState()
    HudState.Visible = not HudState.HideAll
    SendNUIMessage({ action = "setHideAll", data = HudState.HideAll })
    SendNUIMessage({ action = "setCinematic", data = HudState.Cinematic })
    ApplyRadarMode()

    SendNUIMessage({
        action = "loadSettings",
        data = {
            cinematic = HudState.Cinematic,
            hideAll   = HudState.HideAll,
            radarMode = HudState.RadarMode,
        }
    })
end

CreateThread(function()
    while not cache.ped do Wait(500) end
    while not Framework.PlayerLoggedIn do Wait(500) end
    Wait(1000) 

    SendLocales()

    local saved = GetSavedSettings()
    if saved then
        HudState.Cinematic = saved.cinematic or false
        HudState.HideAll   = saved.hideAll or false
        HudState.RadarMode = saved.radarMode or "vehicle"
    end

    ApplyState()
end)

local function OpenMenu()
    HudState.MenuOpen = true
    SetNuiFocus(true, true)
    SendLocales() 

    SendNUIMessage({
        action = "loadSettings",
        data = {
            cinematic = HudState.Cinematic,
            hideAll   = HudState.HideAll,
            radarMode = HudState.RadarMode,
        }
    })
    SendNUIMessage({ action = "setMenu", data = true })
end

local function CloseMenu()
    HudState.MenuOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({ action = "setMenu", data = false })
end

exports("OpenHudMenu", OpenMenu)

RegisterCommand(Config.MenuCommand or "hudmenu", function()
    if HudState.MenuOpen then CloseMenu() else OpenMenu() end
end, false)

RegisterNUICallback("closeMenu", function(_, cb)
    CloseMenu()
    cb({})
end)

RegisterNUICallback("toggleCinematic", function(data, cb)
    HudState.Cinematic = data.state
    SendNUIMessage({ action = "setCinematic", data = data.state })
    ApplyRadarMode() 
    cb({})
end)

RegisterNUICallback("toggleHideAll", function(data, cb)
    HudState.HideAll = data.state
    HudState.Visible = not data.state
    SendNUIMessage({ action = "setHideAll", data = data.state })
    ApplyRadarMode() 
    cb({})
end)

RegisterNUICallback("setRadarMode", function(data, cb)
    SetRadarMode(data.mode)
    cb({})
end)

RegisterNUICallback("saveSettings", function(data, cb)
    HudState.Cinematic = data.cinematic
    HudState.HideAll   = data.hideAll
    HudState.RadarMode = data.radarMode
    SaveSettings()
    cb({ ok = true })
end)