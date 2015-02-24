HanulBlog.List = CLASS({

	preset : function() {
		'use strict';

		return VIEW;
	},

	init : function(inner, self) {
		'use strict';

		var
		// wrapper
		wrapper = DIV({
			c : 'List'
		}).appendTo(HanulBlog.Layout.getContent());

		inner.on('close', function() {
			wrapper.remove();
		});
	}
});
