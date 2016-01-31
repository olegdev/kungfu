<%= userAvatarView.print(data) %>
<table>
<tr><td><%= messages.getByKey("energy") %>:</td><td><%= data.timed.energy[0] %></td></tr>
<tr><td><%= messages.getByKey("rating") %>:</td><td><%= data.stats.rating %></td></tr>
<tr><td><%= messages.getByKey("all_fights") %>:</td><td><%= (data.stats.wins + data.stats.loses) %></td></tr>
<tr><td><%= messages.getByKey("wins") %>:</td><td><%= data.stats.wins %></td></tr>
<tr><td><%= messages.getByKey("loses") %>:</td><td><%= data.stats.loses %></td></tr>
</table>