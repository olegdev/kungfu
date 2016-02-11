<%= userAvatarView.print(data) %>
<table>
<tr><td><%= messages.getByKey("energy") %>:</td><td><%= data.timed.energy[0] %></td></tr>
<tr><td><%= messages.getByKey("rating") %>:</td><td><%= data.stats.rating %></td></tr>
<tr><td><%= messages.getByKey("all_fights") %>:</td><td><%= (data.stats.wins + data.stats.loses) %></td></tr>
<tr>
	<td><%= messages.getByKey("wins") %>:</td>
	<td>
		<%= data.stats.wins %>
		<% if (session.get('win_counts')) { %>
		<span style="font-size: 14px; color: #1ECA1E;">(+<%= session.get('win_counts') %>)</span>
		<% } %>
	</td>
</tr>
<tr>
	<td>
		<%= messages.getByKey("loses") %>:
	</td>
	<td>
		<%= data.stats.loses %>
		<% if (session.get('lose_counts')) { %>
		<span style="font-size: 14px; color: #E89B62;">(+<%= session.get('lose_counts') %>)</span>
		<% } %>
	</td>
</tr>
</table>