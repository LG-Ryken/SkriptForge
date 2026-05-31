// SkriptForge — Validator
window.SF_Validator = (function () {
  "use strict";

  const EVENT_TYPES = new Set([
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
    "sk_every_x_seconds","sk_every_x_ticks","sk_function_def",
  ]);

  // Events that have NO player variable
  const NO_PLAYER = new Set([
    "sk_on_server_start","sk_on_server_stop","sk_every_x_seconds","sk_every_x_ticks",
    "sk_on_entity_spawn","sk_on_entity_death","sk_on_entity_damage","sk_on_projectile_hit",
    "sk_on_projectile_launch","sk_on_entity_transform","sk_on_exp_spawn",
    "sk_on_weather_change","sk_on_lightning","sk_on_world_load","sk_on_world_unload",
    "sk_on_chunk_load","sk_on_portal_create","sk_on_redstone",
  ]);

  const NEEDS_PLAYER = new Set([
    "sk_send_message","sk_send_title","sk_send_subtitle","sk_send_actionbar",
    "sk_set_gamemode","sk_set_health","sk_heal","sk_set_food","sk_set_max_health",
    "sk_add_xp","sk_set_level","sk_set_xp_progress","sk_set_fly","sk_set_walk_speed",
    "sk_set_fly_speed","sk_allow_flight","sk_disallow_flight",
    "sk_teleport_spawn","sk_teleport_bed","sk_teleport_coords",
    "sk_give_item","sk_remove_item","sk_clear_inventory","sk_drop_item","sk_enchant_held",
    "sk_kick","sk_ban","sk_ip_ban","sk_op","sk_deop","sk_set_display_name","sk_set_tab_name",
    "sk_spawn_particle","sk_play_sound","sk_apply_effect","sk_remove_effect","sk_clear_effects",
    "sk_set_block","sk_explosion","sk_lightning","sk_lightning_safe","sk_spawn_mob","sk_spawn_mob_name",
    "sk_kill_nearby","sk_push_entity","sk_run_command","sk_drop_block_loot",
    "sk_if_permission","sk_if_gamemode","sk_if_world","sk_if_op","sk_if_sneaking","sk_if_flying",
    "sk_if_sprinting","sk_if_on_ground","sk_if_sleeping","sk_if_in_vehicle","sk_if_gliding","sk_if_swimming",
    "sk_if_health_below","sk_if_health_above","sk_if_food_below","sk_if_level_above",
    "sk_if_holding","sk_if_has_item","sk_if_wearing","sk_if_block_is",
  ]);

  const COND_TYPES = new Set([
    "sk_if_permission","sk_if_gamemode","sk_if_world","sk_if_op","sk_if_sneaking","sk_if_flying",
    "sk_if_sprinting","sk_if_on_ground","sk_if_sleeping","sk_if_in_vehicle","sk_if_gliding","sk_if_swimming",
    "sk_if_online","sk_if_health_below","sk_if_health_above","sk_if_food_below","sk_if_level_above",
    "sk_if_holding","sk_if_has_item","sk_if_wearing","sk_if_block_is","sk_if_block_at_is",
    "sk_if_var_equals","sk_if_var_num_equals","sk_if_var_greater","sk_if_var_less",
    "sk_if_var_set","sk_if_var_not_set",
  ]);

  const LOOP_TYPES = new Set(["sk_loop_players","sk_loop_times","sk_loop_list","sk_loop_entities","sk_while_var"]);

  function fv(b, n) { const f = b.getField(n); return f ? f.getValue() : ""; }

  function validate(workspace) {
    const errors = [], warnings = [];
    const tops = workspace.getTopBlocks(true);
    const definedFns = new Set();
    const calledFns = [];

    tops.forEach(root => {
      const isEvent  = EVENT_TYPES.has(root.type);
      const isFn     = root.type === "sk_function_def";
      const noPlayer = NO_PLAYER.has(root.type);

      // Floating block — NOT an event, function, or comment
      if (!isEvent && !isFn && root.type !== "sk_comment") {
        errors.push({ id:root.id,
          msg:"This block is floating with no event above it and will never run.",
          fix:"Place it under an Event block (orange)." });
      }

      if (isFn) definedFns.add(fv(root,"NAME"));

      let prev = null, inLoop = false, block = root;
      while (block) {
        const t = block.type;

        // else/else-if without matching if
        if ((t === "sk_else" || t === "sk_else_if_perm") && prev) {
          const prevOk = COND_TYPES.has(prev.type) || prev.type === "sk_else_if_perm";
          if (!prevOk) errors.push({ id:block.id,
            msg:`"${t === "sk_else" ? "else" : "else if"}" has no matching "if" directly above it.`,
            fix:"Place an If condition block directly before this." });
        }

        // Player block in no-player event
        if (isEvent && noPlayer && NEEDS_PLAYER.has(t)) {
          errors.push({ id:block.id,
            msg:`This block references "player" but the event has no player context.`,
            fix:"Use inside a player-triggered event (on join, on command, etc.)." });
        }

        // break/continue outside loop
        if ((t === "sk_exit_loop" || t === "sk_exit_loops" || t === "sk_continue") && !inLoop) {
          errors.push({ id:block.id,
            msg:`"${t.replace("sk_","").replace(/_/g," ")}" is not inside a loop.`,
            fix:"Place it inside a Loop block." });
        }

        // wait in sync event
        if (t === "sk_wait" || t === "sk_wait_ticks") {
          if (isEvent && !noPlayer) warnings.push({ id:block.id,
            msg:"\"wait\" in a synchronous event blocks the server thread.",
            fix:"Wrap in an \"async:\" block." });
        }

        // on move performance
        if (t === "sk_on_move" && block === root) {
          warnings.push({ id:block.id,
            msg:"\"on move\" fires hundreds of times per second.",
            fix:"Add an early-exit condition or cooldown variable." });
        }

        // empty command name
        if (t === "sk_on_command" || t === "sk_command_block") {
          const cmd = fv(block,"CMD").trim();
          if (!cmd) errors.push({ id:block.id, msg:"Command name is empty.", fix:"Enter a name like \"heal\"." });
          if (cmd.startsWith("/")) warnings.push({ id:block.id,
            msg:"Command starts with \"/\" — Skript adds this automatically.",
            fix:"Remove the leading slash." });
        }

        // divide by zero
        if (t === "sk_divide_var") {
          const amt = parseFloat(fv(block,"AMT"));
          if (amt === 0) errors.push({ id:block.id,
            msg:"Division by zero will crash Skript at runtime.",
            fix:"Set the divisor to a non-zero value." });
        }

        // ban/kick without permission check
        if (t === "sk_ban" || t === "sk_kick" || t === "sk_ip_ban") {
          let guarded = false;
          let s = root;
          while (s && s !== block) {
            if (s.type === "sk_if_permission" || s.type === "sk_if_op") guarded = true;
            s = s.getNextBlock();
          }
          if (!guarded) warnings.push({ id:block.id,
            msg:`"${t === "sk_ban" || t === "sk_ip_ban" ? "ban" : "kick"}" has no permission/op check above it.`,
            fix:"Add \"if has permission\" or \"if player is op\" before this." });
        }

        // Large explosion
        if (t === "sk_explosion" && parseFloat(fv(block,"PWR")) >= 6) {
          warnings.push({ id:block.id,
            msg:`Explosion force ${fv(block,"PWR")} is very destructive (TNT = 4).`,
            fix:"Lower the force or add a permission guard." });
        }

        if (t === "sk_function_call") calledFns.push({ id:block.id, name:fv(block,"NAME") });
        if (LOOP_TYPES.has(t)) inLoop = true;
        prev = block;
        block = block.getNextBlock();
      }
    });

    calledFns.forEach(({ id, name }) => {
      if (!definedFns.has(name)) errors.push({ id,
        msg:`Function "${name}()" is called but never defined in this workspace.`,
        fix:`Add a Function Definition block named "${name}".` });
    });

    return { errors, warnings };
  }

  return { validate };
})();