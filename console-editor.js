const tmp = require("tmp-promise");
const fs = require("fs");
const child_process = require("child_process");

tmp.setGracefulCleanup();

function execEditor(txt) {
	const tmpFile = tmp.fileSync();
	fs.writeSync(tmpFile.fd, txt);
	fs.close(tmpFile.fd);
	child_process.execFileSync(process.env.EDITOR, [tmpFile.name], {
		stdio: "inherit",
	});
	return fs.readFileSync(tmpFile.name).toString("utf8");
}

/**
 * Edits a function
 * @param {Function} fn
 */
function editFunction(fn) {
	let fnBody = fn.toString();
	let fnName = fn.name;

	if (!fnBody.match(/^function /)) {
		fnBody = `${fnName} = ${fnBody}`;
	}

	fnBody = execEditor(fnBody);

	(null, eval)(fnBody);
}

/**
 * Edit an object's property
 * @param {Object} obj
 * @param {String} prop
 */
function editObject(obj, prop) {
	let raw = obj[prop];

	if (typeof raw === "string") {
		// If it's JSON, try to format it nicely for editing:
		try {
			let json = JSON.parse(raw);
			raw = JSON.stringify(json, null, 2);
		} catch (err) {
			// nothing to do
		}

		raw = execEditor(raw);

		// Unformat if it's JSON:
		try {
			let json = JSON.parse(raw);
			raw = JSON.stringify(json);
		} catch (err) {
			// nothing to do
		}

		obj[prop] = raw;
	} else {
		try {
			raw = JSON.stringify(raw, null, 2);

			raw = execEditor(raw);

			obj[prop] = JSON.parse(raw);
		} catch (err) {
			// do nothing
		}
	}
}

function edit(...args) {
	if (args.length === 1 && typeof args[0] === "function") {
		return editFunction(args[0]);
	} else if (args.length === 2) {
		return editObject(args[0], args[1]);
	}
}

module.exports = edit;
