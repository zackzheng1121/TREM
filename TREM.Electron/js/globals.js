const Speech = require("speak-tts");

let setting, is_setting_disabled;

TREM.Resources = require(path.resolve(app.getAppPath(), "./Resources/Resources.js"));
TREM.speech = TREM.speech ?? new Speech.default();
setting = app.Configuration._data;

(async () => {
	await TREM.speech.init().then(data => {
		TREM.voices = data.voices;
		// console.log("Speech voices is ready", TREM.voices);

		for (const key of Object.keys(TREM.voices))
			if (TREM.voices[key].name == setting["audio.tts.voices"]) {
				TREM.speech.setLanguage(TREM.voices[key].lang);
				TREM.speech.setVoice(setting["audio.tts.voices"]);
				// console.log("Voices changed", TREM.voices[key]);
			}
	}).catch(e => {
		console.error("An error occured while initializing : ", e);
	});

	TREM.speech.setRate(1.8);
	// console.log("Speech is ready", TREM.speech);
})();

ipcRenderer.on("setting", (event, data) => {
	setting = data;
	is_setting_disabled = false;
});

ipcRenderer.once("setting", (event, data) => {
	TREM.Localization = new (require(path.resolve(app.getAppPath(), "./Localization/Localization.js")))(setting["general.locale"], window.navigator.language);
	init();
	setThemeColor(data["theme.color"], data["theme.dark"]);
	ipcRenderer.emit("config:color", data["theme.customColor"]);
	setLocale(data["general.locale"]);
});

ipcRenderer.on("config:theme", (event, value) => {
	setThemeColor(value, app.Configuration.data["theme.dark"]);
});

ipcRenderer.on("config:dark", (event, value) => {
	setThemeColor(value);
});

ipcRenderer.on("config:locale", (event, value) => {
	TREM.Localization.setLocale(value);
	setLocale(value);
});

let showDialog_run = false;

const lockScroll = state => {
	if (state)
		$(document).off("scroll", () => window.scrollTo(0, 0));
	else
		$(document).off("scroll");
};

const closeDialog = event => {
	const container = document.getElementById("modal-overlay");

	if (!event.target.id.includes("dialog"))
		if (event.target != container)
			return;

	if (showDialog_run) showDialog_run = false;
	lockScroll(false);
	$("#modal-overlay").fadeOut({ duration: 100, complete: () => container.replaceChildren() }).delay(100).show();
};

let showDialogtime;

const showDialog

/**
 * Callback for dialogs
 * @callback dialogCallback
 */
/**
 * Shows a dialog
 * @param {"success" | "warn" | "error"} type The dialog type, ignored whenm customIcon is set
 * @param {string} title The title of the dialog
 * @param {string} message The supporting text of the dialog
 * @param {0|1} button Button type of the dialog
 * @param {?string} customIcon The icon of the dialog
 * @param {?dialogCallback} callback The callback function to run when the user omitted the dialog
 * @param {string} buttonAccepttext The buttonAccepttext of the dialog
 * @param {string} buttonCanceltext The buttonCanceltext of the dialog
 * @param {?dialogCallback} callbackCancel The callbackCancel function to run when the user omitted the dialog
 * @param {int} time time type of the dialog
 * @param {int} containerlock containerlock type of the dialog
 */
