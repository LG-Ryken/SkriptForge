// SkriptForge — Profanity Filter
// Used for: usernames, script titles, comments in code
//














































window.SF_Filter = (function () {
  // Slurs/swears list — covers most common English ones + leet-speak variants
  const BLOCKED = [
    "fuck","shit","ass","bitch","cunt","dick","pussy","cock","bastard","damn","hell",
    "piss","crap","fag","faggot","nigger","nigga","kike","spic","chink","gook","wetback",
    "retard","tranny","dyke","whore","slut","twat","wanker","bollocks","arse","prick",
    "motherf","mf","stfu","wtf","gtfo","kys","kms",
    // Leet-speak variants
    "f4g","n1g","sh1t","@ss","b1tch","d1ck","c0ck","f**k","s**t","b****","c***",
  ];

  // Build regex: word boundary insensitive, handle common substitutions
  const RE = new RegExp(
    BLOCKED.map(w =>
      w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
       .replace(/a/gi,"[a@4]").replace(/e/gi,"[e3]")
       .replace(/i/gi,"[i1!]").replace(/o/gi,"[o0]")
       .replace(/s/gi,"[s$5]").replace(/u/gi,"[uü]")
    ).join("|"),
    "gi"
  );

  function check(str) {
    if (!str) return { ok: true };
    RE.lastIndex = 0;
    const match = RE.exec(str);
    if (match) return { ok: false, word: match[0] };
    return { ok: true };
  }

  return { check };
})();