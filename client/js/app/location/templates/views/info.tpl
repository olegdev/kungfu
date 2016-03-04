<%= userAvatarView.print(data) %>
<table>
<tr><td><%= messages.getByKey("energy") %>:</td><td><%= data.timed.energy[0] %></td></tr>
<tr><td><%= messages.getByKey("league") %>:</td><td><%= leagues.getNameByIndex(data.rating.league) %></td></tr>
<tr>
	<td><%= messages.getByKey("rating") %>:</td>
	<td>
		<%= data.rating.place %>
		<% if (session.get('rating')) { %>
			 <% if (session.get('rating') > 0) { %> 
				<span class="green-text" style="font-size: 10px;">(+<%= session.get('rating') %>)</span>
			<% } else {%>
				<span class="red-text" style="font-size: 10px;">(<%= session.get('rating') %>)</span>
			<% } %>	
		<% } %>
	</td>
</tr>
<tr><td><%= messages.getByKey("all_fights") %>:</td><td><%= (data.counters.wins + data.counters.loses) %></td></tr>
<tr>
	<td><%= messages.getByKey("wins") %>:</td>
	<td>
		<%= data.counters.wins %>
		<% if (session.get('win_counts')) { %>
		<span class="green-text" style="font-size: 10px;">(+<%= session.get('win_counts') %>)</span>
		<% } %>
	</td>
</tr>
<tr>
	<td>
		<%= messages.getByKey("loses") %>:
	</td>
	<td>
		<%= data.counters.loses %>
		<% if (session.get('lose_counts')) { %>
		<span class="red-text" style="font-size: 10px;">(+<%= session.get('lose_counts') %>)</span>
		<% } %>
	</td>
</tr>
</table>