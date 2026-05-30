// SkriptForge — Validator
window.SF_Validator = (function () {
  "use strict";

  const EVENT_TYPES = new Set([
    "sk_on_join","sk_on_quit","sk_on_chat","sk_on_death","sk_on_respawn",
    "sk_on_damage","sk_on_heal","sk_on_break","sk_on_place","sk_on_right_click",
    "sk_on_left_click","sk_on_item_drop","sk_on_item_pickup","sk_on_consume",
    "sk_on_craft","sk_on_inventory_click","sk_on_entity_spawn","sk_on_entity_death",
    "sk_on_projectile_hit","sk_on_server_start","sk_on_server_stop","sk_on_move",
    "sk_on_sneak","sk_on_sprint","sk_on_command","sk_every_x_seconds","sk_function_def",
  ]);

  // Events with no "player" variable
  const NO_PLAYER = new Set([
    "sk_on_server_start","sk_on_server_stop","sk_every_x_seconds",
    "sk_on_entity_spawn","sk_on_entity_death","sk_on_projectile_hit",
  ]);

  // Blocks that reference "player"
  const NEEDS_PLAYER = new Set([
    "sk_send_message","sk_send_title","sk_send_subtitle","sk_send_actionbar",
    "sk_set_gamemode","sk_set_health","sk_heal","sk_set_food","sk_add_xp",
    "sk_set_level","sk_set_fly","sk_teleport_spawn","sk_teleport_coords",
    "sk_give_item","sk_remove_item","sk_clear_inventory","sk_kick","sk_ban",
    "sk_op","sk_deop","sk_spawn_particle","sk_play_sound","sk_apply_effect",
    "sk_remove_effect","sk_clear_effects","sk_set_block","sk_explosion",
    "sk_lightning","sk_spawn_mob","sk_run_command","sk_if_permission",
    "sk_if_gamemode","sk_if_world","sk_if_health_below","sk_if_health_above",
    "sk_if_food_below","sk_if_op","sk_if_sneaking","sk_if_flying",
    "sk_if_sprinting","sk_if_on_ground","sk_if_holding","sk_if_has_item",
    "sk_if_block_is",
  ]);

  const COND_TYPES = new Set([
    "sk_if_permission","sk_if_gamemode","sk_if_world","sk_if_health_below",
    "sk_if_health_above","sk_if_food_below","sk_if_online","sk_if_op",
    "sk_if_sneaking","sk_if_flying","sk_if_sprinting","sk_if_on_ground",
    "sk_if_holding","sk_if_has_item","sk_if_block_is","sk_if_var_equals",
    "sk_if_var_greater","sk_if_var_less","sk_if_var_set",
  ]);

  const LOOP_TYPES = new Set(["sk_loop_players","sk_loop_times","sk_loop_list"]);

  function fv(block, name) {
    const f = block.getField(name);
    return f ? f.getValue() : "";
  }

  function validate(workspace) {
    const errors = [], warnings = [];
    const topBlocks = workspace.getTopBlocks(true);
    const definedFns = new Set();
    const calledFns  = [];

    topBlocks.forEach(root => {
      const isEvent    = EVENT_TYPES.has(root.type);
      const isFn       = root.type === "sk_function_def";
      const noPlayer   = NO_PLAYER.has(root.type);

      // Floating block (not an event or function)
      if (!isEvent && !isFn) {
        errors.push({
          id: root.id,
          msg: `This block has no event above it and will never run.`,
          fix: `Attach it under an Event block (orange).`,
        });
      }

      if (isFn) definedFns.add(fv(root, "NAME"));

      let prev = null;
      let inLoop = false;
      let block = root;

      while (block) {
        const t = block.type;

        // else/else-if without preceding if
        if ((t === "sk_else" || t === "sk_else_if_perm") && prev && !COND_TYPES.has(prev.type) && prev.type !== "sk_else_if_perm") {
          errors.push({
            id: block.id,
            msg: `"${t === "sk_else" ? "else" : "else if"}" has no matching "if" block directly above it.`,
            fix: `Place an If condition block directly before this.`,
          });
        }

        // Player block in no-player event
        if (isEvent && noPlayer && NEEDS_PLAYER.has(t)) {
          errors.push({
            id: block.id,
            msg: `This block uses "player" but the event "${root.type.replace("sk_on_","").replace(/_/g," ")}" has no player.`,
            fix: `Use this inside a player-triggered event (on join, on command, etc.).`,
          });
        }

        // break/continue outside a loop
        if ((t === "sk_exit_loop" || t === "sk_continue") && !inLoop) {
          warnings.push({
            id: block.id,
            msg: `"${t === "sk_exit_loop" ? "exit loop" : "continue"}" is not inside a loop — it will error.`,
            fix: `Place it inside a Loop block.`,
          });
        }

        // wait in sync event
        if (t === "sk_wait" && isEvent && !noPlayer) {
          warnings.push({
            id: block.id,
            msg: `"wait" in a synchronous event blocks the server thread.`,
            fix: `Wrap delayed logic in an "async:" block.`,
          });
        }

        // high-frequency event warning
        if (t === "sk_on_move" && block === root) {
          warnings.push({
            id: block.id,
            msg: `"on move" fires hundreds of times per second. Heavy logic here will hurt performance.`,
            fix: `Add an early-exit condition or cooldown variable.`,
          });
        }

        // empty command name
        if (t === "sk_on_command") {
          const cmd = fv(block, "CMD").trim();
          if (!cmd) {
            errors.push({ id: block.id, msg: `Command name is empty.`, fix: `Enter a command name, e.g. "heal".` });
          }
          if (cmd.startsWith("/")) {
            warnings.push({ id: block.id, msg: `Command starts with "/" — Skript adds this automatically.`, fix: `Remove the leading slash.` });
          }
        }

        // division by zero
        if (t === "sk_set_var_num") {
          const val = fv(block, "VAL");
          // not a divide, just catch NaN
        }

        // ban/kick without permission
        if (t === "sk_ban" || t === "sk_kick") {
          let guarded = false;
          let scan = root;
          while (scan && scan !== block) {
            if (scan.type === "sk_if_permission" || scan.type === "sk_if_op") guarded = true;
            scan = scan.getNextBlock();
          }
          if (!guarded) {
            warnings.push({
              id: block.id,
              msg: `"${t === "sk_ban" ? "ban" : "kick"}" has no permission or op check above it.`,
              fix: `Add "if player has permission" or "if player is op" before this.`,
            });
          }
        }

        // high explosion
        if (t === "sk_explosion") {
          const pwr = parseFloat(fv(block, "PWR"));
          if (pwr >= 6) {
            warnings.push({
              id: block.id,
              msg: `Explosion force ${pwr} is very destructive (vanilla TNT = 4).`,
              fix: `Lower the force or add a permission check.`,
            });
          }
        }

        // function calls
        if (t === "sk_function_call") calledFns.push({ id: block.id, name: fv(block, "NAME") });

        if (LOOP_TYPES.has(t)) inLoop = true;
        prev = block;
        block = block.getNextBlock();
      }
    });

    // undefined function calls
    calledFns.forEach(({ id, name }) => {
      if (!definedFns.has(name)) {
        errors.push({
          id,
          msg: `Function "${name}()" is called but never defined in this workspace.`,
          fix: `Add a Function Definition block named "${name}".`,
        });
      }
    });

    return { errors, warnings };
  }

  return { validate };
})();