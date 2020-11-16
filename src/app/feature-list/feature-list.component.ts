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

    this.http.get('../../assets/data/geojson/italy-regions.geojson', {responseType: 'text'})
    .subscribe((data) => {
      const obj = JSON.parse(data);
      const textFeatures = obj.features;
      const features: SimpleFeature[] = [];
      textFeatures.forEach((element: { properties: { code: string; reg_name: string; }; }) => {
        // features.push({type: this.mapService.REGION_TYPE_KEY, name});
        let code = element.properties.code;
        features.push(new SimpleFeature(
          code
          , this.mapService.REGION_TYPE_KEY
          , element.properties.reg_name
          )
        );
      });
      features.sort(SimpleFeature.compareOnName);
      Array.prototype.push.apply(this.features, features);
      // console.log(obj);
    });

    this.http.get('../../assets/data/geojson/italy-provinces.geojson', {responseType: 'text'})
    .subscribe((data) => {
      const obj = JSON.parse(data);
      const textFeatures = obj.features;
      const features: SimpleFeature[] = [];
      textFeatures.forEach((element: { properties: { code: string; prov_name: string; }; }) => {
        // features.push({type: this.mapService.PROVINCE_TYPE_KEY, name});
          let code = element.properties.code;
          features.push(new SimpleFeature(
            code
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
