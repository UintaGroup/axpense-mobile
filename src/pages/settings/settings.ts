import { Component }                from '@angular/core';
import { FormBuilder, FormGroup }   from '@angular/forms';

import { SettingsService }          from '../../providers';

@Component({
	selector: 'page-settings',
	templateUrl: './settings.html'
})
export class SettingsPage {

	public form: FormGroup;
	public settingsReady: boolean = false;

	constructor(private _settings: SettingsService, private _formBuilder: FormBuilder) {
	}

	private buildForm(settings: any): void {
		this.form = this._formBuilder.group({
			saveReceiptToGallery: [settings.saveReceiptToGallery],
			receiptImageQuality: [settings.receiptImageQuality],
			reportDuration: [settings.reportDuration]
		});
		this.form.valueChanges.subscribe(() => this._settings.merge(this.form.value));
	}

	public ionViewDidLoad(): void {
		this.form = this._formBuilder.group({});
	}

	public ionViewWillEnter(): Promise<any> {
		return this._settings.load()
			.then(() => {
				this.settingsReady = true;
				this.buildForm(this._settings.allSettings);
			});
	}
}
