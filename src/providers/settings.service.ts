import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class SettingsService {

	settings: any;

	private _defaults: any;
	private SETTINGS_KEY: string = '_settings';

	constructor(public storage: Storage, defaults: any) {
		this._defaults = defaults;
	}

	load(): Promise<void> {
		return this.storage.get(this.SETTINGS_KEY)
			.then(value => {
				if (value) {
					this.settings = value;
					return this.mergeDefaults(this._defaults);
				} else {
					return this.setAll(this._defaults)
						.then(val => this.settings = val);
				}
			});
	}

	merge(settings: any) {
		for (let k in settings) {
			this.settings[k] = settings[k];
		}
		return this.save();
	}

	setValue(key: string, value: any) {
		this.settings[key] = value;
		return this.storage.set(this.SETTINGS_KEY, this.settings);
	}

	setAll(value: any) {
		return this.storage.set(this.SETTINGS_KEY, value);
	}

	getValue(key: string) {
		return this.storage.get(this.SETTINGS_KEY)
			.then(settings => settings[key]);
	}

	save() {
		return this.setAll(this.settings);
	}

	get allSettings() {
		return this.settings;
	}

	private mergeDefaults(defaults: any) {
		for (let k in defaults) {
			if (!(k in this.settings)) {
				this.settings[k] = defaults[k];
			}
		}
		return this.setAll(this.settings);
	}
}
