// SkriptForge — Block Definitions (Skript 2.15 / MC 26.1.2)
(function () {
  "use strict";

  function def(type, cfg) {
    Blockly.Blocks[type] = { init: function () { this.jsonInit(cfg); } };
  }
  const N = null;

  // ── Shared palettes ──────────────────────────────────────────────────────
  window.SF_PAL = {
    GAMEMODES: [["survival","survival"],["creative","creative"],["adventure","adventure"],["spectator","spectator"]],
    WEATHERS:  [["clear","clear"],["rain","rain"],["thunder","thunder"]],
    TIMES:     [["0 (dawn)","0"],["6000 (noon)","6000"],["12000 (sunset)","12000"],["18000 (midnight)","18000"]],
    FLYSTATE:  [["enabled","enabled"],["disabled","disabled"]],
    ITEMS: [
      ["diamond","diamond"],["diamond sword","diamond sword"],["diamond pickaxe","diamond pickaxe"],
      ["diamond axe","diamond axe"],["diamond shovel","diamond shovel"],["diamond hoe","diamond hoe"],
      ["diamond helmet","diamond helmet"],["diamond chestplate","diamond chestplate"],
      ["diamond leggings","diamond leggings"],["diamond boots","diamond boots"],
      ["netherite sword","netherite sword"],["netherite pickaxe","netherite pickaxe"],
      ["netherite axe","netherite axe"],["netherite ingot","netherite ingot"],
      ["iron ingot","iron ingot"],["iron sword","iron sword"],["iron pickaxe","iron pickaxe"],
      ["iron axe","iron axe"],["iron helmet","iron helmet"],["iron chestplate","iron chestplate"],
      ["iron leggings","iron leggings"],["iron boots","iron boots"],
      ["gold ingot","gold ingot"],["golden sword","golden sword"],
      ["golden apple","golden apple"],["enchanted golden apple","enchanted golden apple"],
      ["emerald","emerald"],["coal","coal"],["obsidian","obsidian"],["tnt","tnt"],
      ["bow","bow"],["arrow","arrow"],["crossbow","crossbow"],["trident","trident"],
      ["shield","shield"],["elytra","elytra"],["torch","torch"],["chest","chest"],
      ["book","book"],["enchanted book","enchanted book"],["name tag","name tag"],
      ["saddle","saddle"],["ender pearl","ender pearl"],["blaze rod","blaze rod"],
      ["nether star","nether star"],["totem of undying","totem of undying"],
      ["shulker box","shulker box"],["beacon","beacon"],["end crystal","end crystal"],
      ["dragon egg","dragon egg"],["wither skeleton skull","wither skeleton skull"],
    ],
    MOBS: [
      ["zombie","zombie"],["skeleton","skeleton"],["creeper","creeper"],["spider","spider"],
      ["cave spider","cave spider"],["enderman","enderman"],["witch","witch"],
      ["blaze","blaze"],["ghast","ghast"],["slime","slime"],["magma cube","magma cube"],
      ["warden","warden"],["phantom","phantom"],["drowned","drowned"],["husk","husk"],
      ["stray","stray"],["pillager","pillager"],["ravager","ravager"],["vindicator","vindicator"],
      ["evoker","evoker"],["vex","vex"],["elder guardian","elder guardian"],
      ["guardian","guardian"],["shulker","shulker"],["silverfish","silverfish"],
      ["endermite","endermite"],["zombie villager","zombie villager"],
      ["zombie piglin","zombie piglin"],["piglin","piglin"],["piglin brute","piglin brute"],
      ["hoglin","hoglin"],["zoglin","zoglin"],["strider","strider"],
      ["cow","cow"],["pig","pig"],["sheep","sheep"],["chicken","chicken"],
      ["horse","horse"],["donkey","donkey"],["mule","mule"],["wolf","wolf"],
      ["cat","cat"],["ocelot","ocelot"],["fox","fox"],["rabbit","rabbit"],
      ["llama","llama"],["parrot","parrot"],["panda","panda"],["polar bear","polar bear"],
      ["villager","villager"],["wandering trader","wandering trader"],
      ["iron golem","iron golem"],["snow golem","snow golem"],["bee","bee"],
      ["axolotl","axolotl"],["glow squid","glow squid"],["frog","frog"],
      ["tadpole","tadpole"],["allay","allay"],["camel","camel"],["sniffer","sniffer"],
      ["armadillo","armadillo"],["bogged","bogged"],["breeze","breeze"],
    ],
    SOUNDS: [
      ["level up","entity.player.levelup"],["xp orb","entity.experience_orb.pickup"],
      ["explosion","entity.generic.explode"],["wither spawn","entity.wither.spawn"],
      ["ender dragon death","entity.ender_dragon.death"],
      ["bell","block.bell.use"],["chest open","block.chest.open"],
      ["chest close","block.chest.close"],["anvil use","block.anvil.use"],
      ["villager yes","entity.villager.yes"],["villager no","entity.villager.no"],
      ["fire crackle","block.fire.ambient"],["thunder","entity.lightning_bolt.thunder"],
      ["arrow hit","entity.arrow.hit"],["sword sweep","entity.player.attack.sweep"],
      ["sword strong","entity.player.attack.strong"],
      ["enderman scream","entity.enderman.scream"],["creeper hiss","entity.creeper.primed"],
      ["creeper death","entity.creeper.death"],
      ["note harp","block.note_block.harp"],["note bass","block.note_block.bass"],
      ["note bell","block.note_block.bell"],["note pling","block.note_block.pling"],
      ["beacon activate","block.beacon.activate"],["beacon deactivate","block.beacon.deactivate"],
      ["beacon power select","block.beacon.power_select"],
      ["book page turn","item.book.page_turn"],["firework blast","entity.firework_rocket.blast"],
      ["portal trigger","block.portal.trigger"],["totem use","item.totem.use"],
      ["heart of the sea","item.heart_of_the_sea.equip"],
    ],
    PARTICLES: [
      ["heart","heart"],["flame","flame"],["soul fire flame","soul fire flame"],
      ["smoke","smoke"],["large smoke","large smoke"],["portal","portal"],
      ["reverse portal","reverse portal"],["enchant","enchant"],["cloud","cloud"],
      ["explosion","explosion"],["large explosion","large explosion"],
      ["crit","crit"],["magic crit","magic crit"],["witch","witch"],
      ["water splash","water splash"],["water drip","dripping water"],
      ["lava drip","dripping lava"],["happy villager","happy villager"],
      ["angry villager","angry villager"],["totem of undying","totem of undying"],
      ["dragon breath","dragon breath"],["end rod","end rod"],
      ["sculk charge","sculk charge"],["sonic boom","sonic boom"],["cherry leaves","cherry leaves"],
    ],
    POTIONS: [
      ["speed","speed"],["slowness","slowness"],["haste","haste"],
      ["mining fatigue","mining fatigue"],["strength","strength"],["weakness","weakness"],
      ["instant health","instant health"],["instant damage","instant damage"],
      ["jump boost","jump boost"],["nausea","nausea"],["regeneration","regeneration"],
      ["resistance","resistance"],["fire resistance","fire resistance"],
      ["water breathing","water breathing"],["invisibility","invisibility"],
      ["blindness","blindness"],["night vision","night vision"],
      ["hunger","hunger"],["poison","poison"],["wither","wither"],
      ["health boost","health boost"],["absorption","absorption"],["saturation","saturation"],
      ["levitation","levitation"],["luck","luck"],["unluck","unluck"],
      ["slow falling","slow falling"],["conduit power","conduit power"],
      ["dolphins grace","dolphins grace"],["bad omen","bad omen"],
      ["hero of the village","hero of the village"],["darkness","darkness"],
      ["glowing","glowing"],["trial omen","trial omen"],["raid omen","raid omen"],
      ["wind charged","wind charged"],["weaving","weaving"],
      ["oozing","oozing"],["infested","infested"],
    ],
    BLOCKS: [
      ["air","air"],["stone","stone"],["granite","granite"],["diorite","diorite"],
      ["andesite","andesite"],["grass block","grass block"],["dirt","dirt"],
      ["podzol","podzol"],["cobblestone","cobblestone"],["oak log","oak log"],
      ["oak planks","oak planks"],["oak leaves","oak leaves"],
      ["sand","sand"],["red sand","red sand"],["gravel","gravel"],
      ["gold ore","gold ore"],["deepslate gold ore","deepslate gold ore"],
      ["iron ore","iron ore"],["deepslate iron ore","deepslate iron ore"],
      ["diamond ore","diamond ore"],["deepslate diamond ore","deepslate diamond ore"],
      ["ancient debris","ancient debris"],["obsidian","obsidian"],["crying obsidian","crying obsidian"],
      ["bedrock","bedrock"],["water","water"],["lava","lava"],
      ["tnt","tnt"],["chest","chest"],["trapped chest","trapped chest"],
      ["furnace","furnace"],["crafting table","crafting table"],
      ["enchanting table","enchanting table"],["anvil","anvil"],
      ["brewing stand","brewing stand"],["beacon","beacon"],
      ["glowstone","glowstone"],["sea lantern","sea lantern"],
      ["end stone","end stone"],["purpur block","purpur block"],
      ["netherrack","netherrack"],["soul sand","soul sand"],["soul soil","soul soil"],
      ["nether bricks","nether bricks"],["quartz block","quartz block"],
      ["glass","glass"],["tinted glass","tinted glass"],
      ["redstone block","redstone block"],["emerald block","emerald block"],
      ["diamond block","diamond block"],["gold block","gold block"],
      ["iron block","iron block"],["netherite block","netherite block"],
      ["spawner","spawner"],["sponge","sponge"],["wet sponge","wet sponge"],
      ["magma block","magma block"],["shroomlight","shroomlight"],
      ["sculk","sculk"],["sculk catalyst","sculk catalyst"],["sculk shrieker","sculk shrieker"],
    ],
    ENCHANTS: [
      ["sharpness","sharpness"],["smite","smite"],["bane of arthropods","bane of arthropods"],
      ["knockback","knockback"],["fire aspect","fire aspect"],["looting","looting"],
      ["sweeping edge","sweeping edge"],["unbreaking","unbreaking"],["mending","mending"],
      ["efficiency","efficiency"],["silk touch","silk touch"],["fortune","fortune"],
      ["power","power"],["punch","punch"],["flame","flame"],["infinity","infinity"],
      ["protection","protection"],["fire protection","fire protection"],
      ["blast protection","blast protection"],["projectile protection","projectile protection"],
      ["feather falling","feather falling"],["thorns","thorns"],["respiration","respiration"],
      ["aqua affinity","aqua affinity"],["depth strider","depth strider"],
      ["frost walker","frost walker"],["soul speed","soul speed"],
      ["swift sneak","swift sneak"],["curse of vanishing","curse of vanishing"],
      ["curse of binding","curse of binding"],["luck of the sea","luck of the sea"],
      ["lure","lure"],["riptide","riptide"],["loyalty","loyalty"],["impaling","impaling"],
      ["channeling","channeling"],["multishot","multishot"],["quick charge","quick charge"],
      ["piercing","piercing"],["density","density"],["breach","breach"],["wind burst","wind burst"],
    ],
    DAMAGE_CAUSE: [
      ["void","void"],["fall","fall"],["fire","fire"],["lava","lava"],["drown","drown"],
      ["suffocation","suffocation"],["starvation","starvation"],["poison","poison"],
      ["magic","magic"],["wither","wither"],["lightning","lightning"],
      ["explosion","explosion"],["contact","contact"],["entity attack","entity attack"],
      ["projectile","projectile"],["suicide","suicide"],["custom","custom"],
    ],
    ATTRIBUTES: [
      ["max health","max health"],["movement speed","movement speed"],
      ["attack damage","attack damage"],["attack speed","attack speed"],
      ["armor","armor"],["armor toughness","armor toughness"],
      ["luck","luck"],["knockback resistance","knockback resistance"],
      ["follow range","follow range"],["flying speed","flying speed"],
    ],
  };

  const { GAMEMODES, WEATHERS, TIMES, FLYSTATE, ITEMS, MOBS, SOUNDS, PARTICLES, POTIONS, BLOCKS, ENCHANTS, DAMAGE_CAUSE, ATTRIBUTES } = window.SF_PAL;

  // ════════════════════════════════════════════════════════════════════════════
  // EVENTS
  // ════════════════════════════════════════════════════════════════════════════
  const E = "#b06000";

  // Player lifecycle
  def("sk_on_join",               { message0:"on join",               colour:E, nextStatement:N });
  def("sk_on_quit",               { message0:"on quit",               colour:E, nextStatement:N });
  def("sk_on_first_join",         { message0:"on first join",         colour:E, nextStatement:N });
  def("sk_on_chat",               { message0:"on chat",               colour:E, nextStatement:N });
  def("sk_on_death",              { message0:"on death",              colour:E, nextStatement:N });
  def("sk_on_respawn",            { message0:"on respawn",            colour:E, nextStatement:N });
  def("sk_on_damage",             { message0:"on damage",             colour:E, nextStatement:N });
  def("sk_on_heal",               { message0:"on heal",               colour:E, nextStatement:N });
  def("sk_on_level_change",       { message0:"on level change",       colour:E, nextStatement:N });
  def("sk_on_xp_change",          { message0:"on xp change",          colour:E, nextStatement:N });
  def("sk_on_food_change",        { message0:"on food level change",  colour:E, nextStatement:N });
  def("sk_on_sneak",              { message0:"on toggle sneak",       colour:E, nextStatement:N });
  def("sk_on_sprint",             { message0:"on toggle sprint",      colour:E, nextStatement:N });
  def("sk_on_toggle_flight",      { message0:"on toggle flight",      colour:E, nextStatement:N });
  def("sk_on_move",               { message0:"on move  ⚠ heavy",      colour:E, nextStatement:N });
  def("sk_on_teleport",           { message0:"on teleport",           colour:E, nextStatement:N });
  def("sk_on_bed_enter",          { message0:"on bed enter",          colour:E, nextStatement:N });
  def("sk_on_bed_leave",          { message0:"on bed leave",          colour:E, nextStatement:N });
  def("sk_on_kick",               { message0:"on kick",               colour:E, nextStatement:N });
  def("sk_on_gamemode_change",    { message0:"on gamemode change",    colour:E, nextStatement:N });
  def("sk_on_armor_change",       { message0:"on armor change",       colour:E, nextStatement:N });

  // Commands
  def("sk_on_command", {
    message0:"on /%1 command", colour:E,
    args0:[{type:"field_input",name:"CMD",text:"mycommand"}], nextStatement:N,
  });
  def("sk_command_block", {
    message0:"command /%1", colour:E,
    args0:[{type:"field_input",name:"CMD",text:"mycommand"}], nextStatement:N,
    tooltip:"Full command definition block",
  });

  // Block events
  def("sk_on_break",           { message0:"on break",           colour:E, nextStatement:N });
  def("sk_on_place",           { message0:"on place",           colour:E, nextStatement:N });
  def("sk_on_right_click",     { message0:"on right click",     colour:E, nextStatement:N });
  def("sk_on_left_click",      { message0:"on left click",      colour:E, nextStatement:N });
  def("sk_on_right_click_block",{ message0:"on right click on block", colour:E, nextStatement:N });
  def("sk_on_sign_change",     { message0:"on sign change",     colour:E, nextStatement:N });
  def("sk_on_redstone",        { message0:"on redstone change", colour:E, nextStatement:N });

  // Item events
  def("sk_on_item_drop",       { message0:"on item drop",       colour:E, nextStatement:N });
  def("sk_on_item_pickup",     { message0:"on item pickup",     colour:E, nextStatement:N });
  def("sk_on_item_damage",     { message0:"on item damage",     colour:E, nextStatement:N });
  def("sk_on_consume",         { message0:"on consume",         colour:E, nextStatement:N });
  def("sk_on_craft",           { message0:"on crafting",        colour:E, nextStatement:N });
  def("sk_on_enchant",         { message0:"on enchant",         colour:E, nextStatement:N });
  def("sk_on_arrow_pickup",    { message0:"on player pick up arrow", colour:E, nextStatement:N });
  def("sk_on_item_cooldown",   { message0:"on item cooldown change", colour:E, nextStatement:N });

  // Inventory events
  def("sk_on_inventory_open",  { message0:"on inventory open",  colour:E, nextStatement:N });
  def("sk_on_inventory_close", { message0:"on inventory close", colour:E, nextStatement:N });
  def("sk_on_inventory_click", { message0:"on inventory click", colour:E, nextStatement:N });
  def("sk_on_inventory_drag",  { message0:"on inventory drag",  colour:E, nextStatement:N });
  def("sk_on_inv_item_move",   { message0:"on inventory item move", colour:E, nextStatement:N });

  // Entity events
  def("sk_on_entity_spawn",    { message0:"on entity spawn",    colour:E, nextStatement:N });
  def("sk_on_entity_death",    { message0:"on entity death",    colour:E, nextStatement:N });
  def("sk_on_entity_damage",   { message0:"on entity damage",   colour:E, nextStatement:N });
  def("sk_on_projectile_hit",  { message0:"on projectile hit",  colour:E, nextStatement:N });
  def("sk_on_projectile_launch",{ message0:"on projectile launch",colour:E,nextStatement:N });
  def("sk_on_entity_transform",{ message0:"on entity transform",colour:E, nextStatement:N });
  def("sk_on_exp_spawn",       { message0:"on experience spawn",colour:E, nextStatement:N });

  // World / server events
  def("sk_on_server_start",    { message0:"on server start",    colour:E, nextStatement:N });
  def("sk_on_server_stop",     { message0:"on server stop",     colour:E, nextStatement:N });
  def("sk_on_weather_change",  { message0:"on weather change",  colour:E, nextStatement:N });
  def("sk_on_lightning",       { message0:"on lightning strike",colour:E, nextStatement:N });
  def("sk_on_world_load",      { message0:"on world load",      colour:E, nextStatement:N });
  def("sk_on_world_unload",    { message0:"on world unload",    colour:E, nextStatement:N });
  def("sk_on_chunk_load",      { message0:"on chunk load",      colour:E, nextStatement:N });
  def("sk_on_portal_create",   { message0:"on portal create",   colour:E, nextStatement:N });
  def("sk_every_x_seconds", {
    message0:"every %1 seconds", colour:E,
    args0:[{type:"field_number",name:"SEC",value:60,min:1}], nextStatement:N,
  });
  def("sk_every_x_ticks", {
    message0:"every %1 ticks", colour:E,
    args0:[{type:"field_number",name:"TICKS",value:20,min:1}], nextStatement:N,
  });

  // ════════════════════════════════════════════════════════════════════════════
  // CONDITIONS
  // ════════════════════════════════════════════════════════════════════════════
  const C = "#1a5a9a";

  // Player state
  def("sk_if_permission", {
    message0:"if player has permission %1", colour:C,
    args0:[{type:"field_input",name:"PERM",text:"myplugin.use"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_gamemode", {
    message0:"if gamemode is %1", colour:C,
    args0:[{type:"field_dropdown",name:"GM",options:GAMEMODES}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_world", {
    message0:"if world is %1", colour:C,
    args0:[{type:"field_input",name:"WORLD",text:"world"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_op",        { message0:"if player is op",          colour:C, previousStatement:N, nextStatement:N });
  def("sk_if_sneaking",  { message0:"if player is sneaking",    colour:C, previousStatement:N, nextStatement:N });
  def("sk_if_flying",    { message0:"if player is flying",      colour:C, previousStatement:N, nextStatement:N });
  def("sk_if_sprinting", { message0:"if player is sprinting",   colour:C, previousStatement:N, nextStatement:N });
  def("sk_if_on_ground", { message0:"if player is on ground",   colour:C, previousStatement:N, nextStatement:N });
  def("sk_if_sleeping",  { message0:"if player is sleeping",    colour:C, previousStatement:N, nextStatement:N });
  def("sk_if_in_vehicle",{ message0:"if player is in a vehicle",colour:C, previousStatement:N, nextStatement:N });
  def("sk_if_gliding",   { message0:"if player is gliding",     colour:C, previousStatement:N, nextStatement:N });
  def("sk_if_swimming",  { message0:"if player is swimming",    colour:C, previousStatement:N, nextStatement:N });
  def("sk_if_online", {
    message0:"if player %1 is online", colour:C,
    args0:[{type:"field_input",name:"PLAYER",text:"Notch"}],
    previousStatement:N, nextStatement:N,
  });

  // Player stats
  def("sk_if_health_below", {
    message0:"if health < %1", colour:C,
    args0:[{type:"field_number",name:"HP",value:5,min:0,max:20}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_health_above", {
    message0:"if health > %1", colour:C,
    args0:[{type:"field_number",name:"HP",value:10,min:0,max:20}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_food_below", {
    message0:"if food < %1", colour:C,
    args0:[{type:"field_number",name:"FOOD",value:5,min:0,max:20}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_level_above", {
    message0:"if level > %1", colour:C,
    args0:[{type:"field_number",name:"LVL",value:10,min:0}],
    previousStatement:N, nextStatement:N,
  });

  // Items
  def("sk_if_holding", {
    message0:"if player holding %1", colour:C,
    args0:[{type:"field_dropdown",name:"ITEM",options:ITEMS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_has_item", {
    message0:"if player has %1 %2", colour:C,
    args0:[{type:"field_number",name:"AMT",value:1,min:1},{type:"field_dropdown",name:"ITEM",options:ITEMS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_wearing", {
    message0:"if player wearing %1", colour:C,
    args0:[{type:"field_dropdown",name:"ITEM",options:ITEMS}],
    previousStatement:N, nextStatement:N,
  });

  // Blocks
  def("sk_if_block_is", {
    message0:"if block below is %1", colour:C,
    args0:[{type:"field_dropdown",name:"BLOCK",options:BLOCKS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_block_at_is", {
    message0:"if block at %1 %2 %3 is %4", colour:C,
    args0:[{type:"field_number",name:"X",value:0},{type:"field_number",name:"Y",value:64},
           {type:"field_number",name:"Z",value:0},{type:"field_dropdown",name:"BLOCK",options:BLOCKS}],
    previousStatement:N, nextStatement:N,
  });

  // Variables
  def("sk_if_var_equals", {
    message0:"if {%1} = \"%2\"", colour:C,
    args0:[{type:"field_input",name:"KEY",text:"myvar"},{type:"field_input",name:"VAL",text:"value"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_var_num_equals", {
    message0:"if {%1} = %2", colour:C,
    args0:[{type:"field_input",name:"KEY",text:"counter"},{type:"field_number",name:"VAL",value:0}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_var_greater", {
    message0:"if {%1} > %2", colour:C,
    args0:[{type:"field_input",name:"KEY",text:"counter"},{type:"field_number",name:"VAL",value:0}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_var_less", {
    message0:"if {%1} < %2", colour:C,
    args0:[{type:"field_input",name:"KEY",text:"counter"},{type:"field_number",name:"VAL",value:10}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_var_set", {
    message0:"if {%1} is set", colour:C,
    args0:[{type:"field_input",name:"KEY",text:"myvar"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_if_var_not_set", {
    message0:"if {%1} is not set", colour:C,
    args0:[{type:"field_input",name:"KEY",text:"myvar"}],
    previousStatement:N, nextStatement:N,
  });

  // Logic
  def("sk_else",           { message0:"else:",                colour:C, previousStatement:N, nextStatement:N });
  def("sk_else_if_perm", {
    message0:"else if permission %1", colour:C,
    args0:[{type:"field_input",name:"PERM",text:"myplugin.admin"}],
    previousStatement:N, nextStatement:N,
  });

  // ════════════════════════════════════════════════════════════════════════════
  // MESSAGES & OUTPUT
  // ════════════════════════════════════════════════════════════════════════════
  const M = "#1a7060";

  def("sk_send_message", {
    message0:"send \"%1\" to player", colour:M,
    args0:[{type:"field_input",name:"MSG",text:"&aHello %player%!"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_send_title", {
    message0:"title \"%1\"", colour:M,
    args0:[{type:"field_input",name:"MSG",text:"&6Welcome!"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_send_subtitle", {
    message0:"subtitle \"%1\"", colour:M,
    args0:[{type:"field_input",name:"MSG",text:"&7Enjoy your stay"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_send_actionbar", {
    message0:"action bar \"%1\"", colour:M,
    args0:[{type:"field_input",name:"MSG",text:"&c❤ Low Health!"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_broadcast", {
    message0:"broadcast \"%1\"", colour:M,
    args0:[{type:"field_input",name:"MSG",text:"&a[Server] Announcement!"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_broadcast_world", {
    message0:"broadcast \"%1\" to world %2", colour:M,
    args0:[{type:"field_input",name:"MSG",text:"&eMessage"},{type:"field_input",name:"WORLD",text:"world"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_send_to_player", {
    message0:"send \"%1\" to %2", colour:M,
    args0:[{type:"field_input",name:"MSG",text:"&ePM!"},{type:"field_input",name:"PLAYER",text:"Notch"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_log_console", {
    message0:"log \"%1\"", colour:M,
    args0:[{type:"field_input",name:"MSG",text:"[SkriptForge] event fired"}],
    previousStatement:N, nextStatement:N,
  });

  // ════════════════════════════════════════════════════════════════════════════
  // PLAYER ACTIONS
  // ════════════════════════════════════════════════════════════════════════════
  const A = "#2a6a1a";

  // Gamestate
  def("sk_set_gamemode", {
    message0:"set gamemode to %1", colour:A,
    args0:[{type:"field_dropdown",name:"GM",options:GAMEMODES}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_health", {
    message0:"set health to %1", colour:A,
    args0:[{type:"field_number",name:"HP",value:20,min:0,max:20}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_heal",             { message0:"heal player",         colour:A, previousStatement:N, nextStatement:N });
  def("sk_set_food", {
    message0:"set food to %1", colour:A,
    args0:[{type:"field_number",name:"FOOD",value:20,min:0,max:20}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_max_health", {
    message0:"set max health to %1", colour:A,
    args0:[{type:"field_number",name:"HP",value:20,min:1,max:1024}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_add_xp", {
    message0:"give %1 xp points", colour:A,
    args0:[{type:"field_number",name:"XP",value:100,min:0}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_level", {
    message0:"set level to %1", colour:A,
    args0:[{type:"field_number",name:"LVL",value:0,min:0}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_xp_progress", {
    message0:"set xp progress to %1 (0–1)", colour:A,
    args0:[{type:"field_number",name:"PROG",value:0.5,min:0,max:1,precision:0.05}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_fly", {
    message0:"set flight %1", colour:A,
    args0:[{type:"field_dropdown",name:"FLY",options:FLYSTATE}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_walk_speed", {
    message0:"set walk speed to %1", colour:A,
    args0:[{type:"field_number",name:"SPD",value:0.2,min:-1,max:1,precision:0.05}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_fly_speed", {
    message0:"set fly speed to %1", colour:A,
    args0:[{type:"field_number",name:"SPD",value:0.1,min:-1,max:1,precision:0.05}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_allow_flight",     { message0:"allow player to fly", colour:A, previousStatement:N, nextStatement:N });
  def("sk_disallow_flight",  { message0:"disallow player from flying", colour:A, previousStatement:N, nextStatement:N });

  // Movement
  def("sk_teleport_spawn",   { message0:"teleport to world spawn",    colour:A, previousStatement:N, nextStatement:N });
  def("sk_teleport_bed",     { message0:"teleport to bed spawn",      colour:A, previousStatement:N, nextStatement:N });
  def("sk_teleport_coords", {
    message0:"teleport to x:%1 y:%2 z:%3 world:%4", colour:A,
    args0:[{type:"field_number",name:"X",value:0},{type:"field_number",name:"Y",value:64},
           {type:"field_number",name:"Z",value:0},{type:"field_input",name:"WORLD",text:"world"}],
    previousStatement:N, nextStatement:N,
  });

  // Items
  def("sk_give_item", {
    message0:"give %1 %2", colour:A,
    args0:[{type:"field_number",name:"AMT",value:1,min:1,max:64},{type:"field_dropdown",name:"ITEM",options:ITEMS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_remove_item", {
    message0:"remove %1 %2 from inventory", colour:A,
    args0:[{type:"field_number",name:"AMT",value:1,min:1},{type:"field_dropdown",name:"ITEM",options:ITEMS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_clear_inventory",  { message0:"clear inventory",           colour:A, previousStatement:N, nextStatement:N });
  def("sk_drop_item", {
    message0:"drop %1 %2 at player", colour:A,
    args0:[{type:"field_number",name:"AMT",value:1,min:1},{type:"field_dropdown",name:"ITEM",options:ITEMS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_enchant_held", {
    message0:"enchant held item with %1 level %2", colour:A,
    args0:[{type:"field_dropdown",name:"ENC",options:ENCHANTS},{type:"field_number",name:"LVL",value:1,min:1,max:10}],
    previousStatement:N, nextStatement:N,
  });

  // Moderation
  def("sk_kick", {
    message0:"kick: \"%1\"", colour:A,
    args0:[{type:"field_input",name:"REASON",text:"You have been kicked."}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_ban", {
    message0:"ban: \"%1\"", colour:A,
    args0:[{type:"field_input",name:"REASON",text:"You have been banned."}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_ip_ban",           { message0:"ip-ban player",      colour:A, previousStatement:N, nextStatement:N });
  def("sk_op",               { message0:"op player",          colour:A, previousStatement:N, nextStatement:N });
  def("sk_deop",             { message0:"deop player",        colour:A, previousStatement:N, nextStatement:N });
  def("sk_set_display_name", {
    message0:"set display name to \"%1\"", colour:A,
    args0:[{type:"field_input",name:"NAME",text:"&6[VIP] &f%player%"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_tab_name", {
    message0:"set tab name to \"%1\"", colour:A,
    args0:[{type:"field_input",name:"NAME",text:"&6%player%"}],
    previousStatement:N, nextStatement:N,
  });

  // ════════════════════════════════════════════════════════════════════════════
  // WORLD EFFECTS
  // ════════════════════════════════════════════════════════════════════════════
  const FX = "#5a2080";

  def("sk_spawn_particle", {
    message0:"spawn %1 %2 particles at player", colour:FX,
    args0:[{type:"field_number",name:"COUNT",value:20,min:1},{type:"field_dropdown",name:"PART",options:PARTICLES}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_play_sound", {
    message0:"play \"%1\" vol:%2 pitch:%3", colour:FX,
    args0:[{type:"field_dropdown",name:"SND",options:SOUNDS},
           {type:"field_number",name:"VOL",value:1,min:0,max:10,precision:0.5},
           {type:"field_number",name:"PITCH",value:1,min:0.5,max:2,precision:0.1}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_apply_effect", {
    message0:"apply %1 tier:%2 for %3s", colour:FX,
    args0:[{type:"field_dropdown",name:"EFF",options:POTIONS},
           {type:"field_number",name:"TIER",value:1,min:1,max:255},
           {type:"field_number",name:"DUR",value:30,min:1}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_remove_effect", {
    message0:"remove effect %1", colour:FX,
    args0:[{type:"field_dropdown",name:"EFF",options:POTIONS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_clear_effects",    { message0:"clear all effects",                  colour:FX, previousStatement:N, nextStatement:N });
  def("sk_set_block", {
    message0:"set block at player to %1", colour:FX,
    args0:[{type:"field_dropdown",name:"BLOCK",options:BLOCKS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_block_coords", {
    message0:"set block at %1 %2 %3 to %4", colour:FX,
    args0:[{type:"field_number",name:"X",value:0},{type:"field_number",name:"Y",value:64},
           {type:"field_number",name:"Z",value:0},{type:"field_dropdown",name:"BLOCK",options:BLOCKS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_explosion", {
    message0:"explosion force %1 at player", colour:FX,
    args0:[{type:"field_number",name:"PWR",value:4,min:0,max:10}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_lightning",        { message0:"lightning at player",                colour:FX, previousStatement:N, nextStatement:N });
  def("sk_lightning_safe",   { message0:"lightning (cosmetic) at player",     colour:FX, previousStatement:N, nextStatement:N });
  def("sk_spawn_mob", {
    message0:"spawn %1 at player", colour:FX,
    args0:[{type:"field_dropdown",name:"MOB",options:MOBS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_spawn_mob_name", {
    message0:"spawn %1 named \"%2\" at player", colour:FX,
    args0:[{type:"field_dropdown",name:"MOB",options:MOBS},{type:"field_input",name:"NAME",text:"Boss"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_kill_nearby", {
    message0:"kill all entities in radius %1", colour:FX,
    args0:[{type:"field_number",name:"RAD",value:5,min:1}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_weather", {
    message0:"set weather to %1", colour:FX,
    args0:[{type:"field_dropdown",name:"WX",options:WEATHERS}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_time", {
    message0:"set time to %1", colour:FX,
    args0:[{type:"field_dropdown",name:"TIME",options:TIMES}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_drop_block_loot",  { message0:"drop loot of block below player",    colour:FX, previousStatement:N, nextStatement:N });
  def("sk_push_entity", {
    message0:"push player with vector %1 %2 %3", colour:FX,
    args0:[{type:"field_number",name:"X",value:0},{type:"field_number",name:"Y",value:1},{type:"field_number",name:"Z",value:0}],
    previousStatement:N, nextStatement:N,
  });

  // Flow
  def("sk_run_command", {
    message0:"player runs \"%1\"", colour:FX,
    args0:[{type:"field_input",name:"CMD",text:"/say Hello!"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_run_console", {
    message0:"console runs \"%1\"", colour:FX,
    args0:[{type:"field_input",name:"CMD",text:"/broadcast Hello!"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_wait", {
    message0:"wait %1 seconds", colour:FX,
    args0:[{type:"field_number",name:"SEC",value:1,min:0,precision:0.5}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_wait_ticks", {
    message0:"wait %1 ticks", colour:FX,
    args0:[{type:"field_number",name:"TICKS",value:20,min:1}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_cancel_event",     { message0:"cancel event",                        colour:FX, previousStatement:N, nextStatement:N });
  def("sk_stop",             { message0:"stop",                                colour:"#8a1010", previousStatement:N });

  // ════════════════════════════════════════════════════════════════════════════
  // VARIABLES
  // ════════════════════════════════════════════════════════════════════════════
  const V = "#7a4800";

  def("sk_set_var_str", {
    message0:'{var::%1} = "%2"', colour:V,
    args0:[{type:"field_input",name:"KEY",text:"myvar"},{type:"field_input",name:"VAL",text:"hello"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_var_num", {
    message0:"{var::%1} = %2", colour:V,
    args0:[{type:"field_input",name:"KEY",text:"counter"},{type:"field_number",name:"VAL",value:0}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_player_var", {
    message0:'{pvar::%1::%player%} = "%2"', colour:V,
    args0:[{type:"field_input",name:"KEY",text:"home"},{type:"field_input",name:"VAL",text:"value"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_set_global_var", {
    message0:"{global::%1} = %2", colour:V,
    args0:[{type:"field_input",name:"KEY",text:"maxplayers"},{type:"field_number",name:"VAL",value:100}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_delete_var", {
    message0:"delete {var::%1}", colour:V,
    args0:[{type:"field_input",name:"KEY",text:"myvar"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_add_var", {
    message0:"add %1 to {var::%2}", colour:V,
    args0:[{type:"field_number",name:"AMT",value:1},{type:"field_input",name:"KEY",text:"counter"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_subtract_var", {
    message0:"subtract %1 from {var::%2}", colour:V,
    args0:[{type:"field_number",name:"AMT",value:1},{type:"field_input",name:"KEY",text:"counter"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_multiply_var", {
    message0:"{var::%1} × %2", colour:V,
    args0:[{type:"field_input",name:"KEY",text:"score"},{type:"field_number",name:"AMT",value:2}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_divide_var", {
    message0:"{var::%1} ÷ %2", colour:V,
    args0:[{type:"field_input",name:"KEY",text:"score"},{type:"field_number",name:"AMT",value:2,min:1}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_add_list", {
    message0:'add "%1" to {list::%2::*}', colour:V,
    args0:[{type:"field_input",name:"VAL",text:"item"},{type:"field_input",name:"KEY",text:"mylist"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_remove_list", {
    message0:'remove "%1" from {list::%2::*}', colour:V,
    args0:[{type:"field_input",name:"VAL",text:"item"},{type:"field_input",name:"KEY",text:"mylist"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_clear_list", {
    message0:"clear {list::%1::*}", colour:V,
    args0:[{type:"field_input",name:"KEY",text:"mylist"}],
    previousStatement:N, nextStatement:N,
  });

  // ════════════════════════════════════════════════════════════════════════════
  // CONTROL FLOW
  // ════════════════════════════════════════════════════════════════════════════
  const L = "#1a5a5a";

  def("sk_loop_players",     { message0:"loop all players:",             colour:L, previousStatement:N, nextStatement:N });
  def("sk_loop_times", {
    message0:"loop %1 times:", colour:L,
    args0:[{type:"field_number",name:"N",value:3,min:1}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_loop_list", {
    message0:"loop {list::%1::*}:", colour:L,
    args0:[{type:"field_input",name:"KEY",text:"mylist"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_loop_entities", {
    message0:"loop all %1 in radius %2:", colour:L,
    args0:[{type:"field_dropdown",name:"MOB",options:MOBS},{type:"field_number",name:"RAD",value:10,min:1}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_while_var", {
    message0:"while {var::%1} < %2:", colour:L,
    args0:[{type:"field_input",name:"KEY",text:"i"},{type:"field_number",name:"MAX",value:10}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_exit_loop",        { message0:"exit loop",                     colour:L, previousStatement:N, nextStatement:N });
  def("sk_exit_loops", {
    message0:"exit %1 loops", colour:L,
    args0:[{type:"field_number",name:"N",value:2,min:1}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_continue",         { message0:"continue",                      colour:L, previousStatement:N, nextStatement:N });
  def("sk_async",            { message0:"async:",                        colour:L, previousStatement:N, nextStatement:N, tooltip:"Run following actions off the main thread." });

  // ════════════════════════════════════════════════════════════════════════════
  // FUNCTIONS
  // ════════════════════════════════════════════════════════════════════════════
  const F = "#7a1010";

  def("sk_function_def", {
    message0:"function %1(%2):", colour:F,
    args0:[{type:"field_input",name:"NAME",text:"myFunc"},{type:"field_input",name:"PARAMS",text:"p: player"}],
    nextStatement:N,
  });
  def("sk_function_call", {
    message0:"call %1(%2)", colour:F,
    args0:[{type:"field_input",name:"NAME",text:"myFunc"},{type:"field_input",name:"ARGS",text:"player"}],
    previousStatement:N, nextStatement:N,
  });
  def("sk_function_return", {
    message0:"return %1", colour:F,
    args0:[{type:"field_input",name:"VAL",text:"true"}],
    previousStatement:N,
  });

  // ════════════════════════════════════════════════════════════════════════════
  // COMMENT
  // ════════════════════════════════════════════════════════════════════════════
  def("sk_comment", {
    message0:"# %1", colour:"#333355",
    args0:[{type:"field_input",name:"TEXT",text:"Your comment here"}],
    previousStatement:N, nextStatement:N,
    tooltip:"Adds a comment line to the output .sk file.",
  });

})();