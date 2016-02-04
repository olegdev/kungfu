<% if (word.length) { %>
	<ul>
		<% for(var i = 0; i < word.length; i++) { %><li><%= word[i].letter %></li><% } %>	
	</ul>
<% } else { %>
	<span class="hint"><%= messages.getByKey('word-hint') || "составьте слово" %></span>
<% } %>
