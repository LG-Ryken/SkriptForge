// SkriptForge — Compiler
window.SF_Compiler = (function () {
  "use strict";

  function fv(b, n) { const f = b.getField(n); return f ? f.getValue() : ""; }

  const SCOPE_OPENERS = new Set([
    "sk_on_join","sk_on_quit","sk_on_chat","sk_on_death","sk_on_respawn","sk_on_damage",
    "sk_on_heal","sk_on_break","sk_on_place","sk_on_right_click","sk_on_left_click",
    "sk_on_item_drop","sk_on_item_pickup","sk_on_consume","sk_on_craft",
    "sk_on_inventory_click","sk_on_entity_spawn","sk_on_entity_death","sk_on_projectile_hit",
    "sk_on_server_start","sk_on_server_stop","sk_on_move","sk_on_sneak","sk_on_sprint",
    "sk_on_command","sk_every_x_seconds",
    "sk_if_permission","sk_if_gamemode","sk_if_world","sk_if_health_below","sk_if_health_above",
    "sk_if_food_below","sk_if_online","sk_if_op","sk_if_sneaking","sk_if_flying",
    "sk_if_sprinting","sk_if_on_ground","sk_if_holding","sk_if_has_item","sk_if_block_is",
    "sk_if_var_equals","sk_if_var_greater","sk_if_var_less","sk_if_var_set",
    "sk_else","sk_else_if_perm",
    "sk_loop_players","sk_loop_times","sk_loop_list","sk_async","sk_function_def",
  ]);

  const SCOPE_BACK = new Set(["sk_else","sk_else_if_perm"]);

  // ── Forward ────────────────────────────────────────────────────────────────
  function blockLine(b) {
    switch (b.type) {
      case "sk_on_join":             return "on join:";
      case "sk_on_quit":             return "on quit:";
      case "sk_on_chat":             return "on chat:";
      case "sk_on_death":            return "on death:";
      case "sk_on_respawn":          return "on respawn:";
      case "sk_on_damage":           return "on damage:";
      case "sk_on_heal":             return "on heal:";
      case "sk_on_break":            return "on break:";
      case "sk_on_place":            return "on place:";
      case "sk_on_right_click":      return "on right click:";
      case "sk_on_left_click":       return "on left click:";
      case "sk_on_item_drop":        return "on item drop:";
      case "sk_on_item_pickup":      return "on item pickup:";
      case "sk_on_consume":          return "on consume:";
      case "sk_on_craft":            return "on crafting:";
      case "sk_on_inventory_click":  return "on inventory click:";
      case "sk_on_entity_spawn":     return "on entity spawn:";
      case "sk_on_entity_death":     return "on entity death:";
      case "sk_on_projectile_hit":   return "on projectile hit:";
      case "sk_on_server_start":     return "on load:";
      case "sk_on_server_stop":      return "on unload:";
      case "sk_on_move":             return "on move:";
      case "sk_on_sneak":            return "on toggle sneak:";
      case "sk_on_sprint":           return "on toggle sprint:";
      case "sk_on_command":          return `on command "/${fv(b,"CMD")}":`;
      case "sk_every_x_seconds":     return `every ${fv(b,"SEC")} seconds:`;

      case "sk_if_permission":       return `if player has permission "${fv(b,"PERM")}":`;
      case "sk_if_gamemode":         return `if player's gamemode is ${fv(b,"GM")}:`;
      case "sk_if_world":            return `if world's name is "${fv(b,"WORLD")}":`;
      case "sk_if_health_below":     return `if player's health < ${fv(b,"HP")}:`;
      case "sk_if_health_above":     return `if player's health > ${fv(b,"HP")}:`;
      case "sk_if_food_below":       return `if player's food level < ${fv(b,"FOOD")}:`;
      case "sk_if_online":           return `if player "${fv(b,"PLAYER")}" is online:`;
      case "sk_if_op":               return `if player is an op:`;
      case "sk_if_sneaking":         return `if player is sneaking:`;
      case "sk_if_flying":           return `if player is flying:`;
      case "sk_if_sprinting":        return `if player is sprinting:`;
      case "sk_if_on_ground":        return `if player is on ground:`;
      case "sk_if_holding":          return `if player is holding ${fv(b,"ITEM")}:`;
      case "sk_if_has_item":         return `if player has ${fv(b,"AMT")} ${fv(b,"ITEM")} in inventory:`;
      case "sk_if_block_is":         return `if type of block below player is ${fv(b,"BLOCK")}:`;
      case "sk_if_var_equals":       return `if {var::${fv(b,"KEY")}} is "${fv(b,"VAL")}":`;
      case "sk_if_var_greater":      return `if {var::${fv(b,"KEY")}} > ${fv(b,"VAL")}:`;
      case "sk_if_var_less":         return `if {var::${fv(b,"KEY")}} < ${fv(b,"VAL")}:`;
      case "sk_if_var_set":          return `if {var::${fv(b,"KEY")}} is set:`;
      case "sk_else":                return `else:`;
      case "sk_else_if_perm":        return `else if player has permission "${fv(b,"PERM")}":`;

      case "sk_send_message":        return `send "${fv(b,"MSG")}" to player`;
      case "sk_send_title":          return `send title "${fv(b,"MSG")}" to player`;
      case "sk_send_subtitle":       return `send subtitle "${fv(b,"MSG")}" to player`;
      case "sk_send_actionbar":      return `send action bar "${fv(b,"MSG")}" to player`;
      case "sk_broadcast":           return `broadcast "${fv(b,"MSG")}"`;
      case "sk_log_console":         return `log "${fv(b,"MSG")}"`;

      case "sk_set_gamemode":        return `set player's gamemode to ${fv(b,"GM")}`;
      case "sk_set_health":          return `set player's health to ${fv(b,"HP")}`;
      case "sk_heal":                return `heal player`;
      case "sk_set_food":            return `set player's food level to ${fv(b,"FOOD")}`;
      case "sk_add_xp":              return `give ${fv(b,"XP")} experience points to player`;
      case "sk_set_level":           return `set player's level to ${fv(b,"LVL")}`;
      case "sk_set_fly":             return `set player's flight to ${fv(b,"FLY")}`;
      case "sk_teleport_spawn":      return `teleport player to spawn of world`;
      case "sk_teleport_coords":     return `teleport player to location(${fv(b,"X")}, ${fv(b,"Y")}, ${fv(b,"Z")}, world "${fv(b,"WORLD")}")`;
      case "sk_give_item":           return `give player ${fv(b,"AMT")} ${fv(b,"ITEM")}`;
      case "sk_remove_item":         return `remove ${fv(b,"AMT")} ${fv(b,"ITEM")} from player's inventory`;
      case "sk_clear_inventory":     return `clear player's inventory`;
      case "sk_kick":                return `kick player due to "${fv(b,"REASON")}"`;
      case "sk_ban":                 return `ban player due to "${fv(b,"REASON")}"`;
      case "sk_op":                  return `op player`;
      case "sk_deop":                return `deop player`;

      case "sk_spawn_particle":      return `spawn ${fv(b,"COUNT")} ${fv(b,"PART")} particles at player`;
      case "sk_play_sound":          return `play sound "${fv(b,"SND")}" to player at volume ${fv(b,"VOL")}`;
      case "sk_apply_effect":        return `apply ${fv(b,"EFF")} ${fv(b,"TIER")} to player for ${fv(b,"DUR")} seconds`;
      case "sk_remove_effect":       return `remove ${fv(b,"EFF")} from player`;
      case "sk_clear_effects":       return `clear all potion effects from player`;
      case "sk_set_block":           return `set block at player's location to ${fv(b,"BLOCK")}`;
      case "sk_explosion":           return `create an explosion with force ${fv(b,"PWR")} at player's location`;
      case "sk_lightning":           return `spawn lightning at player's location`;
      case "sk_spawn_mob":           return `spawn ${fv(b,"MOB")} at player's location`;
      case "sk_set_weather":         return `set weather in world to ${fv(b,"WX")}`;
      case "sk_set_time":            return `set time in world to ${fv(b,"TIME")}`;
      case "sk_run_command":         return `make player execute command "${fv(b,"CMD")}"`;
      case "sk_run_console":         return `execute console command "${fv(b,"CMD")}"`;
      case "sk_wait":                return `wait ${fv(b,"SEC")} seconds`;
      case "sk_cancel_event":        return `cancel event`;
      case "sk_stop":                return `stop`;

      case "sk_set_var_str":         return `set {var::${fv(b,"KEY")}} to "${fv(b,"VAL")}"`;
      case "sk_set_var_num":         return `set {var::${fv(b,"KEY")}} to ${fv(b,"VAL")}`;
      case "sk_set_player_var":      return `set {pvar::${fv(b,"KEY")}::%player%} to "${fv(b,"VAL")}"`;
      case "sk_delete_var":          return `delete {var::${fv(b,"KEY")}}`;
      case "sk_add_to_var":          return `add ${fv(b,"AMT")} to {var::${fv(b,"KEY")}}`;
      case "sk_subtract_var":        return `remove ${fv(b,"AMT")} from {var::${fv(b,"KEY")}}`;
      case "sk_add_to_list":         return `add "${fv(b,"VAL")}" to {list::${fv(b,"KEY")}::*}`;
      case "sk_clear_list":          return `clear {list::${fv(b,"KEY")}::*}`;

      case "sk_loop_players":        return `loop all players:`;
      case "sk_loop_times":          return `loop ${fv(b,"N")} times:`;
      case "sk_loop_list":           return `loop {list::${fv(b,"KEY")}::*}:`;
      case "sk_exit_loop":           return `exit loop`;
      case "sk_continue":            return `continue`;
      case "sk_async":               return `async:`;

      case "sk_function_def":        return `function ${fv(b,"NAME")}(${fv(b,"PARAMS")}):`;
      case "sk_function_call":       return `${fv(b,"NAME")}(${fv(b,"ARGS")})`;
      case "sk_function_return":     return `return ${fv(b,"VAL")}`;

      default: return `# [unknown: ${b.type}]`;
    }
  }

  function generate(workspace) {
    const roots = workspace.getTopBlocks(true);
    if (!roots.length) return null;
    const out = [];
    roots.forEach((root, ri) => {
      if (ri > 0) out.push({ d: -1, t: "" });
      let depth = 0, cur = root;
      while (cur) {
        if (SCOPE_BACK.has(cur.type)) depth = Math.max(0, depth - 1);
        out.push({ d: depth, t: blockLine(cur) });
        if (SCOPE_OPENERS.has(cur.type)) depth++;
        cur = cur.getNextBlock();
      }
    });
    return out.map(({ d, t }) => d === -1 ? "" : "    ".repeat(d) + t).join("\n");
  }

  // ── Highlight ──────────────────────────────────────────────────────────────
  const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  function highlight(code) {
    return code.split("\n").map((line, i) => {
      const t = line.trim();
      const n = String(i + 1).padStart(3, " ");
      let cls = "sk-plain";
      if (!t)                                        cls = "sk-blank";
      else if (t.startsWith("#"))                    cls = "sk-comment";
      else if (/^(on |every )/.test(t))              cls = "sk-event";
      else if (/^(if |else)/.test(t))                cls = "sk-cond";
      else if (/^(loop |async:|function )/.test(t))  cls = "sk-loop";
      else if (/^(set \{|add .+ to \{|remove .+ from \{|delete \{|clear \{)/.test(t)) cls = "sk-var";
      else if (/^(send |broadcast |log )/.test(t))   cls = "sk-msg";
      else if (/^(spawn |play |apply |create |set block|set weather|set time|execute console|make player execute)/.test(t)) cls = "sk-eff";
      else                                           cls = "sk-act";
      return `<span class="ln">${esc(n)}</span><span class="${cls}">${esc(line)}</span>`;
    }).join("\n");
  }

  // ── Reverse compiler ───────────────────────────────────────────────────────
  function xa(v) { return String(v).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function fxml(name, val) { return `<field name="${name}">${xa(val)}</field>`; }

  function parseLine(raw) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) return null;
    let m;

    if (line === "on join:")            return { type:"sk_on_join" };
    if (line === "on quit:")            return { type:"sk_on_quit" };
    if (line === "on chat:")            return { type:"sk_on_chat" };
    if (line === "on death:")           return { type:"sk_on_death" };
    if (line === "on respawn:")         return { type:"sk_on_respawn" };
    if (line === "on damage:")          return { type:"sk_on_damage" };
    if (line === "on heal:")            return { type:"sk_on_heal" };
    if (line === "on break:")           return { type:"sk_on_break" };
    if (line === "on place:")           return { type:"sk_on_place" };
    if (line === "on right click:")     return { type:"sk_on_right_click" };
    if (line === "on left click:")      return { type:"sk_on_left_click" };
    if (line === "on item drop:")       return { type:"sk_on_item_drop" };
    if (line === "on item pickup:")     return { type:"sk_on_item_pickup" };
    if (line === "on consume:")         return { type:"sk_on_consume" };
    if (line === "on crafting:")        return { type:"sk_on_craft" };
    if (line === "on inventory click:") return { type:"sk_on_inventory_click" };
    if (line === "on entity spawn:")    return { type:"sk_on_entity_spawn" };
    if (line === "on entity death:")    return { type:"sk_on_entity_death" };
    if (line === "on projectile hit:")  return { type:"sk_on_projectile_hit" };
    if (line === "on load:")            return { type:"sk_on_server_start" };
    if (line === "on unload:")          return { type:"sk_on_server_stop" };
    if (line === "on move:")            return { type:"sk_on_move" };
    if (line === "on toggle sneak:")    return { type:"sk_on_sneak" };
    if (line === "on toggle sprint:")   return { type:"sk_on_sprint" };

    m = line.match(/^on command "\/?(.*?)":$/);
    if (m) return { type:"sk_on_command", f:{ CMD:m[1] } };
    m = line.match(/^every (\d+(?:\.\d+)?) seconds:$/);
    if (m) return { type:"sk_every_x_seconds", f:{ SEC:m[1] } };

    m = line.match(/^if player has permission "(.+?)":$/);
    if (m) return { type:"sk_if_permission", f:{ PERM:m[1] } };
    m = line.match(/^if player's gamemode is (\w+):$/);
    if (m) return { type:"sk_if_gamemode", f:{ GM:m[1] } };
    m = line.match(/^if world's name is "(.+?)":$/);
    if (m) return { type:"sk_if_world", f:{ WORLD:m[1] } };
    m = line.match(/^if player's health < ([\d.]+):$/);
    if (m) return { type:"sk_if_health_below", f:{ HP:m[1] } };
    m = line.match(/^if player's health > ([\d.]+):$/);
    if (m) return { type:"sk_if_health_above", f:{ HP:m[1] } };
    m = line.match(/^if player's food level < ([\d.]+):$/);
    if (m) return { type:"sk_if_food_below", f:{ FOOD:m[1] } };
    m = line.match(/^if player "(.+?)" is online:$/);
    if (m) return { type:"sk_if_online", f:{ PLAYER:m[1] } };
    if (line === "if player is an op:")    return { type:"sk_if_op" };
    if (line === "if player is sneaking:") return { type:"sk_if_sneaking" };
    if (line === "if player is flying:")   return { type:"sk_if_flying" };
    if (line === "if player is sprinting:")return { type:"sk_if_sprinting" };
    if (line === "if player is on ground:")return { type:"sk_if_on_ground" };
    m = line.match(/^if player is holding (.+?):$/);
    if (m) return { type:"sk_if_holding", f:{ ITEM:m[1] } };
    m = line.match(/^if player has (\d+) (.+?) in inventory:$/);
    if (m) return { type:"sk_if_has_item", f:{ AMT:m[1], ITEM:m[2] } };
    m = line.match(/^if type of block below player is (.+?):$/);
    if (m) return { type:"sk_if_block_is", f:{ BLOCK:m[1] } };
    m = line.match(/^if \{var::(.+?)\} is "(.+?)":$/);
    if (m) return { type:"sk_if_var_equals", f:{ KEY:m[1], VAL:m[2] } };
    m = line.match(/^if \{var::(.+?)\} > ([\d.]+):$/);
    if (m) return { type:"sk_if_var_greater", f:{ KEY:m[1], VAL:m[2] } };
    m = line.match(/^if \{var::(.+?)\} < ([\d.]+):$/);
    if (m) return { type:"sk_if_var_less", f:{ KEY:m[1], VAL:m[2] } };
    m = line.match(/^if \{var::(.+?)\} is set:$/);
    if (m) return { type:"sk_if_var_set", f:{ KEY:m[1] } };
    if (line === "else:") return { type:"sk_else" };
    m = line.match(/^else if player has permission "(.+?)":$/);
    if (m) return { type:"sk_else_if_perm", f:{ PERM:m[1] } };

    m = line.match(/^send "(.+?)" to player$/);
    if (m) return { type:"sk_send_message", f:{ MSG:m[1] } };
    m = line.match(/^send title "(.+?)" to player$/);
    if (m) return { type:"sk_send_title", f:{ MSG:m[1] } };
    m = line.match(/^send subtitle "(.+?)" to player$/);
    if (m) return { type:"sk_send_subtitle", f:{ MSG:m[1] } };
    m = line.match(/^send action bar "(.+?)" to player$/);
    if (m) return { type:"sk_send_actionbar", f:{ MSG:m[1] } };
    m = line.match(/^broadcast "(.+?)"$/);
    if (m) return { type:"sk_broadcast", f:{ MSG:m[1] } };
    m = line.match(/^log "(.+?)"$/);
    if (m) return { type:"sk_log_console", f:{ MSG:m[1] } };

    m = line.match(/^set player's gamemode to (\w+)$/);
    if (m) return { type:"sk_set_gamemode", f:{ GM:m[1] } };
    m = line.match(/^set player's health to ([\d.]+)$/);
    if (m) return { type:"sk_set_health", f:{ HP:m[1] } };
    if (line === "heal player") return { type:"sk_heal" };
    m = line.match(/^set player's food level to ([\d.]+)$/);
    if (m) return { type:"sk_set_food", f:{ FOOD:m[1] } };
    m = line.match(/^give ([\d.]+) experience points to player$/);
    if (m) return { type:"sk_add_xp", f:{ XP:m[1] } };
    m = line.match(/^set player's level to (\d+)$/);
    if (m) return { type:"sk_set_level", f:{ LVL:m[1] } };
    m = line.match(/^set player's flight to (enabled|disabled)$/);
    if (m) return { type:"sk_set_fly", f:{ FLY:m[1] } };
    if (line === "teleport player to spawn of world") return { type:"sk_teleport_spawn" };
    m = line.match(/^teleport player to location\(([-\d.]+),\s*([-\d.]+),\s*([-\d.]+),\s*world "(.+?)"\)$/);
    if (m) return { type:"sk_teleport_coords", f:{ X:m[1],Y:m[2],Z:m[3],WORLD:m[4] } };
    m = line.match(/^give player (\d+) (.+)$/);
    if (m) return { type:"sk_give_item", f:{ AMT:m[1], ITEM:m[2] } };
    m = line.match(/^remove (\d+) (.+?) from player's inventory$/);
    if (m) return { type:"sk_remove_item", f:{ AMT:m[1], ITEM:m[2] } };
    if (line === "clear player's inventory") return { type:"sk_clear_inventory" };
    m = line.match(/^kick player due to "(.+?)"$/);
    if (m) return { type:"sk_kick", f:{ REASON:m[1] } };
    m = line.match(/^ban player due to "(.+?)"$/);
    if (m) return { type:"sk_ban", f:{ REASON:m[1] } };
    if (line === "op player")   return { type:"sk_op" };
    if (line === "deop player") return { type:"sk_deop" };

    m = line.match(/^spawn (\d+) (.+?) particles at player$/);
    if (m) return { type:"sk_spawn_particle", f:{ COUNT:m[1], PART:m[2] } };
    m = line.match(/^play sound "(.+?)" to player at volume ([\d.]+)$/);
    if (m) return { type:"sk_play_sound", f:{ SND:m[1], VOL:m[2] } };
    m = line.match(/^apply (.+?) (\d+) to player for (\d+) seconds$/);
    if (m) return { type:"sk_apply_effect", f:{ EFF:m[1], TIER:m[2], DUR:m[3] } };
    m = line.match(/^remove (.+?) from player$/);
    if (m) return { type:"sk_remove_effect", f:{ EFF:m[1] } };
    if (line === "clear all potion effects from player") return { type:"sk_clear_effects" };
    m = line.match(/^set block at player's location to (.+)$/);
    if (m) return { type:"sk_set_block", f:{ BLOCK:m[1] } };
    m = line.match(/^create an explosion with force ([\d.]+) at player's location$/);
    if (m) return { type:"sk_explosion", f:{ PWR:m[1] } };
    if (line === "spawn lightning at player's location") return { type:"sk_lightning" };
    m = line.match(/^spawn (.+?) at player's location$/);
    if (m) return { type:"sk_spawn_mob", f:{ MOB:m[1] } };
    m = line.match(/^set weather in world to (.+)$/);
    if (m) return { type:"sk_set_weather", f:{ WX:m[1] } };
    m = line.match(/^set time in world to (.+)$/);
    if (m) return { type:"sk_set_time", f:{ TIME:m[1] } };
    m = line.match(/^make player execute command "(.+?)"$/);
    if (m) return { type:"sk_run_command", f:{ CMD:m[1] } };
    m = line.match(/^execute console command "(.+?)"$/);
    if (m) return { type:"sk_run_console", f:{ CMD:m[1] } };
    m = line.match(/^wait ([\d.]+) seconds$/);
    if (m) return { type:"sk_wait", f:{ SEC:m[1] } };
    if (line === "cancel event") return { type:"sk_cancel_event" };
    if (line === "stop")         return { type:"sk_stop" };

    m = line.match(/^set \{var::(.+?)\} to "(.+?)"$/);
    if (m) return { type:"sk_set_var_str", f:{ KEY:m[1], VAL:m[2] } };
    m = line.match(/^set \{var::(.+?)\} to ([\d.]+)$/);
    if (m) return { type:"sk_set_var_num", f:{ KEY:m[1], VAL:m[2] } };
    m = line.match(/^set \{pvar::(.+?)::%player%\} to "(.+?)"$/);
    if (m) return { type:"sk_set_player_var", f:{ KEY:m[1], VAL:m[2] } };
    m = line.match(/^delete \{var::(.+?)\}$/);
    if (m) return { type:"sk_delete_var", f:{ KEY:m[1] } };
    m = line.match(/^add ([\d.]+) to \{var::(.+?)\}$/);
    if (m) return { type:"sk_add_to_var", f:{ AMT:m[1], KEY:m[2] } };
    m = line.match(/^remove ([\d.]+) from \{var::(.+?)\}$/);
    if (m) return { type:"sk_subtract_var", f:{ AMT:m[1], KEY:m[2] } };
    m = line.match(/^add "(.+?)" to \{list::(.+?)::\*\}$/);
    if (m) return { type:"sk_add_to_list", f:{ VAL:m[1], KEY:m[2] } };
    m = line.match(/^clear \{list::(.+?)::\*\}$/);
    if (m) return { type:"sk_clear_list", f:{ KEY:m[1] } };

    if (line === "loop all players:")  return { type:"sk_loop_players" };
    m = line.match(/^loop (\d+) times:$/);
    if (m) return { type:"sk_loop_times", f:{ N:m[1] } };
    m = line.match(/^loop \{list::(.+?)::\*\}:$/);
    if (m) return { type:"sk_loop_list", f:{ KEY:m[1] } };
    if (line === "exit loop")  return { type:"sk_exit_loop" };
    if (line === "continue")   return { type:"sk_continue" };
    if (line === "async:")     return { type:"sk_async" };

    m = line.match(/^function (\w+)\((.+?)\):$/);
    if (m) return { type:"sk_function_def", f:{ NAME:m[1], PARAMS:m[2] } };
    m = line.match(/^(\w+)\((.+?)\)$/);
    if (m) return { type:"sk_function_call", f:{ NAME:m[1], ARGS:m[2] } };
    m = line.match(/^return (.+)$/);
    if (m) return { type:"sk_function_return", f:{ VAL:m[1] } };

    return { type:null, raw:line };
  }

  function buildChain(items) {
    if (!items.length) return "";
    const { result, rest } = { result: items[0], rest: items.slice(1) };
    const fields = Object.entries(result.f || {}).map(([k,v]) => fxml(k,v)).join("");
    if (!rest.length) return fields;
    return `${fields}<next><block type="${xa(rest[0].type)}">${buildChain(rest)}</block></next>`;
  }

  function reverseCompile(text) {
    const lines = text.split("\n");
    const unknown = [];
    const parsed = [];

    lines.forEach((raw, idx) => {
      if (!raw.trim() || raw.trim().startsWith("#")) return;
      const indent = raw.search(/\S/);
      const result = parseLine(raw);
      if (!result) return;
      if (result.type === null) { unknown.push({ lineNum: idx+1, raw: raw.trim() }); return; }
      parsed.push({ indent, result });
    });

    if (!parsed.length) return { xml: null, unknown };

    // Group by root (indent === 0)
    const groups = [];
    let cur = null;
    parsed.forEach(({ indent, result }) => {
      if (indent === 0) { cur = [result]; groups.push(cur); }
      else if (cur) cur.push(result);
    });

    let x = 40, y = 40;
    const parts = groups.map(g => {
      const tag = `<block type="${xa(g[0].type)}" x="${x}" y="${y}">${buildChain(g)}</block>`;
      y += 220; if (y > 2000) { y = 40; x += 520; }
      return tag;
    });

    return { xml: `<xml xmlns="https://developers.google.com/blockly/xml">${parts.join("")}</xml>`, unknown };
  }

  return { generate, highlight, reverseCompile };
})();