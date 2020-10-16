import { Component, OnInit, OnDestroy } from '@angular/core';
import { SimpleFeature } from '../simplefeature';
import { Subscription } from 'rxjs';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-selected-feature',
  templateUrl: './selected-feature.component.html',
  styleUrls: ['./selected-feature.component.css']
})
export class SelectedFeatureComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  selectedFeature: SimpleFeature;

  constructor(private mapService: MapService) { }


  ngOnInit() {
    this.subscription = this.mapService.selecteFeatureObservable.subscribe(
      (selectedFeature: SimpleFeature) => {
        this.selectedFeature = selectedFeature;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
