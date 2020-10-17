import { Injectable } from '@angular/core';

import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { Feature } from 'ol';
import 'ol/ol.css';
import { Pixel } from 'ol/pixel';
import { SimpleFeature } from '../simplefeature';
import { Subject } from 'rxjs';

const center = [12.509623, 41.913351];
const centerMarcator = fromLonLat(center);

const REGION_NAME_KEY = 'reg_name';
const REGION_CODE = 'reg_istat_code';
const PROVINCE_NAME_KEY = 'prov_name';
const PROVINCE_CODE = 'prov_istat_code';

const GEOJSON_FILE_REGIONS = 'assets/data/geojson/limits_IT_regions.geojson';
const GEOJSON_FILE_PROVINCES = 'assets/data/geojson/limits_IT_provinces.geojson';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  featuresMap: { [key: string]: Feature; } = {};
  selectedFeature: Feature;
  highlightedFeature: Feature = null;
  map: Map;
  featureOvrelay: VectorLayer;
  REGION_NAME_KEY = REGION_NAME_KEY;
  REGION_TYPE_KEY = 'REG';
  GEOJSON_FILE_REGIONS = GEOJSON_FILE_REGIONS;
  MAX_ZOOM_LEVEL_REGION = 8;
  PROVINCE_NAME_KEY = PROVINCE_NAME_KEY;
  PROVINCE_TYPE_KEY = 'PROV';
  GEOJSON_FILE_PROVINCES = GEOJSON_FILE_PROVINCES;
  private isSidebarActiveSubject = new Subject<boolean>();
  isSidebarActiveObservable = this.isSidebarActiveSubject.asObservable();
  private selecteFeatureSubject = new Subject<SimpleFeature>();
  selecteFeatureObservable = this.selecteFeatureSubject.asObservable();


  constructor() { }

  updateSidebarStatus(isSidebarActive: boolean) {
    this.isSidebarActiveSubject.next(isSidebarActive);
  }

  createMap(target: string) {

    console.log('Called OnInit in MapComponent class!');

    const style = new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.6)',
      }),
      stroke: new Stroke({
        color: '#319FD3',
        width: 1,
      }),
      text: new Text({
        font: '16px Calibri,sans-serif',
        fill: new Fill({
          color: '#000',
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 3,
        }),
      }),
    });


    const layerRegions = new VectorLayer({
      source: new VectorSource({
        url: GEOJSON_FILE_REGIONS,
        format: new GeoJSON(),
      }),
      maxZoom: this.MAX_ZOOM_LEVEL_REGION,
      style(feature) {
        style.getText().setText(feature.get(REGION_NAME_KEY));
        return style;
      },
    });

    layerRegions.getSource().on('addfeature', (event) => {
      const type = this.REGION_TYPE_KEY;
      const code = event.feature.get(REGION_CODE);
      const id = SimpleFeature.createId(code, type);
      this.featuresMap[id] = event.feature;
    });

    const layerProvinces = new VectorLayer({
      source: new VectorSource({
        url: GEOJSON_FILE_PROVINCES,
        format: new GeoJSON(),
      }),
      // minZoom: this.MAX_ZOOM_LEVEL_REGION,
      opacity: 0,
      // visible: false,
      style(feature) {
        style.getText().setText(feature.get(PROVINCE_NAME_KEY));
        return style;
      },
    });

    layerProvinces.getSource().on('addfeature', (event) => {
      const type = this.PROVINCE_TYPE_KEY;
      const code = event.feature.get(PROVINCE_CODE);
      const id = SimpleFeature.createId(code, type);
      this.featuresMap[id] = event.feature;
    });

    const highlightStyle = new Style({
      stroke: new Stroke({
        color: 'rgba(0,0,255,0.5)',
        width: 1,
      }),
      fill: new Fill({
        color: 'rgba(0,0,255,0.1)',
      }),
      // text: new Text({
      //   font: '16px Calibri,sans-serif',
      //   fill: new Fill({
      //     color: '#000',
      //   }),
      //   stroke: new Stroke({
      //     color: '#f00',
      //     width: 3,
      //   }),
      // }),
    });

    const selectStyle = new Style({
      stroke: new Stroke({
        color: 'rgba(255,0,0,0.5)',
        width: 1,
      }),
      fill: new Fill({
        color: 'rgba(255,0,0,0.1)',
      }),
      // text: new Text({
      //   font: '16px Calibri,sans-serif',
      //   fill: new Fill({
      //     color: '#000',
      //   }),
      //   stroke: new Stroke({
      //     color: '#f00',
      //     width: 3,
      //   }),
      // }),
    });

    const highLightedFeatureLayer = new VectorLayer({
      source: new VectorSource(),
      style(feature) {
        let name = null;
        if (feature.get(PROVINCE_NAME_KEY)) {
          name = feature.get(PROVINCE_NAME_KEY);
        } else {
          name = feature.get(REGION_NAME_KEY);
        }
        // highlightStyle.getText().setText(name);
        return highlightStyle;
      },
    });

    const selectedFeatureLayer = new VectorLayer({
      source: new VectorSource(),
      style(feature) {
        let name = null;
        if (feature.get(PROVINCE_NAME_KEY)) {
          name = feature.get(PROVINCE_NAME_KEY);
        } else {
          name = feature.get(REGION_NAME_KEY);
        }
        // highlightStyle.getText().setText(name);
        return selectStyle;
      },
    });

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        layerRegions, layerProvinces, highLightedFeatureLayer, selectedFeatureLayer],
      // tslint:disable-next-line: object-literal-shorthand
      target: target,
      view: new View({
        projection: 'EPSG:3857',
        center: centerMarcator,
        zoom: 6
      }),
    });


    this.map = map;

    const selectFeature = (feature: Feature) => {

      // const info = document.getElementById('selected_feature');
      if (this.selectedFeature) {
        selectedFeatureLayer.getSource().removeFeature(this.selectedFeature);
      }

      if (feature) {
        let name = null;
        let type = null;
        let code = null;
        if (feature.get(PROVINCE_NAME_KEY)) {
          code = feature.get(PROVINCE_CODE);
          name = feature.get(PROVINCE_NAME_KEY);
          type = this.PROVINCE_TYPE_KEY;
        } else {
          code = feature.get(REGION_CODE);
          name = feature.get(REGION_NAME_KEY);
          type = this.REGION_TYPE_KEY;
        }
        // info.innerHTML = name;
        this.selectedFeature = feature;
        this.selecteFeatureSubject.next(new SimpleFeature(code, type, name));
        selectedFeatureLayer.getSource().addFeature(this.selectedFeature);
        console.log('Selected feature: ' + name);
      } else {
        // info.innerHTML = '';
        this.selectedFeature = null;
        this.selecteFeatureSubject.next(null);
      }

    };

    const selectFeatureFromPixel = (pixel: Pixel) => {

      // tslint:disable-next-line: only-arrow-functions
      const feature: Feature = map.forEachFeatureAtPixel(pixel, function(feat) {
        return feat as Feature;
      });

      selectFeature(feature);

    };

    const highLightFeature = (pixel: Pixel) => {
      // tslint:disable-next-line: only-arrow-functions
      const feature = map.forEachFeatureAtPixel(pixel, function(feat) {
        return feat;
      });

      if (feature !== this.highlightedFeature) {
        if (this.highlightedFeature) {
          highLightedFeatureLayer.getSource().removeFeature(this.highlightedFeature);
        }
        if (feature) {
          map.getTargetElement().style.cursor = 'pointer';
          highLightedFeatureLayer.getSource().addFeature(feature as Feature);
        } else {
          map.getTargetElement().style.cursor = 'unset';
        }
        this.highlightedFeature = feature as Feature;
      }
    };


    map.on('pointermove', (evt) => {
      // console.log('Called pointermove!');
      if (evt.dragging) {
        return;
      }
      const pixel = map.getEventPixel(evt.originalEvent);
      highLightFeature(pixel);
    });

    map.on('click', (evt) => {
      // console.log('Called click!');
      selectFeatureFromPixel(evt.pixel);
    });

    // tslint:disable-next-line: variable-name
    map.once('postrender', (_event) => {
      layerProvinces.setOpacity(1);
      layerProvinces.setMinZoom(this.MAX_ZOOM_LEVEL_REGION);
      console.log('Map loaded');
    });

    return map;
  }

  getAllFeatures() {
    return this.featuresMap;
  }

  getFeatureOverlay() {
    return this.featureOvrelay;
  }

  zoomToFeature(simpleFeature: SimpleFeature) {
    const feature = this.featuresMap[simpleFeature.id];
    if (feature) {
      const extent = feature.getGeometry().getExtent();
      this.map.getView().fit(extent, { size: this.map.getSize() });
      let zoomLevel = null;
      if (simpleFeature.type === this.REGION_TYPE_KEY) {
        zoomLevel = this.MAX_ZOOM_LEVEL_REGION;
      } else {
        zoomLevel = this.MAX_ZOOM_LEVEL_REGION + 1;
      }
      this.map.getView().setZoom(zoomLevel);
    }
  }
}
