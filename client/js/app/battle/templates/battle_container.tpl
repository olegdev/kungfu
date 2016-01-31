<div id="battle">
	<div id="battle-enemy">
		<div class="field">
			<% for(var i = 0; i < fieldSize; i++) { %>
				<% for(var j = 0; j < fieldSize; j++) { %>
					<div class="cell <%= user.letters[i*fieldSize + j] ? "fill" : ""%>">
						<%= enemy.letters[i*fieldSize + j] %>
					</div>
				<% } %>	
			<% } %>
		</div>
	</div>
	<%= opponentsView.print(user.u, enemy.u) %>
	<div id="battle-user">
		<div class="field">
			<% for(var i = 0; i < fieldSize; i++) { %>
				<% for(var j = 0; j < fieldSize; j++) { %>
					<div class="cell <%= user.letters[fieldSize*fieldSize - 1 - i*fieldSize - j] ? "fill" : ""%>">
						<%= user.letters[fieldSize*fieldSize - 1 - i*fieldSize - j] %>
					</div>
				<% } %>	
			<% } %>
		</div>
	</div>
</div>