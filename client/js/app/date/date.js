define([], function() {

	var serverTimerOffset;

	return {
		init: function(serverTimeNow) {
			serverTimerOffset = Date.now() - serverTimeNow;
		},
		normalizeServerTime: function(time) {
			return time + serverTimerOffset;
		}
	};
});
