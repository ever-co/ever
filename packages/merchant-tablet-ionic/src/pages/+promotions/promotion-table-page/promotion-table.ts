import { OnInit, OnDestroy, Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { IPromotion } from '@modules/server.common/interfaces/IPromotion';
import { Subject } from 'rxjs';
import { PromotionService } from 'services/promotion.service';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { PromotionMutation } from '../promotion-mutation-popup/promotion-mutation';
import { ProductLocalesService } from '@modules/client.common.angular2/locale/product-locales.service';

@Component({
	selector: 'promotion-table',
	templateUrl: 'promotion-table.html',
	styleUrls: ['./promotion-table.scss'],
})
export class PromotionTable implements OnInit, OnDestroy {
	settingsSmartTable: object;
	showNoPromotionsIcon: boolean = false;

	promotions: IPromotion[];

	sourceSmartTable = new LocalDataSource();
	slectedPromotions: IPromotion[];

	private _ngDestroy$ = new Subject<void>();

	constructor(
		private readonly promotionsService: PromotionService,
		private readonly productLocaleService: ProductLocalesService,
		private readonly translateService: TranslateService,
		public modalCtrl: ModalController
	) {}

	ngOnInit(): void {
		this._loadPromotions();
		this._applyTranslationOnSmartTable();
	}

	ngOnDestroy() {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
	}

	private _loadPromotions() {
		this.promotionsService
			.getAll()
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((promotionsRes) => {
				this.promotions = promotionsRes.promotions || [];

				this._loadSettingsSmartTable();
				this._loadDataSmartTable();

				this.promotions.length === 0
					? (this.showNoPromotionsIcon = true)
					: (this.showNoPromotionsIcon = false);
			});
	}

	private _loadSettingsSmartTable() {
		this.settingsSmartTable = {
			mode: 'external',
			edit: {
				editButtonContent: '<i class="fa fa-edit"></i>',
				confirmEdit: true,
			},
			delete: {
				deleteButtonContent: '<i class="fa fa-trash"></i>',
				confirmDelete: true,
			},
			columns: {
				//tstodo add translations
				title: {
					title: 'Title',
					type: 'string',
				},
				active: {
					title: 'Status',
					type: 'boolean',
				},
				activeFrom: {
					title: 'Active From',
					type: 'date',
				},
				activeTo: {
					title: 'Active To',
					type: 'date',
				},
				purchasesCount: {
					title: 'Purchases num',
					type: 'number',
				},
			},
		};
	}

	async openAddPromotion() {
		const addPromotionPopup = await this.modalCtrl.create({
			component: PromotionMutation,
		});

		await addPromotionPopup.present();

		await addPromotionPopup.onDidDismiss();

		this._loadPromotions();
	}

	private _applyTranslationOnSmartTable() {
		this.translateService.onLangChange
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe(() => {
				this._loadSettingsSmartTable();
				this._loadDataSmartTable();
			});
	}

	private _loadDataSmartTable() {
		const promotionsVM = this.promotions.map((promotion) => {
			return {
				title: this.productLocaleService.getTranslate(promotion.title),
				active: promotion.active,
				activeFrom: promotion.activeFrom,
				activeTo: promotion.activeTo,
				purchasesCount: promotion.purchasesCount,
			};
		});

		this.sourceSmartTable.load(promotionsVM);
	}

	editPromotion() {}

	deletePromotion() {}
}