= (type, title, message, button = 0, customIcon, callback = () => void 0, buttonAccepttext, buttonCanceltext, callbackCancel = () => void 0, time = 0, containerlock = 0, callbackEnd = () => void 0) => {
	if (showDialog_run) return;
	showDialog_run = true;
	const container = document.getElementById("modal-overlay");
	const icon = document.createElement("span");
	icon.classList.add("material-symbols-rounded");
	icon.classList.add("dialog-icon");
	icon.textContent = customIcon != undefined ? customIcon
		: (
			type == "success" ? "check"
				: (type == "warn" ? "warning"
					: "error")
		);

	const headline = document.createElement("span");
	headline.classList.add("dialog-headline");
	headline.textContent = title;

	const supportingText = document.createElement("span");
	supportingText.classList.add("dialog-supportText");
	supportingText.innerHTML = message;

	const dialog = document.createElement("div");
	dialog.classList.add("dialog");

	const buttons = document.createElement("div");
	buttons.classList.add("dialog-button");

	if (button == 1) {
		const Accept = document.createElement("button");
		Accept.classList.add("flat-button");
		Accept.id = "dialog-Accept " + title;
		Accept.textContent = buttonAccepttext ?? TREM.Localization.getString("Dialog_Button_Confirm");

		Accept.onclick = (...args) => {
			if (showDialogtime) {
				clearTimeout(showDialogtime);
				showDialogtime.close();
			}

			closeDialog(...args);
			callback();
		};

		buttons.appendChild(Accept);

		const Cancel = document.createElement("button");
		Cancel.classList.add("flat-button");
		Cancel.id = "dialog-Cancel";
		Cancel.textContent = buttonCanceltext ?? TREM.Localization.getString("Dialog_Button_Cancel");

		Cancel.onclick = (...args) => {
			if (showDialogtime) {
				clearTimeout(showDialogtime);
				showDialogtime.close();
			}

			closeDialog(...args);
			callbackCancel();
		};

		buttons.appendChild(Cancel);
	} else {
		const OK = document.createElement("button");
		OK.classList.add("flat-button");
		OK.id = "dialog-OK";
		OK.textContent = buttonAccepttext ?? TREM.Localization.getString("Dialog_Button_OK");
		OK.onclick = closeDialog;

		OK.onclick = (...args) => {
			if (showDialogtime) {
				clearTimeout(showDialogtime);
				showDialogtime.close();
			}

			closeDialog(...args);
			callback();
		};

		buttons.appendChild(OK);
	}

	dialog.appendChild(icon);
	dialog.appendChild(headline);
	dialog.appendChild(supportingText);
	dialog.appendChild(buttons);
	container.appendChild(dialog);

	if (containerlock == 0)
		container.onclick = (...args) => {
			if (showDialogtime) {
				clearTimeout(showDialogtime);
				showDialogtime.close();
			}

			closeDialog(...args);
			callbackEnd();
		};

	$("#modal-overlay").fadeIn(50);

	buttons.querySelector(":last-child").contentEditable = true;
	buttons.querySelector(":last-child").focus();
	buttons.querySelector(":last-child").contentEditable = false;
	lockScroll(true);

	if (time != 0) {
		time = time * 1000;
		showDialogtime = setTimeout((...args) => {
			lockScroll(false);
			$("#modal-overlay").fadeOut({ duration: 100, complete: () => container.replaceChildren() }).delay(100).show();
		}, time);
	}
};


// #region override prototype
if (!Date.prototype.format)
	Date.prototype.format

	/**
	 * Format DateTime into string with provided formatting string.
	 * @param {string} format The formatting string to use.
	 * @returns {string} The formatted string.
	 */
	= function(format) {

			/**
		 * @type {Date}
		 */
			const me = this;
			return format.replace(/a|A|Z|S(SS)?|ss?|mm?|HH?|hh?|D{1,2}|M{1,2}|YY(YY)?|'([^']|'')*'/g, (str) => {
				let c1 = str.charAt(0);
				const ret = str.charAt(0) == "'"
					? (c1 = 0) || str.slice(1, -1).replace(/''/g, "'")
					: str == "a"
						? (me.getHours() < 12 ? "am" : "pm")
						: str == "A"
							? (me.getHours() < 12 ? "AM" : "PM")
							: str == "Z"
								? (("+" + -me.getTimezoneOffset() / 60).replace(/^\D?(\D)/, "$1").replace(/^(.)(.)$/, "$10$2") + "00")
								: c1 == "S"
									? me.getMilliseconds()
									: c1 == "s"
										? me.getSeconds()
										: c1 == "H"
											? me.getHours()
											: c1 == "h"
												? (me.getHours() % 12) || 12
												: c1 == "D"
													? me.getDate()
													: c1 == "m"
														? me.getMinutes()
														: c1 == "M"
															? me.getMonth() + 1
															: ("" + me.getFullYear()).slice(-str.length);
				return c1 && str.length < 4 && ("" + ret).length < str.length
					? ("00" + ret).slice(-str.length)
					: ret;
			});
		};

if (!String.prototype.format)
	String.prototype.format = function() {
		const args = arguments;
		return this.replace(/{(\d+)}/g, (match, number) => typeof args[number] != "undefined"
			? args[number]
			: match,
		);
	};

const ver = "1.0.0";

const storage = {
	init: () => {
		try {
			let json = JSON.parse(localStorage.Config);

			if (json.ver != ver) json = { ver };
			localStorage.Config = JSON.stringify(json);
			return json;
		} catch (err) {
			localStorage.Config = JSON.stringify({});
			return false;
		}
	},
	getItem: (key) => {
		try {
			const json = JSON.parse(localStorage.Config);
			return json[key];
		} catch (err) {
			return false;
		}
	},
	setItem: (key, value) => {
		try {
			const json = JSON.parse(localStorage.Config);
			json[key] = value;
			localStorage.Config = JSON.stringify(json);
			return true;
		} catch (err) {
			return false;
		}
	},
	getAll: () => {
		try {
			const json = JSON.parse(localStorage.Config);
			return json;
		} catch (err) {
			return false;
		}
	},
	removeItem: (key) => {
		try {
			const json = JSON.parse(localStorage.Config);
			delete json[key];
			localStorage.Config = JSON.stringify(json);
			return true;
		} catch (err) {
			return false;
		}
	},
	clear: () => {
		try {
			localStorage.Config = JSON.stringify({});
			return true;
		} catch (err) {
			return false;
		}
	},
};

storage.init();

// #endregion