


<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/80b040fd-fda0-47d1-91ea-da8be7d13d58" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/5099a79b-ea8e-44b0-b18f-51829b0ab8c1" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/ef76e674-0963-4d1a-8442-6eaa95fd3b58" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/cfb2fdd8-4d05-4598-b457-b6b5122f6d0a" />


# krs_hud

A clean HUD for FiveM built with React + Mantine.

**Author:** Krs Scripts (karos7804)

---

## Installation

1. Make sure `ox_lib` is installed and started before this resource.

2. Drop the `krs_hud` folder into your server's `resources` directory.

3. Build the web UI (only needed once, or after editing the React source):

   ```bash
   cd web
   npm install
   npm run build
   ```

4. Add the resource to your `server.cfg`, after its dependencies:

   ```cfg
   ensure ox_lib
   ensure krs_hud
   ```

5. Open `shared/config.lua` and set your framework and fuel system (see below).

6. Restart your server.

---

## Supported frameworks

The framework is detected automatically at startup, or you can force it in `shared/config.lua`.

- **QBCore** (`qb-core`)
- **Qbox** (`qbx_core`)
- **ESX** (`es_extended`)
- **Standalone** (no framework)

```lua
-- Leave as "auto" to auto-detect, or force it: "QBCore", "Qbox", "ESX"
Config.Framework = "auto"
```

---

## Supported fuel systems

Set your fuel system in `shared/config.lua`:

```lua
Config.FuelSystem = "ox_fuel"
```

Available options:

- `ox_fuel`
- `Renewed-Fuel`
- `LegacyFuel`
- `ps-fuel`
- `lj-fuel`
- `cdn-fuel`
- `ti_fuel`
- `rcore_fuel`

---

## Exports

Use these from any other resource to control the HUD.

```lua
-- Hide the entire krs_hud NUI
exports.krs_hud:HideHud()

-- Show the entire krs_hud NUI
exports.krs_hud:ShowHud()

-- Toggle with an optional boolean (true = visible, false = hidden).
-- With no argument it flips the current state.
exports.krs_hud:ToggleHud(false)

-- Returns true/false for the current HUD visibility
local visible = exports.krs_hud:IsHudVisible()

-- Set the radar mode: "always" | "vehicle" | "hidden"
exports.krs_hud:SetRadarMode("always")

-- Open the settings menu programmatically
exports.krs_hud:OpenHudMenu()

-- Re-send the translated UI text to the NUI (useful after a language change)
exports.krs_hud:SendHudLocales()
```

---

## Credits

Made by **Krs Scripts — karos7804**.

This project was inspired by the **minimal-hud** project:
- Maintained fork by **ThatMadCap** — https://github.com/ThatMadCap/minimal-hud
- Original author **vipexv** — https://github.com/vipexv/minimal-hud

---
