exports.script = "<script>document.write('<script src=\"http://' + (location.host || 'localhost').split(':')[0] + ':" + 35729 + "/livereload.js\"></' + 'script>')</script>";

exports.getInjectHtml = function (html) {
	html = html.split('</body>');
	if (html.length === 1) {
		html = html[0] + exports.script;
	} else {
		html = html.join(exports.script + '</body>');
	}
	return html;
};
