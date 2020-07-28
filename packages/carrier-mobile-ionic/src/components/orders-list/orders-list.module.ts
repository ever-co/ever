import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { OrdersListComponent } from './orders-list.component';
import { GeoLocationOrdersService } from '../../services/geo-location-order.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeoLocationService } from '../../services/geo-location.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	imports: [CommonModule, IonicModule, TranslateModule.forChild()],
	declarations: [OrdersListComponent],
	entryComponents: [OrdersListComponent],
	exports: [OrdersListComponent],
	providers: [GeoLocationOrdersService, Geolocation, GeoLocationService],
})
export class OrdersListModule {}
