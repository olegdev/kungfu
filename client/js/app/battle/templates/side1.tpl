<% for(var i = fieldSize.rows-1; i >= 0; i--) { %>
	<% for(var j = 0; j < fieldSize.columns; j++) { %>
		<div class="cell" data-index="<%= i + ' ' + j %>">
			<% if (field[i][j].letter) { %>
				<div class="letter"><%= field[i][j].letter %></div>
			<% } %>
		</div>
	<% } %>	
<% } %>	