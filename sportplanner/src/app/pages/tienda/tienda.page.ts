import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.page.html',
  styleUrls: ['./tienda.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // 👈 permite usar <swiper-container> sin error
})
export class TiendaPage {
  productosDecathlon = [
    {
      nombre: 'Zapatillas Running Mujer - KS900 Light Coral',
      imagen: 'https://contents.mediadecathlon.com/p2603078/k$520be08a7f7a03d2461b292bd28e29dc/zapatilas-running-mujer-kiprun-ks900-light-rojo-coral.jpg',
      url: 'https://www.decathlon.cl/p/326074-65171-zapatillas-running-mujer-ks900-light-coral.html',
      precio: '$100.000',
    },
    {
      nombre: 'Zapatillas Running Hombre KS900 Light Gris Amarillo',
      imagen: 'https://contents.mediadecathlon.com/p2603107/1cr1/k$f55bc6183c8bc32aaa71a26886893feb/zapatillas-running-hombre-kiprun-ks900-light-gris-amarillo.jpg?format=auto&f=768x0',
      url: 'https://www.decathlon.cl/p/333004-62962-zapatillas-running-hombre-kiprun-ks900-light-gris-amarillo.html',
      precio: '$100.000',
    },
  ];

  productosMarathon = [
    {
      nombre: 'Finisher Calcetines Pro Strider Cortas',
      imagen: 'https://www.marathon.cl/dw/image/v2/BJKZ_PRD/on/demandware.static/-/Sites-catalog-equinox/default/dw0e7bd9fe/images/marathon/799192552366_1-20250721120000-mrtChile.jpeg?sw=800&sh=800',
      url: 'https://www.marathon.cl/producto/finisher-calcetines-pro-strider-cortas-1-par/f20clcrewnt2/11061609001.html',
      precio: '$9.990',
    },
    {
      nombre: 'Everlast Cuerda FIT con Pesos Ajustables',
      imagen: 'https://www.marathon.cl/dw/image/v2/BJKZ_PRD/on/demandware.static/-/Sites-catalog-equinox/default/dwb74c96d8/images/marathon/9283612191_1-20250601120000-mrtChile.jpeg?sw=800&sh=800',
      url: 'https://www.marathon.cl/ofertas/los_mejores_descuentos/everlast-cuerda-fit-c%2Fpesos-ajustable-11%22/p00002708/10974646001.html',
      precio: '$14.990',
    },
    {
      nombre: 'Energetics Mancuernas Pesas Neopreno',
      imagen: 'https://www.marathon.cl/dw/image/v2/BJKZ_PRD/on/demandware.static/-/Sites-catalog-equinox/default/dwc0aec7c6/images/marathon/7613709430950_1-20250601120000-mrtChile.jpeg?sw=800&sh=800',
      url: 'https://www.marathon.cl/ofertas/los_mejores_descuentos/energetics-mancuernas-pesas-neopreno/106225-901-050/10938936003.html',
      precio: '$14.995',
    },
  ];

  abrirTienda(url: string) {
    window.open(url, '_blank');
  }
}



