// SkriptForge — Validator
window.SF_Validator = (function () {
  "use strict";

  const EVENT_TYPES = new Set([
    "sk_on_join","sk_on_quit","sk_on_chat","sk_on_death","sk_on_respawn","sk_on_damage",
    "sk_on_heal","sk_on_break","sk_on_place","sk_on_right_click","sk_on_left_click",
    "sk_on_item_drop","sk_on_item_pickup","sk_on_consume","sk_on_craft",
    "sk_on_inventory_click","sk_on_entity_spawn","sk_on_entity_death","sk_on_projectile_hit",
    "sk_on_server_start","sk_on_server_stop","sk_on_move","sk_on_sneak","sk_on_sprint",
    "sk_on_command","sk_every_x_seconds","sk_function_def",
  ]);

  const NO_PLAYER = new Set([
    "sk_on_server_start","sk_on_server_stop","sk_every_x_seconds",
    "sk_on_entity_spawn","sk_on_entity_death","sk_on_projectile_hit",
  ]);

  const NEEDS_PLAYER = new Set([
    "sk_send_message","sk_send_title","sk_send_subtitle","sk_send_actionbar",
    "sk_set_gamemode","sk_set_health","sk_heal","sk_set_food","sk_add_xp",
    "sk_set_level","sk_set_fly","sk_teleport_spawn","sk_teleport_coords",
    "sk_give_item","sk_remove_item","sk_clear_inventory","sk_kick","sk_ban",
    "sk_op","sk_deop","sk_spawn_particle","sk_play_sound","sk_apply_effect",
    "sk_remove_effect","sk_clear_effects","sk_set_block","sk_explosion",
    "sk_lightning","sk_spawn_mob","sk_run_command",
    "sk_if_permission","sk_if_gamemode","sk_if_world","sk_if_health_below",
    "sk_if_health_above","sk_if_food_below","sk_if_op","sk_if_sneaking",
    "sk_if_flying","sk_if_sprinting","sk_if_on_ground","sk_if_holding","sk_if_has_item",
  ]);

  const COND_TYPES = new Set([
    "sk_if_permission","sk_if_gamemode","sk_if_world","sk_if_health_below",
    "sk_if_health_above","sk_if_food_below","sk_if_online","sk_if_op",
    "sk_if_sneaking","sk_if_flying","sk_if_sprinting","sk_if_on_ground",
    "sk_if_holding","sk_if_has_item","sk_if_block_is","sk_if_var_equals",
    "sk_if_var_greater","sk_if_var_less","sk_if_var_set",
  ]);

  const LOOP_TYPES = new Set(["sk_loop_players","sk_loop_times","sk_loop_list"]);

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

      if (!isEvent && !isFn) {
        errors.push({ id: root.id,
          msg: "Block is floating — it has no event and will never run.",
          fix: "Attach it under an Event block (orange)." });
      }

      if (isFn) definedFns.add(fv(root, "NAME"));

      let prev = null, inLoop = false, block = root;
      while (block) {
        const t = block.type;

        // else without if
        if ((t === "sk_else" || t === "sk_else_if_perm") && prev && !COND_TYPES.has(prev.type) && prev.type !== "sk_else_if_perm") {
          errors.push({ id: block.id,
            msg: `"${t === "sk_else" ? "else" : "else if"}" has no matching "if" directly above it.`,
            fix: "Place an If condition block directly before this." });
        }

        // player block in no-player event
        if (isEvent && noPlayer && NEEDS_PLAYER.has(t)) {
          errors.push({ id: block.id,
            msg: `Uses "player" but "${root.type.replace("sk_on_","").replace(/_/g," ")}" has no player context.`,
            fix: "Use inside a player-triggered event (on join, on command, etc.)." });
        }

        // break/continue outside loop
        if ((t === "sk_exit_loop" || t === "sk_continue") && !inLoop) {
          warnings.push({ id: block.id,
            msg: `"${t === "sk_exit_loop" ? "exit loop" : "continue"}" is outside a loop.`,
            fix: "Place it inside a Loop block." });
        }

        // wait in sync context
        if (t === "sk_wait" && isEvent && !noPlayer) {
          warnings.push({ id: block.id,
            msg: "\"wait\" in a sync event blocks the server thread.",
            fix: "Wrap in an \"async:\" block." });
        }

        // on move performance
        if (t === "sk_on_move" && block === root) {
          warnings.push({ id: block.id,
            msg: "\"on move\" fires hundreds of times per second.",
            fix: "Add an early-exit condition or cooldown variable." });
        }

        // empty command
        if (t === "sk_on_command" && !fv(block, "CMD").trim()) {
          errors.push({ id: block.id, msg: "Command name is empty.", fix: "Enter a name like \"heal\"." });
        }
        if (t === "sk_on_command" && fv(block, "CMD").trim().startsWith("/")) {
          warnings.push({ id: block.id, msg: "Command starts with \"/\" — Skript adds this automatically.", fix: "Remove the leading slash." });
        }

        // ban/kick without guard
        if (t === "sk_ban" || t === "sk_kick") {
          let guarded = false;
          let s = root;
          while (s && s !== block) { if (s.type === "sk_if_permission" || s.type === "sk_if_op") guarded = true; s = s.getNextBlock(); }
          if (!guarded) warnings.push({ id: block.id,
            msg: `"${t === "sk_ban" ? "ban" : "kick"}" has no permission check above it.`,
            fix: "Add \"if has permission\" or \"if player is op\" before this." });
        }

        // big explosion
        if (t === "sk_explosion" && parseFloat(fv(block,"PWR")) >= 6) {
          warnings.push({ id: block.id,
            msg: `Explosion force ${fv(block,"PWR")} is very destructive (TNT = 4).`,
            fix: "Lower the force or add a permission check." });
        }

        // function calls
        if (t === "sk_function_call") calledFns.push({ id: block.id, name: fv(block,"NAME") });

        if (LOOP_TYPES.has(t)) inLoop = true;
        prev = block;
        block = block.getNextBlock();
      }
    });

    // undefined function calls
    calledFns.forEach(({ id, name }) => {
      if (!definedFns.has(name))
        errors.push({ id, msg: `Function "${name}()" is called but never defined.`, fix: `Add a Function Definition block named "${name}".` });
    });

    return { errors, warnings };
  }

  return { validate };
})();