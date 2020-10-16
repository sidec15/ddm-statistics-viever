import { Component, OnInit, EventEmitter } from '@angular/core';
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

  features: SimpleFeature[] = [];
  selectedFeature: SimpleFeature;

  isSidebarActive = false;

  constructor(private http: HttpClient, private mapService: MapService) { }

  ngOnInit() {

    this.http.get('../../assets/data/geojson/limits_IT_regions.geojson', {responseType: 'text'})
    .subscribe((data) => {
      const obj = JSON.parse(data);
      const textFeatures = obj.features;
      textFeatures.forEach((element: { properties: { reg_name: any; }; }) => {
        const name = element.properties.reg_name;
        this.features.push({type: this.mapService.REGION_TYPE_KEY, name});
      });
      // console.log(obj);
    });



    // tslint:disable-next-line: forin
    // for (const key in mapfeatures) {
    //   const feature = mapfeatures[key];
    //   let type = null;
    //   if (feature.get(this.mapService.PROVINCE_NAME_KEY)) {
    //     type = 'REG';
    //   } else {
    //     type = 'PROV';
    //   }
    //   this.features.push({type, name: key});
    // }

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
