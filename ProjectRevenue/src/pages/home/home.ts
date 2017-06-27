import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { enableProdMode } from "@angular/core";
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { Injectable } from '@angular/core';
import { HttpModule } from "@angular/http";
import 'rxjs/add/operator/map';
import { bootstrap } from 'angular2/platform/browser';
import { HTTP_PROVIDERS } from 'angular2/http';
import { AppComponent } from './app.component';
import { LoadingController } from 'ionic-angular';

import moment from 'moment';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

@Injectable()
export class HomePage {
    POSPGetRevenueId: any;
    RevenueStores: any;
    RevenueOnlineHomeDelivery: any;
    apiData: any;
    RevenueOnlineStoreDelivery: any;
    TotalRevenue: any;
    LastTicketTimeStamp: any;
    LastProcessedOrder: any;
    dateFrom: any;
    dateTo: any;
    logicalVar: any;
    timeTo: any;
    timeFrom: any;

    constructor(public navCtrl: NavController, public http: Http, public loadingController: LoadingController) {
        this.logicalVar = true;

        this.dateFrom = moment(new Date().toISOString()).format("YYYY-MM-DD");
        this.dateTo = moment(new Date()).add(1, "days").toISOString();
        this.dateTo = moment(this.dateTo).format("YYYY-MM-DD");

        console.log(new Date().toISOString());

        this.timeTo = new Date();
        this.timeTo.setHours(0, 0, 0, 0);
        this.timeTo=moment(this.timeTo).format();

        this.timeFrom = new Date();
        this.timeFrom.setHours(0, 0, 0, 0);
        this.timeFrom = moment(this.timeFrom).format();

        console.log(this.dateFrom);
        console.log(this.dateTo);

    }

    fct_get() {
        this.logicalVar = false;
        var dDateFrom = new String();
        var dDateTo = new String();

        dDateFrom = moment(this.dateFrom).format("YYYY-MM-DD").toString() + "T" + moment(this.timeFrom).format("HH:mm").toString() + ":00.000Z";
        dDateTo = moment(this.dateTo).format("YYYY-MM-DD").toString() + "T" + moment(this.timeTo).format("HH:mm").toString() + ":00.000Z";

        console.log(dDateFrom);
        console.log(dDateTo);

        let loading = this.loadingController.create({ content: "Working,please wait..." });
        loading.present();

        let myHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: myHeaders });

        let json = {
            request:
            {
                //iptToDateTime: "20/11/2016 14:21:00,000+00:00"
                iptFromDateTime: dDateFrom,
                iptToDateTime: dDateTo
            }
        };

        var response = this.http.put('http://bpm-tst.macintoshfashion.be.lan:8080/POSPInterfaceService/rest/POSPInterfaceService/SIPOSPGetRevenue/GetOrderRevenue', JSON.stringify(json), options)
            .map(res => res.json())
            .subscribe(
            data => {

                this.apiData = data.response.dsSIPOSPGetRevenue.dsSIPOSPGetRevenue.ttSIPOSPGetRevenue[0];
                console.log(this.apiData);
                loading.dismissAll();
                this.set_fields();
            }, err => {
                loading.dismissAll();
                alert(err);
            }
            );
    }


    set_fields() {
        this.RevenueStores =this.apiData.RevenueStores;
        this.RevenueOnlineHomeDelivery =this.apiData.RevenueOnlineHomeDelivery;
        this.RevenueOnlineStoreDelivery =this.apiData.RevenueOnlineStoreDelivery;
        this.TotalRevenue =this.apiData.TotalRevenue;
        if (this.apiData.LastTicketTimeStamp != null)
            this.LastTicketTimeStamp = this.apiData.LastTicketTimeStamp;
        else
            this.LastTicketTimeStamp = "-";
        if (this.apiData.LastProcessedOrder != null)
            this.LastProcessedOrder = this.apiData.LastProcessedOrder;
        else
            this.LastProcessedOrder = "-";
    }


    ClearFields() {
        this.RevenueStores = "";
        this.RevenueOnlineHomeDelivery = "";
        this.RevenueOnlineStoreDelivery = "";
        this.TotalRevenue = "";
            this.LastTicketTimeStamp = "";
            this.LastProcessedOrder = "";
    }


}