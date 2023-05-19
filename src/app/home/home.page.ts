import { Component, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { webSocket } from 'rxjs/webSocket';
import { AlphaVantageService } from '../services/alpha-vantage.service';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FinnHubService } from '../services/finn-hub.service';
import { Observable } from 'rxjs';
import { InputLiveUpdateDirective } from '../directives/input-live-update.directive';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  styles: [`.form-control { width: 300px; }`]
})
export class HomePage {
  @ViewChild('chartContainer', { static: false }) chartContainer: any;
  
  symbolStock: string = '';
  stockDetails: any;
  rawData: any;
  filterDate: string = '';
  filterPeriod: number = 0;
  filteredData: any[] = [];
  resultSwapper: any = '';
  updatedSymbol: string = '';
  isDarkTheme = false;

  constructor(private alphaVantageService: AlphaVantageService, 
    private http: HttpClient, 
    private finnHubService: FinnHubService, 
    private alertController: AlertController) {}

    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
  
      if (this.isDarkTheme) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }

  handleInputChange(event: any) {
    this.updatedSymbol = event.target.value;
    console.log(this.updatedSymbol);
  }
  getStockDetails() {

    this.alphaVantageService.getStockDetails(this.updatedSymbol).subscribe((data) => {
      this.rawData = data;
      this.stockDetails = {
        date: data['Time Series (Daily)'][Object.keys(data['Time Series (Daily)'])[0]]['1. open'],
        open: data['Time Series (Daily)'][Object.keys(data['Time Series (Daily)'])[0]]['1. open'],
        high: data['Time Series (Daily)'][Object.keys(data['Time Series (Daily)'])[0]]['2. high'],
        close: data['Time Series (Daily)'][Object.keys(data['Time Series (Daily)'])[0]]['4. close'],
        volume: data['Time Series (Daily)'][Object.keys(data['Time Series (Daily)'])[0]]['5. volume'],
        adjustedClose: data['Time Series (Daily)'][Object.keys(data['Time Series (Daily)'])[0]]['5. adjusted close'],
        dividendAmount: data['Time Series (Daily)'][Object.keys(data['Time Series (Daily)'])[0]]['7. dividend amount'],
        splitCoefficient: data['Time Series (Daily)'][Object.keys(data['Time Series (Daily)'])[0]]['8. split coefficient'],
      };
      this.filteredData = this.getFilteredData();
    });
  }

  sortBy(property: string) {
    this.filteredData.sort((a, b) => (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0));
  }

  getFilteredData() {
    let data = [];
    for (let key in this.rawData['Time Series (Daily)']) {
      let obj = {
        date: key,
        open: this.rawData['Time Series (Daily)'][key]['1. open'] || '',
        high: this.rawData['Time Series (Daily)'][key]['2. high'] || '',
        close: this.rawData['Time Series (Daily)'][key]['4. close'] || '',
        volume: this.rawData['Time Series (Daily)'][key]['5. volume'] || '',
        adjustedClose: this.rawData['Time Series (Daily)'][key]['5. adjusted close'] || '',
        dividendAmount: this.rawData['Time Series (Daily)'][key]['7. dividend amount'] || '',
        splitCoefficient: this.rawData['Time Series (Daily)'][key]['8. split coefficient'] || '', 
      };
      data.push(obj);
    }
    if (this.filterDate) {
      data = data.filter((d) => d.date === this.filterDate);
    }
    if (this.filterPeriod) {
      data = data.slice(0, this.filterPeriod);
    }
    return data;
  }

  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(term =>
      this.finnHubService.searchSymbols(term)
      
    )
  )

formatResult(result: any): string {
  return `${result.symbol} - ${result.description}`;
}


formatInput(item: any): string {
  return item.symbol;
}

clearSearch() {
  this.symbolStock = '';
  this.stockDetails = null;
  this.rawData = null;
  this.filterDate = '';
  this.filterPeriod = 0;
  this.filteredData = [];
  this.resultSwapper = '';
  this.updatedSymbol = '';
  }

async presentAlert() {
  const alert = await this.alertController.create({
    header: 'Em construção',
    subHeader: 'Em desenvolvimento...',
    message: 'Volte em breve!',
    buttons: ['OK'],
  });

  await alert.present();
}


 

 

}
