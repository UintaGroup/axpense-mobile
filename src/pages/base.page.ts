import { OnDestroy }    from '@angular/core';
import { Subject }      from 'rxjs/Subject';

export class BasePage implements OnDestroy {

	protected ngUnsubscribe: Subject<void> = new Subject<void>();

	public ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}