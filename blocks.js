// SkriptForge — Block Definitions
(function () {
  "use strict";

  function def(type, cfg) {
    Blockly.Blocks[type] = { init: function () { this.jsonInit(cfg); } };
  }

  const N = null;

  window.SF_PALETTES = {
    GAMEMODES: [["survival","survival"],["creative","creative"],["adventure","adventure"],["spectator","spectator"]],
    WEATHERS:  [["clear","clear"],["rain","rain"],["thunder","thunder"]],
    TIMES:     [["dawn (0)","0"],["noon (6000)","6000"],["sunset (12000)","12000"],["midnight (18000)","18000"]],
    FLY:       [["enabled","enabled"],["disabled","disabled"]],
    ITEMS: [
      ["diamond","diamond"],["diamond sword","diamond sword"],["diamond pickaxe","diamond pickaxe"],
      ["diamond axe","diamond axe"],["diamond helmet","diamond helmet"],["diamond chestplate","diamond chestplate"],
      ["diamond leggings","diamond leggings"],["diamond boots","diamond boots"],
      ["netherite sword","netherite sword"],["netherite ingot","netherite ingot"],
      ["iron ingot","iron ingot"],["iron sword","iron sword"],["iron pickaxe","iron pickaxe"],
      ["gold ingot","gold ingot"],["golden apple","golden apple"],["enchanted golden apple","enchanted golden apple"],
      ["emerald","emerald"],["coal","coal"],["obsidian","obsidian"],["tnt","tnt"],
      ["bow","bow"],["arrow","arrow"],["crossbow","crossbow"],["trident","trident"],
      ["shield","shield"],["elytra","elytra"],["torch","torch"],["chest","chest"],
      ["book","book"],["enchanted book","enchanted book"],["name tag","name tag"],
      ["saddle","saddle"],["ender pearl","ender pearl"],["blaze rod","blaze rod"],
      ["nether star","nether star"],["totem of undying","totem of undying"],
    ],
    MOBS: [
      ["zombie","zombie"],["skeleton","skeleton"],["creeper","creeper"],["spider","spider"],
      ["enderman","enderman"],["witch","witch"],["blaze","blaze"],["ghast","ghast"],
      ["slime","slime"],["warden","warden"],["phantom","phantom"],["drowned","drowned"],
      ["pillager","pillager"],["ravager","ravager"],["elder guardian","elder guardian"],
      ["cow","cow"],["pig","pig"],["sheep","sheep"],["chicken","chicken"],
      ["horse","horse"],["wolf","wolf"],["cat","cat"],["villager","villager"],
      ["iron golem","iron golem"],["bee","bee"],["axolotl","axolotl"],
    ],
    SOUNDS: [
      ["level up","entity.player.levelup"],["xp orb","entity.experience_orb.pickup"],
      ["explosion","entity.generic.explode"],["wither spawn","entity.wither.spawn"],
      ["bell","block.bell.use"],["chest open","block.chest.open"],["chest close","block.chest.close"],
      ["anvil","block.anvil.use"],["fire","block.fire.ambient"],
      ["thunder","entity.lightning_bolt.thunder"],["arrow hit","entity.arrow.hit"],
      ["sword sweep","entity.player.attack.sweep"],["enderman scream","entity.enderman.scream"],
      ["creeper hiss","entity.creeper.primed"],
    ],
    PARTICLES: [
      ["heart","heart"],["flame","flame"],["smoke","smoke"],["portal","portal"],
      ["enchant","enchant"],["cloud","cloud"],["explosion","explosion"],["crit","crit"],
      ["water","water"],["lava","lava"],["happy villager","happy villager"],
      ["angry villager","angry villager"],["dragon breath","dragon breath"],["end rod","end rod"],
    ],
    POTIONS: [
      ["speed","speed"],["slowness","slowness"],["haste","haste"],["strength","strength"],
      ["weakness","weakness"],["jump boost","jump boost"],["regeneration","regeneration"],
      ["resistance","resistance"],["fire resistance","fire resistance"],
      ["water breathing","water breathing"],["invisibility","invisibility"],
      ["blindness","blindness"],["night vision","night vision"],["poison","poison"],
      ["wither","wither"],["absorption","absorption"],["levitation","levitation"],
      ["slow falling","slow falling"],["darkness","darkness"],
    ],
    BLOCKS: [
      ["air","air"],["stone","stone"],["grass block","grass block"],["dirt","dirt"],
      ["cobblestone","cobblestone"],["oak log","oak log"],["oak planks","oak planks"],
      ["sand","sand"],["gravel","gravel"],["gold ore","gold ore"],["iron ore","iron ore"],
      ["diamond ore","diamond ore"],["ancient debris","ancient debris"],["obsidian","obsidian"],
      ["bedrock","bedrock"],["tnt","tnt"],["chest","chest"],["furnace","furnace"],
      ["crafting table","crafting table"],["glowstone","glowstone"],["sea lantern","sea lantern"],
      ["netherrack","netherrack"],["soul sand","soul sand"],["end stone","end stone"],
      ["glass","glass"],["redstone block","redstone block"],
    ],
  };

  const { GAMEMODES, WEATHERS, TIMES, FLY, ITEMS, MOBS, SOUNDS, PARTICLES, POTIONS, BLOCKS } = window.SF_PALETTES;

  // EVENTS
  const E = "#c47a00";
  def("sk_on_join",             { message0:"⚡ on join",              colour:E, nextStatement:N });
  def("sk_on_quit",             { message0:"⚡ on quit",              colour:E, nextStatement:N });
  def("sk_on_chat",             { message0:"⚡ on chat",              colour:E, nextStatement:N });
  def("sk_on_death",            { message0:"⚡ on death",             colour:E, nextStatement:N });
  def("sk_on_respawn",          { message0:"⚡ on respawn",           colour:E, nextStatement:N });
  def("sk_on_damage",           { message0:"⚡ on damage",            colour:E, nextStatement:N });
  def("sk_on_heal",             { message0:"⚡ on heal",              colour:E, nextStatement:N });
  def("sk_on_break",            { message0:"⛏ on break block",       colour:E, nextStatement:N });
  def("sk_on_place",            { message0:"⛏ on place block",       colour:E, nextStatement:N });
  def("sk_on_right_click",      { message0:"🖱 on right click",       colour:E, nextStatement:N });
  def("sk_on_left_click",       { message0:"🖱 on left click",        colour:E, nextStatement:N });
  def("sk_on_item_drop",        { message0:"📦 on item drop",         colour:E, nextStatement:N });
  def("sk_on_item_pickup",      { message0:"📦 on item pickup",       colour:E, nextStatement:N });
  def("sk_on_consume",          { message0:"🍖 on consume",           colour:E, nextStatement:N });
  def("sk_on_craft",            { message0:"🔨 on crafting",          colour:E, nextStatement:N });
  def("sk_on_inventory_click",  { message0:"📋 on inventory click",   colour:E, nextStatement:N });
  def("sk_on_entity_spawn",     { message0:"👾 on entity spawn",      colour:E, nextStatement:N });
  def("sk_on_entity_death",     { message0:"👾 on entity death",      colour:E, nextStatement:N });
  def("sk_on_projectile_hit",   { message0:"🏹 on projectile hit",    colour:E, nextStatement:N });
  def("sk_on_server_start",     { message0:"🖥 on server start",      colour:E, nextStatement:N });
  def("sk_on_server_stop",      { message0:"🖥 on server stop",       colour:E, nextStatement:N });
  def("sk_on_move",             { message0:"⚠ on move (lag risk)",    colour:E, nextStatement:N });
  def("sk_on_sneak",            { message0:"🦆 on toggle sneak",      colour:E, nextStatement:N });
  def("sk_on_sprint",           { message0:"💨 on toggle sprint",     colour:E, nextStatement:N });
  def("sk_on_command", {
    message0:"⚡ on /%1 command", colour:E,
    args0:[{type:"field_input",name:"CMD",text:"mycommand"}], nextStatement:N,
  });
  def("sk_every_x_seconds", {
    message0:"🕐 every %1 seconds", colour:E,
    args0:[{type:"field_number",name:"SEC",value:60,min:1}], nextStatement:N,
  });

  // CONDITIONS
  const C = "#1a6aab";
  def("sk_if_permission", {
    message0:"🔑 if has permission %1", colour:C,
    args0:[{type:"field_input",name:"PERM",text:"myplugin.use"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_gamemode", {
    message0:"🎮 if gamemode is %1", colour:C,
    args0:[{type:"field_dropdown",name:"GM",options:GAMEMODES}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_world", {
    message0:"🌍 if world is %1", colour:C,
    args0:[{type:"field_input",name:"WORLD",text:"world"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_health_below", {
    message0:"❤ if health < %1", colour:C,
    args0:[{type:"field_number",name:"HP",value:5,min:0,max:20}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_health_above", {
    message0:"❤ if health > %1", colour:C,
    args0:[{type:"field_number",name:"HP",value:10,min:0,max:20}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_food_below", {
    message0:"🍗 if food < %1", colour:C,
    args0:[{type:"field_number",name:"FOOD",value:5,min:0,max:20}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_online", {
    message0:"👤 if player %1 online", colour:C,
    args0:[{type:"field_input",name:"PLAYER",text:"Notch"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_op",        { message0:"👑 if player is op",        colour:C, previousStatement:N, nextStatement:N });
  def("sk_if_sneaking",  { message0:"🦆 if player is sneaking",  colour:C, previousStatement:N, nextStatement:N });
  def("sk_if_flying",    { message0:"🕊 if player is flying",    colour:C, previousStatement:N, nextStatement:N });
  def("sk_if_sprinting", { message0:"💨 if player is sprinting", colour:C, previousStatement:N, nextStatement:N });
  def("sk_if_on_ground", { message0:"🟫 if player on ground",    colour:C, previousStatement:N, nextStatement:N });
  def("sk_if_holding", {
    message0:"🤚 if holding %1", colour:C,
    args0:[{type:"field_dropdown",name:"ITEM",options:ITEMS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_has_item", {
    message0:"📦 if has %1 %2", colour:C,
    args0:[{type:"field_number",name:"AMT",value:1,min:1},{type:"field_dropdown",name:"ITEM",options:ITEMS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_block_is", {
    message0:"🟫 if block below is %1", colour:C,
    args0:[{type:"field_dropdown",name:"BLOCK",options:BLOCKS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_var_equals", {
    message0:"📊 if {%1} = %2", colour:C,
    args0:[{type:"field_input",name:"KEY",text:"myvar"},{type:"field_input",name:"VAL",text:"value"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_var_greater", {
    message0:"📊 if {%1} > %2", colour:C,
    args0:[{type:"field_input",name:"KEY",text:"counter"},{type:"field_number",name:"VAL",value:0}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_var_less", {
    message0:"📊 if {%1} < %2", colour:C,
    args0:[{type:"field_input",name:"KEY",text:"counter"},{type:"field_number",name:"VAL",value:10}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_var_set", {
    message0:"📊 if {%1} is set", colour:C,
    args0:[{type:"field_input",name:"KEY",text:"myvar"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_else",         { message0:"↩ else",                    colour:C, previousStatement:N, nextStatement:N });
  def("sk_else_if_perm", {
    message0:"↩ else if permission %1", colour:C,
    args0:[{type:"field_input",name:"PERM",text:"myplugin.admin"}],
    previousStatement:N, nextStatement:N,
  });

  // MESSAGES
  const M = "#1a7a6e";
  def("sk_send_message", {
    message0:"💬 send %1", colour:M,
    args0:[{type:"field_input",name:"MSG",text:"&aHello %player%!"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_send_title", {
    message0:"📺 title %1", colour:M,
    args0:[{type:"field_input",name:"MSG",text:"&6Welcome!"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_send_subtitle", {
    message0:"📺 subtitle %1", colour:M,
    args0:[{type:"field_input",name:"MSG",text:"&7Enjoy your stay"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_send_actionbar", {
    message0:"📌 actionbar %1", colour:M,
    args0:[{type:"field_input",name:"MSG",text:"&c❤ Low Health!"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_broadcast", {
    message0:"📢 broadcast %1", colour:M,
    args0:[{type:"field_input",name:"MSG",text:"&a[Server] Announcement!"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_log_console", {
    message0:"🖥 log %1", colour:M,
    args0:[{type:"field_input",name:"MSG",text:"event fired"}],
    previousStatement:N, nextStatement:N,
  });

  // PLAYER ACTIONS
  const A = "#3a7a2a";
  def("sk_set_gamemode", {
    message0:"🎮 gamemode → %1", colour:A,
    args0:[{type:"field_dropdown",name:"GM",options:GAMEMODES}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_health", {
    message0:"❤ set health %1", colour:A,
    args0:[{type:"field_number",name:"HP",value:20,min:0,max:20}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_heal",         { message0:"❤ heal player",         colour:A, previousStatement:N, nextStatement:N });
  def("sk_set_food", {
    message0:"🍗 set food %1", colour:A,
    args0:[{type:"field_number",name:"FOOD",value:20,min:0,max:20}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_add_xp", {
    message0:"✨ give %1 xp", colour:A,
    args0:[{type:"field_number",name:"XP",value:100,min:0}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_level", {
    message0:"✨ set level %1", colour:A,
    args0:[{type:"field_number",name:"LVL",value:0,min:0}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_fly", {
    message0:"🕊 flight %1", colour:A,
    args0:[{type:"field_dropdown",name:"FLY",options:FLY}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_teleport_spawn",  { message0:"🧭 tp to world spawn", colour:A, previousStatement:N, nextStatement:N });
  def("sk_teleport_coords", {
    message0:"🧭 tp x:%1 y:%2 z:%3 w:%4", colour:A,
    args0:[{type:"field_number",name:"X",value:0},{type:"field_number",name:"Y",value:64},
           {type:"field_number",name:"Z",value:0},{type:"field_input",name:"WORLD",text:"world"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_give_item", {
    message0:"🎁 give %1 %2", colour:A,
    args0:[{type:"field_number",name:"AMT",value:1,min:1,max:64},{type:"field_dropdown",name:"ITEM",options:ITEMS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_remove_item", {
    message0:"🗑 remove %1 %2", colour:A,
    args0:[{type:"field_number",name:"AMT",value:1,min:1},{type:"field_dropdown",name:"ITEM",options:ITEMS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_clear_inventory", { message0:"🗑 clear inventory", colour:A, previousStatement:N, nextStatement:N });
  def("sk_kick", {
    message0:"👢 kick: %1", colour:A,
    args0:[{type:"field_input",name:"REASON",text:"You have been kicked."}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_ban", {
    message0:"🔨 ban: %1", colour:A,
    args0:[{type:"field_input",name:"REASON",text:"You have been banned."}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_op",   { message0:"👑 op player",   colour:A, previousStatement:N, nextStatement:N });
  def("sk_deop", { message0:"👑 deop player", colour:A, previousStatement:N, nextStatement:N });

  // EFFECTS
  const FX = "#6a2a8a";
  def("sk_spawn_particle", {
    message0:"✨ %1 %2 particles", colour:FX,
    args0:[{type:"field_number",name:"COUNT",value:20,min:1},{type:"field_dropdown",name:"PART",options:PARTICLES}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_play_sound", {
    message0:"🔊 play %1 vol:%2", colour:FX,
    args0:[{type:"field_dropdown",name:"SND",options:SOUNDS},{type:"field_number",name:"VOL",value:1,min:0,max:10,precision:0.5}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_apply_effect", {
    message0:"🧪 %1 tier:%2 %3s", colour:FX,
    args0:[{type:"field_dropdown",name:"EFF",options:POTIONS},
           {type:"field_number",name:"TIER",value:1,min:1,max:10},
           {type:"field_number",name:"DUR",value:30,min:1}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_remove_effect", {
    message0:"🧪 remove %1", colour:FX,
    args0:[{type:"field_dropdown",name:"EFF",options:POTIONS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_clear_effects",  { message0:"🧪 clear all effects",   colour:FX, previousStatement:N, nextStatement:N });
  def("sk_set_block", {
    message0:"🟫 set block → %1", colour:FX,
    args0:[{type:"field_dropdown",name:"BLOCK",options:BLOCKS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_explosion", {
    message0:"💥 explosion force %1", colour:FX,
    args0:[{type:"field_number",name:"PWR",value:4,min:0,max:10}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_lightning",   { message0:"⚡ lightning at player",  colour:FX, previousStatement:N, nextStatement:N });
  def("sk_spawn_mob", {
    message0:"👾 spawn %1", colour:FX,
    args0:[{type:"field_dropdown",name:"MOB",options:MOBS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_weather", {
    message0:"🌦 weather → %1", colour:FX,
    args0:[{type:"field_dropdown",name:"WX",options:WEATHERS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_time", {
    message0:"🕐 time → %1", colour:FX,
    args0:[{type:"field_dropdown",name:"TIME",options:TIMES}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_run_command", {
    message0:"▶ player runs %1", colour:FX,
    args0:[{type:"field_input",name:"CMD",text:"/say Hello!"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_run_console", {
    message0:"▶ console runs %1", colour:FX,
    args0:[{type:"field_input",name:"CMD",text:"/broadcast Hello!"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_wait", {
    message0:"⏳ wait %1 seconds", colour:FX,
    args0:[{type:"field_number",name:"SEC",value:1,min:0,precision:0.5}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_cancel_event", { message0:"🚫 cancel event", colour:FX, previousStatement:N, nextStatement:N });
  def("sk_stop",          { message0:"⏹ stop",         colour:"#8a2020", previousStatement:N });

  // VARIABLES
  const V = "#8a5a00";
  def("sk_set_var_str", {
    message0:'📊 {%1} = "%2"', colour:V,
    args0:[{type:"field_input",name:"KEY",text:"myvar"},{type:"field_input",name:"VAL",text:"hello"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_var_num", {
    message0:"📊 {%1} = %2", colour:V,
    args0:[{type:"field_input",name:"KEY",text:"counter"},{type:"field_number",name:"VAL",value:0}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_player_var", {
    message0:"👤 {%1::%player%} = %2", colour:V,
    args0:[{type:"field_input",name:"KEY",text:"home"},{type:"field_input",name:"VAL",text:"value"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_delete_var", {
    message0:"🗑 delete {%1}", colour:V,
    args0:[{type:"field_input",name:"KEY",text:"myvar"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_add_to_var", {
    message0:"➕ add %1 to {%2}", colour:V,
    args0:[{type:"field_number",name:"AMT",value:1},{type:"field_input",name:"KEY",text:"counter"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_subtract_var", {
    message0:"➖ subtract %1 from {%2}", colour:V,
    args0:[{type:"field_number",name:"AMT",value:1},{type:"field_input",name:"KEY",text:"counter"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_add_to_list", {
    message0:"📋 add %1 to list {%2}", colour:V,
    args0:[{type:"field_input",name:"VAL",text:"item"},{type:"field_input",name:"KEY",text:"mylist"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_clear_list", {
    message0:"📋 clear list {%1}", colour:V,
    args0:[{type:"field_input",name:"KEY",text:"mylist"}],
    previousStatement:N, nextStatement:N,
  });

  // LOOPS / CONTROL
  const L = "#1a6a6a";
  def("sk_loop_players",  { message0:"🔁 loop all players",   colour:L, previousStatement:N, nextStatement:N });
  def("sk_loop_times", {
    message0:"🔁 loop %1 times", colour:L,
    args0:[{type:"field_number",name:"N",value:3,min:1}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_loop_list", {
    message0:"🔁 loop list {%1}", colour:L,
    args0:[{type:"field_input",name:"KEY",text:"mylist"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_exit_loop", { message0:"⏹ exit loop", colour:L, previousStatement:N, nextStatement:N });
  def("sk_continue",  { message0:"⏭ continue",  colour:L, previousStatement:N, nextStatement:N });
  def("sk_async",     { message0:"⚡ async:",     colour:L, previousStatement:N, nextStatement:N });

  // FUNCTIONS
  const F = "#7a1a1a";
  def("sk_function_def", {
    message0:"🧩 function %1(%2)", colour:F,
    args0:[{type:"field_input",name:"NAME",text:"myFunc"},{type:"field_input",name:"PARAMS",text:"p: player"}],
    nextStatement:N,
  });
  def("sk_function_call", {
    message0:"▶ call %1(%2)", colour:F,
    args0:[{type:"field_input",name:"NAME",text:"myFunc"},{type:"field_input",name:"ARGS",text:"player"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_function_return", {
    message0:"↩ return %1", colour:F,
    args0:[{type:"field_input",name:"VAL",text:"true"}],
    previousStatement:N,
  });

})();