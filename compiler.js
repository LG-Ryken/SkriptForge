// SkriptForge — Compiler (Skript 2.15)
window.SF_Compiler = (function () {
  "use strict";

  function fv(b, n) { const f = b.getField(n); return f ? f.getValue() : ""; }

  const SCOPE_OPENERS = new Set([
    "sk_on_join","sk_on_quit","sk_on_first_join","sk_on_chat","sk_on_death","sk_on_respawn",
    "sk_on_damage","sk_on_heal","sk_on_level_change","sk_on_xp_change","sk_on_food_change",
    "sk_on_sneak","sk_on_sprint","sk_on_toggle_flight","sk_on_move","sk_on_teleport",
    "sk_on_bed_enter","sk_on_bed_leave","sk_on_kick","sk_on_gamemode_change","sk_on_armor_change",
    "sk_on_command","sk_command_block",
    "sk_on_break","sk_on_place","sk_on_right_click","sk_on_left_click","sk_on_right_click_block",
    "sk_on_sign_change","sk_on_redstone",
    "sk_on_item_drop","sk_on_item_pickup","sk_on_item_damage","sk_on_consume","sk_on_craft",
    "sk_on_enchant","sk_on_arrow_pickup","sk_on_item_cooldown",
    "sk_on_inventory_open","sk_on_inventory_close","sk_on_inventory_click","sk_on_inventory_drag","sk_on_inv_item_move",
    "sk_on_entity_spawn","sk_on_entity_death","sk_on_entity_damage","sk_on_projectile_hit",
    "sk_on_projectile_launch","sk_on_entity_transform","sk_on_exp_spawn",
    "sk_on_server_start","sk_on_server_stop","sk_on_weather_change","sk_on_lightning",
    "sk_on_world_load","sk_on_world_unload","sk_on_chunk_load","sk_on_portal_create",
    "sk_every_x_seconds","sk_every_x_ticks",
    "sk_if_permission","sk_if_gamemode","sk_if_world","sk_if_op","sk_if_sneaking","sk_if_flying",
    "sk_if_sprinting","sk_if_on_ground","sk_if_sleeping","sk_if_in_vehicle","sk_if_gliding","sk_if_swimming",
    "sk_if_online","sk_if_health_below","sk_if_health_above","sk_if_food_below","sk_if_level_above",
    "sk_if_holding","sk_if_has_item","sk_if_wearing","sk_if_block_is","sk_if_block_at_is",
    "sk_if_var_equals","sk_if_var_num_equals","sk_if_var_greater","sk_if_var_less","sk_if_var_set","sk_if_var_not_set",
    "sk_else","sk_else_if_perm",
    "sk_loop_players","sk_loop_times","sk_loop_list","sk_loop_entities","sk_while_var",
    "sk_async","sk_function_def",
  ]);

  const SCOPE_BACK = new Set(["sk_else","sk_else_if_perm"]);

  // ── Forward ────────────────────────────────────────────────────────────────
  function blockLine(b) {
    switch (b.type) {
      // Events
      case "sk_on_join":               return "on join:";
      case "sk_on_quit":               return "on quit:";
      case "sk_on_first_join":         return "on first join:";
      case "sk_on_chat":               return "on chat:";
      case "sk_on_death":              return "on death:";
      case "sk_on_respawn":            return "on respawn:";
      case "sk_on_damage":             return "on damage:";
      case "sk_on_heal":               return "on heal:";
      case "sk_on_level_change":       return "on level change:";
      case "sk_on_xp_change":          return "on experience change:";
      case "sk_on_food_change":        return "on food level change:";
      case "sk_on_sneak":              return "on toggle sneak:";
      case "sk_on_sprint":             return "on toggle sprint:";
      case "sk_on_toggle_flight":      return "on toggle flight:";
      case "sk_on_move":               return "on move:";
      case "sk_on_teleport":           return "on teleport:";
      case "sk_on_bed_enter":          return "on enter bed:";
      case "sk_on_bed_leave":          return "on leave bed:";
      case "sk_on_kick":               return "on kick:";
      case "sk_on_gamemode_change":    return "on gamemode change:";
      case "sk_on_armor_change":       return "on armor change:";
      case "sk_on_command":            return `on command "/${fv(b,"CMD")}":`;
      case "sk_command_block":         return `command /${fv(b,"CMD")}:`;
      case "sk_on_break":              return "on break:";
      case "sk_on_place":              return "on place:";
      case "sk_on_right_click":        return "on right click:";
      case "sk_on_left_click":         return "on left click:";
      case "sk_on_right_click_block":  return "on right click on block:";
      case "sk_on_sign_change":        return "on sign change:";
      case "sk_on_redstone":           return "on redstone change:";
      case "sk_on_item_drop":          return "on item drop:";
      case "sk_on_item_pickup":        return "on item pickup:";
      case "sk_on_item_damage":        return "on item damage:";
      case "sk_on_consume":            return "on consume:";
      case "sk_on_craft":              return "on crafting:";
      case "sk_on_enchant":            return "on enchant:";
      case "sk_on_arrow_pickup":       return "on player pick up arrow:";
      case "sk_on_item_cooldown":      return "on item cooldown change:";
      case "sk_on_inventory_open":     return "on inventory open:";
      case "sk_on_inventory_close":    return "on inventory close:";
      case "sk_on_inventory_click":    return "on inventory click:";
      case "sk_on_inventory_drag":     return "on inventory drag:";
      case "sk_on_inv_item_move":      return "on inventory item move:";
      case "sk_on_entity_spawn":       return "on entity spawn:";
      case "sk_on_entity_death":       return "on entity death:";
      case "sk_on_entity_damage":      return "on entity damage:";
      case "sk_on_projectile_hit":     return "on projectile hit:";
      case "sk_on_projectile_launch":  return "on projectile launch:";
      case "sk_on_entity_transform":   return "on entity transform:";
      case "sk_on_exp_spawn":          return "on experience spawn:";
      case "sk_on_server_start":       return "on load:";
      case "sk_on_server_stop":        return "on unload:";
      case "sk_on_weather_change":     return "on weather change:";
      case "sk_on_lightning":          return "on lightning:";
      case "sk_on_world_load":         return "on world load:";
      case "sk_on_world_unload":       return "on world unload:";
      case "sk_on_chunk_load":         return "on chunk load:";
      case "sk_on_portal_create":      return "on portal create:";
      case "sk_every_x_seconds":       return `every ${fv(b,"SEC")} seconds:`;
      case "sk_every_x_ticks":         return `every ${fv(b,"TICKS")} ticks:`;

      // Conditions
      case "sk_if_permission":         return `if player has permission "${fv(b,"PERM")}":`;
      case "sk_if_gamemode":           return `if player's gamemode is ${fv(b,"GM")}:`;
      case "sk_if_world":              return `if world's name is "${fv(b,"WORLD")}":`;
      case "sk_if_op":                 return `if player is an op:`;
      case "sk_if_sneaking":           return `if player is sneaking:`;
      case "sk_if_flying":             return `if player is flying:`;
      case "sk_if_sprinting":          return `if player is sprinting:`;
      case "sk_if_on_ground":          return `if player is on ground:`;
      case "sk_if_sleeping":           return `if player is sleeping:`;
      case "sk_if_in_vehicle":         return `if player is in a vehicle:`;
      case "sk_if_gliding":            return `if player is gliding:`;
      case "sk_if_swimming":           return `if player is swimming:`;
      case "sk_if_online":             return `if player "${fv(b,"PLAYER")}" is online:`;
      case "sk_if_health_below":       return `if player's health < ${fv(b,"HP")}:`;
      case "sk_if_health_above":       return `if player's health > ${fv(b,"HP")}:`;
      case "sk_if_food_below":         return `if player's food level < ${fv(b,"FOOD")}:`;
      case "sk_if_level_above":        return `if player's level > ${fv(b,"LVL")}:`;
      case "sk_if_holding":            return `if player is holding ${fv(b,"ITEM")}:`;
      case "sk_if_has_item":           return `if player has ${fv(b,"AMT")} ${fv(b,"ITEM")} in inventory:`;
      case "sk_if_wearing":            return `if player is wearing ${fv(b,"ITEM")}:`;
      case "sk_if_block_is":           return `if type of block below player is ${fv(b,"BLOCK")}:`;
      case "sk_if_block_at_is":        return `if type of block at location(${fv(b,"X")}, ${fv(b,"Y")}, ${fv(b,"Z")}, world of player) is ${fv(b,"BLOCK")}:`;
      case "sk_if_var_equals":         return `if {var::${fv(b,"KEY")}} is "${fv(b,"VAL")}":`;
      case "sk_if_var_num_equals":     return `if {var::${fv(b,"KEY")}} is ${fv(b,"VAL")}:`;
      case "sk_if_var_greater":        return `if {var::${fv(b,"KEY")}} > ${fv(b,"VAL")}:`;
      case "sk_if_var_less":           return `if {var::${fv(b,"KEY")}} < ${fv(b,"VAL")}:`;
      case "sk_if_var_set":            return `if {var::${fv(b,"KEY")}} is set:`;
      case "sk_if_var_not_set":        return `if {var::${fv(b,"KEY")}} is not set:`;
      case "sk_else":                  return `else:`;
      case "sk_else_if_perm":          return `else if player has permission "${fv(b,"PERM")}":`;

      // Messages
      case "sk_send_message":          return `send "${fv(b,"MSG")}" to player`;
      case "sk_send_title":            return `send title "${fv(b,"MSG")}" to player`;
      case "sk_send_subtitle":         return `send subtitle "${fv(b,"MSG")}" to player`;
      case "sk_send_actionbar":        return `send action bar "${fv(b,"MSG")}" to player`;
      case "sk_broadcast":             return `broadcast "${fv(b,"MSG")}"`;
      case "sk_broadcast_world":       return `broadcast "${fv(b,"MSG")}" to world "${fv(b,"WORLD")}"`;
      case "sk_send_to_player":        return `send "${fv(b,"MSG")}" to player "${fv(b,"PLAYER")}"`;
      case "sk_log_console":           return `log "${fv(b,"MSG")}"`;

      // Player
      case "sk_set_gamemode":          return `set player's gamemode to ${fv(b,"GM")}`;
      case "sk_set_health":            return `set player's health to ${fv(b,"HP")}`;
      case "sk_heal":                  return `heal player`;
      case "sk_set_food":              return `set player's food level to ${fv(b,"FOOD")}`;
      case "sk_set_max_health":        return `set player's max health to ${fv(b,"HP")}`;
      case "sk_add_xp":                return `give ${fv(b,"XP")} experience points to player`;
      case "sk_set_level":             return `set player's level to ${fv(b,"LVL")}`;
      case "sk_set_xp_progress":       return `set player's experience progress to ${fv(b,"PROG")}`;
      case "sk_set_fly":               return `set player's flight to ${fv(b,"FLY")}`;
      case "sk_set_walk_speed":        return `set player's walk speed to ${fv(b,"SPD")}`;
      case "sk_set_fly_speed":         return `set player's fly speed to ${fv(b,"SPD")}`;
      case "sk_allow_flight":          return `allow player to fly`;
      case "sk_disallow_flight":       return `disallow player from flying`;
      case "sk_teleport_spawn":        return `teleport player to spawn of world`;
      case "sk_teleport_bed":          return `teleport player to player's bed location`;
      case "sk_teleport_coords":       return `teleport player to location(${fv(b,"X")}, ${fv(b,"Y")}, ${fv(b,"Z")}, world "${fv(b,"WORLD")}")`;
      case "sk_give_item":             return `give player ${fv(b,"AMT")} ${fv(b,"ITEM")}`;
      case "sk_remove_item":           return `remove ${fv(b,"AMT")} ${fv(b,"ITEM")} from player's inventory`;
      case "sk_clear_inventory":       return `clear player's inventory`;
      case "sk_drop_item":             return `drop ${fv(b,"AMT")} ${fv(b,"ITEM")} at player's location`;
      case "sk_enchant_held":          return `enchant player's tool with ${fv(b,"ENC")} ${fv(b,"LVL")}`;
      case "sk_kick":                  return `kick player due to "${fv(b,"REASON")}"`;
      case "sk_ban":                   return `ban player due to "${fv(b,"REASON")}"`;
      case "sk_ip_ban":                return `ip-ban player`;
      case "sk_op":                    return `op player`;
      case "sk_deop":                  return `deop player`;
      case "sk_set_display_name":      return `set player's display name to "${fv(b,"NAME")}"`;
      case "sk_set_tab_name":          return `set player's tab list name to "${fv(b,"NAME")}"`;

      // World effects
      case "sk_spawn_particle":        return `spawn ${fv(b,"COUNT")} ${fv(b,"PART")} particles at player`;
      case "sk_play_sound":            return `play sound "${fv(b,"SND")}" to player at volume ${fv(b,"VOL")} with pitch ${fv(b,"PITCH")}`;
      case "sk_apply_effect":          return `apply ${fv(b,"EFF")} ${fv(b,"TIER")} to player for ${fv(b,"DUR")} seconds`;
      case "sk_remove_effect":         return `remove ${fv(b,"EFF")} from player`;
      case "sk_clear_effects":         return `clear all potion effects from player`;
      case "sk_set_block":             return `set block at player's location to ${fv(b,"BLOCK")}`;
      case "sk_set_block_coords":      return `set block at location(${fv(b,"X")}, ${fv(b,"Y")}, ${fv(b,"Z")}, world of player) to ${fv(b,"BLOCK")}`;
      case "sk_explosion":             return `create an explosion with force ${fv(b,"PWR")} at player's location`;
      case "sk_lightning":             return `spawn lightning at player's location`;
      case "sk_lightning_safe":        return `strike lightning effect at player's location`;
      case "sk_spawn_mob":             return `spawn ${fv(b,"MOB")} at player's location`;
      case "sk_spawn_mob_name":        return `spawn ${fv(b,"MOB")} named "${fv(b,"NAME")}" at player's location`;
      case "sk_kill_nearby":           return `loop all entities in radius ${fv(b,"RAD")} of player:\n    if loop-entity is not a player:\n        kill loop-entity`;
      case "sk_set_weather":           return `set weather in world to ${fv(b,"WX")}`;
      case "sk_set_time":              return `set time in world to ${fv(b,"TIME")}`;
      case "sk_drop_block_loot":       return `drop loot of block at player's location naturally`;
      case "sk_push_entity":           return `push player using vector(${fv(b,"X")}, ${fv(b,"Y")}, ${fv(b,"Z")})`;
      case "sk_run_command":           return `make player execute command "${fv(b,"CMD")}"`;
      case "sk_run_console":           return `execute console command "${fv(b,"CMD")}"`;
      case "sk_wait":                  return `wait ${fv(b,"SEC")} seconds`;
      case "sk_wait_ticks":            return `wait ${fv(b,"TICKS")} ticks`;
      case "sk_cancel_event":          return `cancel event`;
      case "sk_stop":                  return `stop`;

      // Variables
      case "sk_set_var_str":           return `set {var::${fv(b,"KEY")}} to "${fv(b,"VAL")}"`;
      case "sk_set_var_num":           return `set {var::${fv(b,"KEY")}} to ${fv(b,"VAL")}`;
      case "sk_set_player_var":        return `set {pvar::${fv(b,"KEY")}::%player%} to "${fv(b,"VAL")}"`;
      case "sk_set_global_var":        return `set {global::${fv(b,"KEY")}} to ${fv(b,"VAL")}`;
      case "sk_delete_var":            return `delete {var::${fv(b,"KEY")}}`;
      case "sk_add_var":               return `add ${fv(b,"AMT")} to {var::${fv(b,"KEY")}}`;
      case "sk_subtract_var":          return `remove ${fv(b,"AMT")} from {var::${fv(b,"KEY")}}`;
      case "sk_multiply_var":          return `set {var::${fv(b,"KEY")}} to {var::${fv(b,"KEY")}} * ${fv(b,"AMT")}`;
      case "sk_divide_var":            return `set {var::${fv(b,"KEY")}} to {var::${fv(b,"KEY")}} / ${fv(b,"AMT")}`;
      case "sk_add_list":              return `add "${fv(b,"VAL")}" to {list::${fv(b,"KEY")}::*}`;
      case "sk_remove_list":           return `remove "${fv(b,"VAL")}" from {list::${fv(b,"KEY")}::*}`;
      case "sk_clear_list":            return `clear {list::${fv(b,"KEY")}::*}`;

      // Control
      case "sk_loop_players":          return `loop all players:`;
      case "sk_loop_times":            return `loop ${fv(b,"N")} times:`;
      case "sk_loop_list":             return `loop {list::${fv(b,"KEY")}::*}:`;
      case "sk_loop_entities":         return `loop all ${fv(b,"MOB")} in radius ${fv(b,"RAD")} around player:`;
      case "sk_while_var":             return `while {var::${fv(b,"KEY")}} < ${fv(b,"MAX")}:`;
      case "sk_exit_loop":             return `exit loop`;
      case "sk_exit_loops":            return `exit ${fv(b,"N")} loops`;
      case "sk_continue":              return `continue`;
      case "sk_async":                 return `async:`;

      // Functions
      case "sk_function_def":          return `function ${fv(b,"NAME")}(${fv(b,"PARAMS")}):`;
      case "sk_function_call":         return `${fv(b,"NAME")}(${fv(b,"ARGS")})`;
      case "sk_function_return":       return `return ${fv(b,"VAL")}`;

      // Comment
      case "sk_comment":               return `# ${fv(b,"TEXT")}`;

      default: return `# [unknown block: ${b.type}]`;
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
        const rawLine = blockLine(cur);
        // Multi-line emits (kill nearby, etc.)
        rawLine.split("\n").forEach((subLine, si) => {
          out.push({ d: depth + si, t: subLine });
        });
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
      if (!t)                                          cls = "sk-blank";
      else if (t.startsWith("#"))                      cls = "sk-comment";
      else if (/^(on |every |command )/.test(t))       cls = "sk-event";
      else if (/^\s*(if |else)/.test(line))            cls = "sk-cond";
      else if (/^\s*(loop |while |async:)/.test(line)) cls = "sk-loop";
      else if (/^\s*function /.test(line))             cls = "sk-func";
      else if (/^\s*(set \{|add .+ to \{|remove .+ from \{|delete \{|clear \{)/.test(line)) cls = "sk-var";
      else if (/^\s*(send |broadcast |log )/.test(line)) cls = "sk-msg";
      else if (/^\s*(spawn |play |apply |create |set block|set weather|set time|execute console|make player execute|strike|push|drop loot|enchant)/.test(line)) cls = "sk-eff";
      else                                             cls = "sk-act";
      return `<span class="ln">${esc(n)}</span><span class="${cls}">${esc(line)}</span>`;
    }).join("\n");
  }

  // ── Reverse compiler ───────────────────────────────────────────────────────
  function xa(v) { return String(v).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"); }
  function fxml(name, val) { return `<field name="${name}">${xa(val)}</field>`; }

  function parseLine(raw) {
    const line = raw.trim();
    if (!line) return null;

    // Comment lines
    if (line.startsWith("#")) {
      const text = line.replace(/^#+\s*/, "");
      return { type:"sk_comment", f:{ TEXT: text } };
    }

    let m;

    // Events
    if (line === "on join:")                  return { type:"sk_on_join" };
    if (line === "on quit:")                  return { type:"sk_on_quit" };
    if (line === "on first join:")            return { type:"sk_on_first_join" };
    if (line === "on chat:")                  return { type:"sk_on_chat" };
    if (line === "on death:")                 return { type:"sk_on_death" };
    if (line === "on respawn:")               return { type:"sk_on_respawn" };
    if (line === "on damage:")                return { type:"sk_on_damage" };
    if (line === "on heal:")                  return { type:"sk_on_heal" };
    if (line === "on level change:")          return { type:"sk_on_level_change" };
    if (line === "on experience change:")     return { type:"sk_on_xp_change" };
    if (line === "on food level change:")     return { type:"sk_on_food_change" };
    if (line === "on toggle sneak:")          return { type:"sk_on_sneak" };
    if (line === "on toggle sprint:")         return { type:"sk_on_sprint" };
    if (line === "on toggle flight:")         return { type:"sk_on_toggle_flight" };
    if (line === "on move:")                  return { type:"sk_on_move" };
    if (line === "on teleport:")              return { type:"sk_on_teleport" };
    if (line === "on enter bed:")             return { type:"sk_on_bed_enter" };
    if (line === "on leave bed:")             return { type:"sk_on_bed_leave" };
    if (line === "on kick:")                  return { type:"sk_on_kick" };
    if (line === "on gamemode change:")       return { type:"sk_on_gamemode_change" };
    if (line === "on armor change:")          return { type:"sk_on_armor_change" };
    if (line === "on break:")                 return { type:"sk_on_break" };
    if (line === "on place:")                 return { type:"sk_on_place" };
    if (line === "on right click:")           return { type:"sk_on_right_click" };
    if (line === "on left click:")            return { type:"sk_on_left_click" };
    if (line === "on right click on block:")  return { type:"sk_on_right_click_block" };
    if (line === "on sign change:")           return { type:"sk_on_sign_change" };
    if (line === "on redstone change:")       return { type:"sk_on_redstone" };
    if (line === "on item drop:")             return { type:"sk_on_item_drop" };
    if (line === "on item pickup:")           return { type:"sk_on_item_pickup" };
    if (line === "on item damage:")           return { type:"sk_on_item_damage" };
    if (line === "on consume:")               return { type:"sk_on_consume" };
    if (line === "on crafting:")              return { type:"sk_on_craft" };
    if (line === "on enchant:")               return { type:"sk_on_enchant" };
    if (line === "on player pick up arrow:")  return { type:"sk_on_arrow_pickup" };
    if (line === "on item cooldown change:")  return { type:"sk_on_item_cooldown" };
    if (line === "on inventory open:")        return { type:"sk_on_inventory_open" };
    if (line === "on inventory close:")       return { type:"sk_on_inventory_close" };
    if (line === "on inventory click:")       return { type:"sk_on_inventory_click" };
    if (line === "on inventory drag:")        return { type:"sk_on_inventory_drag" };
    if (line === "on inventory item move:")   return { type:"sk_on_inv_item_move" };
    if (line === "on entity spawn:")          return { type:"sk_on_entity_spawn" };
    if (line === "on entity death:")          return { type:"sk_on_entity_death" };
    if (line === "on entity damage:")         return { type:"sk_on_entity_damage" };
    if (line === "on projectile hit:")        return { type:"sk_on_projectile_hit" };
    if (line === "on projectile launch:")     return { type:"sk_on_projectile_launch" };
    if (line === "on entity transform:")      return { type:"sk_on_entity_transform" };
    if (line === "on experience spawn:")      return { type:"sk_on_exp_spawn" };
    if (line === "on load:")                  return { type:"sk_on_server_start" };
    if (line === "on unload:")                return { type:"sk_on_server_stop" };
    if (line === "on weather change:")        return { type:"sk_on_weather_change" };
    if (line === "on lightning:")             return { type:"sk_on_lightning" };
    if (line === "on world load:")            return { type:"sk_on_world_load" };
    if (line === "on world unload:")          return { type:"sk_on_world_unload" };
    if (line === "on chunk load:")            return { type:"sk_on_chunk_load" };
    if (line === "on portal create:")         return { type:"sk_on_portal_create" };

    m = line.match(/^on command "\/?(.*?)":$/);
    if (m) return { type:"sk_on_command", f:{ CMD:m[1] } };
    m = line.match(/^command \/(.+?):$/);
    if (m) return { type:"sk_command_block", f:{ CMD:m[1] } };
    m = line.match(/^every (\d+(?:\.\d+)?) seconds:$/);
    if (m) return { type:"sk_every_x_seconds", f:{ SEC:m[1] } };
    m = line.match(/^every (\d+) ticks:$/);
    if (m) return { type:"sk_every_x_ticks", f:{ TICKS:m[1] } };

    // Conditions
    m = line.match(/^if player has permission "(.+?)":$/);
    if (m) return { type:"sk_if_permission", f:{ PERM:m[1] } };
    m = line.match(/^if player's gamemode is (\w+):$/);
    if (m) return { type:"sk_if_gamemode", f:{ GM:m[1] } };
    m = line.match(/^if world's name is "(.+?)":$/);
    if (m) return { type:"sk_if_world", f:{ WORLD:m[1] } };
    if (line === "if player is an op:")     return { type:"sk_if_op" };
    if (line === "if player is sneaking:")  return { type:"sk_if_sneaking" };
    if (line === "if player is flying:")    return { type:"sk_if_flying" };
    if (line === "if player is sprinting:") return { type:"sk_if_sprinting" };
    if (line === "if player is on ground:") return { type:"sk_if_on_ground" };
    if (line === "if player is sleeping:")  return { type:"sk_if_sleeping" };
    if (line === "if player is in a vehicle:") return { type:"sk_if_in_vehicle" };
    if (line === "if player is gliding:")   return { type:"sk_if_gliding" };
    if (line === "if player is swimming:")  return { type:"sk_if_swimming" };
    m = line.match(/^if player "(.+?)" is online:$/);
    if (m) return { type:"sk_if_online", f:{ PLAYER:m[1] } };
    m = line.match(/^if player's health < ([\d.]+):$/);
    if (m) return { type:"sk_if_health_below", f:{ HP:m[1] } };
    m = line.match(/^if player's health > ([\d.]+):$/);
    if (m) return { type:"sk_if_health_above", f:{ HP:m[1] } };
    m = line.match(/^if player's food level < ([\d.]+):$/);
    if (m) return { type:"sk_if_food_below", f:{ FOOD:m[1] } };
    m = line.match(/^if player's level > ([\d.]+):$/);
    if (m) return { type:"sk_if_level_above", f:{ LVL:m[1] } };
    m = line.match(/^if player is holding (.+?):$/);
    if (m) return { type:"sk_if_holding", f:{ ITEM:m[1] } };
    m = line.match(/^if player has (\d+) (.+?) in inventory:$/);
    if (m) return { type:"sk_if_has_item", f:{ AMT:m[1], ITEM:m[2] } };
    m = line.match(/^if player is wearing (.+?):$/);
    if (m) return { type:"sk_if_wearing", f:{ ITEM:m[1] } };
    m = line.match(/^if type of block below player is (.+?):$/);
    if (m) return { type:"sk_if_block_is", f:{ BLOCK:m[1] } };
    m = line.match(/^if \{var::(.+?)\} is "(.+?)":$/);
    if (m) return { type:"sk_if_var_equals", f:{ KEY:m[1], VAL:m[2] } };
    m = line.match(/^if \{var::(.+?)\} is ([\d.]+):$/);
    if (m) return { type:"sk_if_var_num_equals", f:{ KEY:m[1], VAL:m[2] } };
    m = line.match(/^if \{var::(.+?)\} > ([\d.]+):$/);
    if (m) return { type:"sk_if_var_greater", f:{ KEY:m[1], VAL:m[2] } };
    m = line.match(/^if \{var::(.+?)\} < ([\d.]+):$/);
    if (m) return { type:"sk_if_var_less", f:{ KEY:m[1], VAL:m[2] } };
    m = line.match(/^if \{var::(.+?)\} is set:$/);
    if (m) return { type:"sk_if_var_set", f:{ KEY:m[1] } };
    m = line.match(/^if \{var::(.+?)\} is not set:$/);
    if (m) return { type:"sk_if_var_not_set", f:{ KEY:m[1] } };
    if (line === "else:") return { type:"sk_else" };
    m = line.match(/^else if player has permission "(.+?)":$/);
    if (m) return { type:"sk_else_if_perm", f:{ PERM:m[1] } };

    // Messages
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
    m = line.match(/^broadcast "(.+?)" to world "(.+?)"$/);
    if (m) return { type:"sk_broadcast_world", f:{ MSG:m[1], WORLD:m[2] } };
    m = line.match(/^send "(.+?)" to player "(.+?)"$/);
    if (m) return { type:"sk_send_to_player", f:{ MSG:m[1], PLAYER:m[2] } };
    m = line.match(/^log "(.+?)"$/);
    if (m) return { type:"sk_log_console", f:{ MSG:m[1] } };

    // Player actions
    m = line.match(/^set player's gamemode to (\w+)$/);
    if (m) return { type:"sk_set_gamemode", f:{ GM:m[1] } };
    m = line.match(/^set player's health to ([\d.]+)$/);
    if (m) return { type:"sk_set_health", f:{ HP:m[1] } };
    if (line === "heal player") return { type:"sk_heal" };
    m = line.match(/^set player's food level to ([\d.]+)$/);
    if (m) return { type:"sk_set_food", f:{ FOOD:m[1] } };
    m = line.match(/^set player's max health to ([\d.]+)$/);
    if (m) return { type:"sk_set_max_health", f:{ HP:m[1] } };
    m = line.match(/^give ([\d.]+) experience points to player$/);
    if (m) return { type:"sk_add_xp", f:{ XP:m[1] } };
    m = line.match(/^set player's level to (\d+)$/);
    if (m) return { type:"sk_set_level", f:{ LVL:m[1] } };
    m = line.match(/^set player's experience progress to ([\d.]+)$/);
    if (m) return { type:"sk_set_xp_progress", f:{ PROG:m[1] } };
    m = line.match(/^set player's flight to (enabled|disabled)$/);
    if (m) return { type:"sk_set_fly", f:{ FLY:m[1] } };
    m = line.match(/^set player's walk speed to ([\d.]+)$/);
    if (m) return { type:"sk_set_walk_speed", f:{ SPD:m[1] } };
    m = line.match(/^set player's fly speed to ([\d.]+)$/);
    if (m) return { type:"sk_set_fly_speed", f:{ SPD:m[1] } };
    if (line === "allow player to fly") return { type:"sk_allow_flight" };
    if (line === "disallow player from flying") return { type:"sk_disallow_flight" };
    if (line === "teleport player to spawn of world") return { type:"sk_teleport_spawn" };
    if (line === "teleport player to player's bed location") return { type:"sk_teleport_bed" };
    m = line.match(/^teleport player to location\(([-\d.]+),\s*([-\d.]+),\s*([-\d.]+),\s*world "(.+?)"\)$/);
    if (m) return { type:"sk_teleport_coords", f:{ X:m[1],Y:m[2],Z:m[3],WORLD:m[4] } };
    m = line.match(/^give player (\d+) (.+)$/);
    if (m) return { type:"sk_give_item", f:{ AMT:m[1], ITEM:m[2] } };
    m = line.match(/^remove (\d+) (.+?) from player's inventory$/);
    if (m) return { type:"sk_remove_item", f:{ AMT:m[1], ITEM:m[2] } };
    if (line === "clear player's inventory") return { type:"sk_clear_inventory" };
    m = line.match(/^drop (\d+) (.+?) at player's location$/);
    if (m) return { type:"sk_drop_item", f:{ AMT:m[1], ITEM:m[2] } };
    m = line.match(/^enchant player's tool with (.+?) (\d+)$/);
    if (m) return { type:"sk_enchant_held", f:{ ENC:m[1], LVL:m[2] } };
    m = line.match(/^kick player due to "(.+?)"$/);
    if (m) return { type:"sk_kick", f:{ REASON:m[1] } };
    m = line.match(/^ban player due to "(.+?)"$/);
    if (m) return { type:"sk_ban", f:{ REASON:m[1] } };
    if (line === "ip-ban player") return { type:"sk_ip_ban" };
    if (line === "op player")     return { type:"sk_op" };
    if (line === "deop player")   return { type:"sk_deop" };
    m = line.match(/^set player's display name to "(.+?)"$/);
    if (m) return { type:"sk_set_display_name", f:{ NAME:m[1] } };
    m = line.match(/^set player's tab list name to "(.+?)"$/);
    if (m) return { type:"sk_set_tab_name", f:{ NAME:m[1] } };

    // World effects
    m = line.match(/^spawn (\d+) (.+?) particles at player$/);
    if (m) return { type:"sk_spawn_particle", f:{ COUNT:m[1], PART:m[2] } };
    m = line.match(/^play sound "(.+?)" to player at volume ([\d.]+) with pitch ([\d.]+)$/);
    if (m) return { type:"sk_play_sound", f:{ SND:m[1], VOL:m[2], PITCH:m[3] } };
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
    if (line === "strike lightning effect at player's location") return { type:"sk_lightning_safe" };
    m = line.match(/^spawn (.+?) named "(.+?)" at player's location$/);
    if (m) return { type:"sk_spawn_mob_name", f:{ MOB:m[1], NAME:m[2] } };
    m = line.match(/^spawn (.+?) at player's location$/);
    if (m) return { type:"sk_spawn_mob", f:{ MOB:m[1] } };
    m = line.match(/^set weather in world to (.+)$/);
    if (m) return { type:"sk_set_weather", f:{ WX:m[1] } };
    m = line.match(/^set time in world to (.+)$/);
    if (m) return { type:"sk_set_time", f:{ TIME:m[1] } };
    if (line === "drop loot of block at player's location naturally") return { type:"sk_drop_block_loot" };
    m = line.match(/^push player using vector\(([-\d.]+),\s*([-\d.]+),\s*([-\d.]+)\)$/);
    if (m) return { type:"sk_push_entity", f:{ X:m[1], Y:m[2], Z:m[3] } };
    m = line.match(/^make player execute command "(.+?)"$/);
    if (m) return { type:"sk_run_command", f:{ CMD:m[1] } };
    m = line.match(/^execute console command "(.+?)"$/);
    if (m) return { type:"sk_run_console", f:{ CMD:m[1] } };
    m = line.match(/^wait ([\d.]+) seconds$/);
    if (m) return { type:"sk_wait", f:{ SEC:m[1] } };
    m = line.match(/^wait (\d+) ticks$/);
    if (m) return { type:"sk_wait_ticks", f:{ TICKS:m[1] } };
    if (line === "cancel event") return { type:"sk_cancel_event" };
    if (line === "stop")         return { type:"sk_stop" };

    // Variables
    m = line.match(/^set \{var::(.+?)\} to "(.+?)"$/);
    if (m) return { type:"sk_set_var_str", f:{ KEY:m[1], VAL:m[2] } };
    m = line.match(/^set \{var::(.+?)\} to ([\d.]+)$/);
    if (m) return { type:"sk_set_var_num", f:{ KEY:m[1], VAL:m[2] } };
    m = line.match(/^set \{pvar::(.+?)::%player%\} to "(.+?)"$/);
    if (m) return { type:"sk_set_player_var", f:{ KEY:m[1], VAL:m[2] } };
    m = line.match(/^set \{global::(.+?)\} to ([\d.]+)$/);
    if (m) return { type:"sk_set_global_var", f:{ KEY:m[1], VAL:m[2] } };
    m = line.match(/^delete \{var::(.+?)\}$/);
    if (m) return { type:"sk_delete_var", f:{ KEY:m[1] } };
    m = line.match(/^add ([\d.]+) to \{var::(.+?)\}$/);
    if (m) return { type:"sk_add_var", f:{ AMT:m[1], KEY:m[2] } };
    m = line.match(/^remove ([\d.]+) from \{var::(.+?)\}$/);
    if (m) return { type:"sk_subtract_var", f:{ AMT:m[1], KEY:m[2] } };
    m = line.match(/^set \{var::(.+?)\} to \{var::\1\} \* ([\d.]+)$/);
    if (m) return { type:"sk_multiply_var", f:{ KEY:m[1], AMT:m[2] } };
    m = line.match(/^set \{var::(.+?)\} to \{var::\1\} \/ ([\d.]+)$/);
    if (m) return { type:"sk_divide_var", f:{ KEY:m[1], AMT:m[2] } };
    m = line.match(/^add "(.+?)" to \{list::(.+?)::\*\}$/);
    if (m) return { type:"sk_add_list", f:{ VAL:m[1], KEY:m[2] } };
    m = line.match(/^remove "(.+?)" from \{list::(.+?)::\*\}$/);
    if (m) return { type:"sk_remove_list", f:{ VAL:m[1], KEY:m[2] } };
    m = line.match(/^clear \{list::(.+?)::\*\}$/);
    if (m) return { type:"sk_clear_list", f:{ KEY:m[1] } };

    // Control
    if (line === "loop all players:") return { type:"sk_loop_players" };
    m = line.match(/^loop (\d+) times:$/);
    if (m) return { type:"sk_loop_times", f:{ N:m[1] } };
    m = line.match(/^loop \{list::(.+?)::\*\}:$/);
    if (m) return { type:"sk_loop_list", f:{ KEY:m[1] } };
    m = line.match(/^loop all (.+?) in radius (\d+) around player:$/);
    if (m) return { type:"sk_loop_entities", f:{ MOB:m[1], RAD:m[2] } };
    m = line.match(/^while \{var::(.+?)\} < ([\d.]+):$/);
    if (m) return { type:"sk_while_var", f:{ KEY:m[1], MAX:m[2] } };
    if (line === "exit loop") return { type:"sk_exit_loop" };
    m = line.match(/^exit (\d+) loops$/);
    if (m) return { type:"sk_exit_loops", f:{ N:m[1] } };
    if (line === "continue") return { type:"sk_continue" };
    if (line === "async:")   return { type:"sk_async" };

    // Functions
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
    const item = items[0], rest = items.slice(1);
    const fields = Object.entries(item.f || {}).map(([k,v]) => fxml(k,v)).join("");
    if (!rest.length) return fields;
    return `${fields}<next><block type="${xa(rest[0].type)}">${buildChain(rest)}</block></next>`;
  }

  function reverseCompile(text) {
    const lines = text.split("\n");
    const unknown = [];
    const parsed = [];

    lines.forEach((raw, idx) => {
      if (!raw.trim()) return;
      const indent = raw.search(/\S/);
      const result = parseLine(raw);
      if (!result) return;
      if (result.type === null) { unknown.push({ lineNum:idx+1, raw:raw.trim() }); return; }
      parsed.push({ indent, result });
    });

    if (!parsed.length) return { xml:null, unknown };

    const groups = [];
    let cur = null;
    parsed.forEach(({ indent, result }) => {
      if (indent === 0) { cur = [result]; groups.push(cur); }
      else if (cur) cur.push(result);
    });

    let x = 40, y = 40;
    const parts = groups.map(g => {
      if (!g.length) return "";
      const xml = `<block type="${xa(g[0].type)}" x="${x}" y="${y}">${buildChain(g)}</block>`;
      y += 240; if (y > 2000) { y = 40; x += 560; }
      return xml;
    });

    return {
      xml: `<xml xmlns="https://developers.google.com/blockly/xml">${parts.join("")}</xml>`,
      unknown,
    };
  }

  return { generate, highlight, reverseCompile };
})();