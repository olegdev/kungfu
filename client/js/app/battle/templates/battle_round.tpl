<span class="word"><%= myWord || "x" %></span>
<span id="round-timer"><%= Math.max(round.duration - Math.round(round.time / 1000), 0) || ".." %></span>
<span class="word"><%= enemyWord || "x" %></span>