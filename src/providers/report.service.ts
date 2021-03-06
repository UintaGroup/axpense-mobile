import { Injectable }       from '@angular/core';
import { Observable }       from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Report }           from '../models';
import { LocalDb }          from './local-db.service';
import { ExpenseService }   from './expense.service';

@Injectable()
export class ReportService {

	constructor(private _db: LocalDb, private _expenseSrvc: ExpenseService) {
	}

	public all$(): Observable<Report[]> {
		return Observable.fromPromise(this._db.queryWithArrayResult('SELECT * FROM reports ORDER BY id DESC')
			.then(rows => rows.map(row => Report.create(row))));
	}

	public save(report: Report): Promise<Report> {
		return this._db.insert(Report.tableName, report)
			.then(data => {
				let id: number = report.id > 0 ? report.id : data.res.insertId;
				report['_id'] = id;
				return report;
			});
	}

	public delete(report: Report): Promise<any> {
		return Promise.all([
			this._db.query(`DELETE FROM ${Report.tableName} WHERE id = ?`, [report.id]),
			this._expenseSrvc.deleteAll(report)
		]);
	}

	public submit(report: Report): Promise<any> {
		return new Promise(resolve => {

			setTimeout(
				() => {
					report.submitted();
					resolve(this.save(report));
				},
				4000);

		});
	}

}
