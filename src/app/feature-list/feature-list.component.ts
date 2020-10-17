import { Component, OnInit } from '@angular/core';
import { SimpleFeature } from '../simplefeature';
import { MapService } from '../services/map.service';
import { HttpClient } from '@angular/common/http';
import { faListAlt, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.css']
})
export class FeatureListComponent implements OnInit {

  iconListAlt = faListAlt;
  iconChevronLeft = faChevronLeft;
  searchText: string;
  features: SimpleFeature[] = [];
  selectedFeature: SimpleFeature;

  isSidebarActive = false;

  constructor(private http: HttpClient, private mapService: MapService) { }

  ngOnInit() {

    this.http.get('../../assets/data/geojson/limits_IT_regions.geojson', {responseType: 'text'})
    .subscribe((data) => {
      const obj = JSON.parse(data);
      const textFeatures = obj.features;
      const features: SimpleFeature[] = [];
      textFeatures.forEach((element: { properties: { reg_istat_code: string; reg_name: string; }; }) => {
        // features.push({type: this.mapService.REGION_TYPE_KEY, name});
        features.push(new SimpleFeature(
          element.properties.reg_istat_code
          , this.mapService.REGION_TYPE_KEY
          , element.properties.reg_name
          )
        );
      });
      features.sort(SimpleFeature.compareOnName);
      Array.prototype.push.apply(this.features, features);
      // console.log(obj);
    });

    this.http.get('../../assets/data/geojson/limits_IT_provinces.geojson', {responseType: 'text'})
    .subscribe((data) => {
      const obj = JSON.parse(data);
      const textFeatures = obj.features;
      const features: SimpleFeature[] = [];
      textFeatures.forEach((element: { properties: { prov_istat_code: string; prov_name: string; }; }) => {
        // features.push({type: this.mapService.PROVINCE_TYPE_KEY, name});
          features.push(new SimpleFeature(
            element.properties.prov_istat_code
            , this.mapService.PROVINCE_TYPE_KEY
            , element.properties.prov_name
            )
          );
      });
      features.sort(SimpleFeature.compareOnName);
      Array.prototype.push.apply(this.features, features);
      // console.log(obj);
    });

  }

  onSelect(feature: SimpleFeature): void {
    this.selectedFeature = feature;
    this.mapService.zoomToFeature(feature);
  }

  activateSidebar(): void {
    this.isSidebarActive = true;
    this.mapService.updateSidebarStatus(this.isSidebarActive);
  }

  hideSidebar(): void {
    this.isSidebarActive = false;
    this.mapService.updateSidebarStatus(this.isSidebarActive);
  }

}
