import { Component, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { MapService } from '../services/map.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  map: any;
  private subscription: Subscription;
  isSidebarActive: boolean;
  private olZoomElement: any;

  constructor(private mapService: MapService, private elRef: ElementRef, private renderer: Renderer2) { }


  ngOnInit() {
    console.log('Called OnInit in MapComponent class!');



    this.subscription = this.mapService.isSidebarActiveObservable.subscribe(
      (isSidebarActive) => {
        this.isSidebarActive = isSidebarActive;
        this.olZoomElement = this.elRef
        // .nativeElement.querySelector('.map')
        .nativeElement.querySelector('.ol-zoom');
        if (isSidebarActive) {
          this.renderer.addClass(this.olZoomElement, 'shifted');
        } else {
          this.renderer.removeClass(this.olZoomElement, 'shifted');
        }

        // this.renderer.setAttribute(this.olZoomElement, 'class', this.isSidebarActive ? 'shifted' : '');
      }
    );

    this.map = this.mapService.createMap('map');
    setTimeout(() => {
      this.map.updateSize();
    }, 500);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
