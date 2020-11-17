import * as constants from "../constants";
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SimpleFeature } from '../simplefeature';
import { Subscription } from 'rxjs';
import { MapService } from '../services/map.service';

const LOC_TRAJECTORY_STATISTICS = "loc_trajectory_statistics.html";
const LOC_REGIONAL_STATISTICS = "loc_regional_statistics.html";
const LOC_GENERAL_STATISTICS = "loc_general_statistics.html";
const LOC_GENERAL_STATISTICS_DAYTYPE_BASED = "loc_general_statistics_daytype_based.html";


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

  openStatistics(feature: SimpleFeature): void {
    console.log('Open stats');
    setTimeout(() => {
      const url1 = [feature.get_blob_name(), LOC_GENERAL_STATISTICS_DAYTYPE_BASED].join("/");
      window.open(url1);
    }, 1000);
    setTimeout(() => {
      const url1 = [feature.get_blob_name(), LOC_REGIONAL_STATISTICS].join("/");
      window.open(url1);
    }, 1000);
    setTimeout(() => {
      const url1 = [feature.get_blob_name(), LOC_GENERAL_STATISTICS].join("/");
      window.open(url1);
    }, 1000);
    setTimeout(() => {
      const url1 = [feature.get_blob_name(), LOC_TRAJECTORY_STATISTICS].join("/");
      window.open(url1);
    }, 500);    

  }
}
