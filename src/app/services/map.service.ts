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
import * as constants from "../constants";

const center = [12.509623, 41.913351];
const centerMarcator = fromLonLat(center);

const GEOJSON_FILE_REGIONS = 'assets/data/geojson/italy-regions.geojson';
const GEOJSON_FILE_PROVINCES = 'assets/data/geojson/italy-provinces.geojson';
const GEOJSON_FILE_MUNICIPALITIES = 'assets/data/geojson/italy-municipailities_cut.geojson';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  featuresMap: { [key: string]: Feature; } = {};
  selectedFeature: Feature;
  highlightedFeature: Feature = null;
  map: Map;
  featureOvrelay: VectorLayer;
  REGION_NAME_KEY = constants.REGION_NAME_KEY;
  REGION_TYPE_KEY = constants.REGION_TYPE_KEY;
  GEOJSON_FILE_REGIONS = GEOJSON_FILE_REGIONS;
  MAX_ZOOM_LEVEL_REGION = 7.5;
  MAX_ZOOM_LEVEL_PROVINCE = 9.5;
  PROVINCE_NAME_KEY = constants.PROVINCE_NAME_KEY;
  PROVINCE_TYPE_KEY = constants.PROVINCE_TYPE_KEY;
  GEOJSON_FILE_PROVINCES = GEOJSON_FILE_PROVINCES;
  MUNICIPALITY_NAME_KEY = constants.MUNICIPALITY_NAME_KEY;
  MUNICIPALITY_TYPE_KEY = constants.MUNICIPALITY_TYPE_KEY;
  GEOJSON_FILE_MUNICIPALITIES = GEOJSON_FILE_MUNICIPALITIES;
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

    const fill = new Fill({
      color: 'rgba(255, 255, 255, 0.6)',
    });
    const stroke = new Stroke({
      color: '#319FD3',
      width: 1,
    });
    const text = new Text({
      font: '16px Calibri,sans-serif',
      fill: new Fill({
        color: '#000',
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 3,
      }),
    });

    const style = new Style({
      fill: fill,
      stroke: stroke,
      text: text
    });


    const layerRegions = new VectorLayer({
      source: new VectorSource({
        url: GEOJSON_FILE_REGIONS,
        format: new GeoJSON(),
      }),
      maxZoom: this.MAX_ZOOM_LEVEL_REGION,
      style(feature) {
        style.getText().setText(feature.get(constants.REGION_NAME_KEY));
        return style;
      },
    });

    layerRegions.getSource().on('addfeature', (event) => {
      const type = constants.REGION_TYPE_KEY;
      const code = event.feature.get(constants.REGION_CODE);
      const id = SimpleFeature.createId(code, type);
      this.featuresMap[id] = event.feature;
    });

    const layerProvinces = new VectorLayer({
      source: new VectorSource({
        url: GEOJSON_FILE_PROVINCES,
        format: new GeoJSON(),
      }),
      // minZoom: this.MAX_ZOOM_LEVEL_REGION,
      maxZoom: this.MAX_ZOOM_LEVEL_PROVINCE,
      opacity: 0,
      // visible: true,
      style(feature) {
        style.getText().setText(feature.get(constants.PROVINCE_NAME_KEY));
        return style;
      },
    });

    layerProvinces.getSource().on('addfeature', (event) => {
      const type = constants.PROVINCE_TYPE_KEY;
      const code = event.feature.get(constants.PROVINCE_CODE);
      const id = SimpleFeature.createId(code, type);
      this.featuresMap[id] = event.feature;
    });


    const fill_mun = new Fill({
      color: 'rgba(255, 255, 255, 1)',
    });
    const stroke_mun = new Stroke({
      color: '#319FD3',
      width: 1,
    });
    const style_mun = new Style({
      fill: fill_mun,
      stroke: stroke_mun,
      text: text
    });
    const layerMunicipalities = new VectorLayer({
      source: new VectorSource({
        url: GEOJSON_FILE_MUNICIPALITIES,
        format: new GeoJSON(),
      }),
      // minZoom: this.MAX_ZOOM_LEVEL_PROVINCE,
      opacity: 0,
      // visible: true,
      style(feature) {
        style.getText().setText(feature.get(constants.MUNICIPALITY_NAME_KEY));
        return style;
      },
    });

    layerMunicipalities.getSource().on('addfeature', (event) => {
      const type = constants.MUNICIPALITY_TYPE_KEY;
      const code = event.feature.get(constants.MUNICIPALITY_CODE);
      const id = SimpleFeature.createId(code, type);
      this.featuresMap[id] = event.feature;
    });

    const highlightStyle = new Style({
      stroke: new Stroke({
        color: 'rgba(0,0,255,1)',
        width: 1,
      }),
      fill: new Fill({
        color: 'rgba(0,0,255,0.5)',
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
        color: 'rgba(255,0,0,1)',
        width: 1,
      }),
      fill: new Fill({
        color: 'rgba(255,0,0,0.5)',
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
        // let name = null;
        // if (feature.get(constants.PROVINCE_NAME_KEY)) {
        //   name = feature.get(constants.PROVINCE_NAME_KEY);
        // } else {
        //   name = feature.get(constants.REGION_NAME_KEY);
        // }
        // highlightStyle.getText().setText(name);
        return highlightStyle;
      },
    });

    const selectedFeatureLayer = new VectorLayer({
      source: new VectorSource(),
      style: selectStyle,
      // style(feature) {
      //   let name = null;
      //   if (feature.get(constants.PROVINCE_NAME_KEY)) {
      //     name = feature.get(constants.PROVINCE_NAME_KEY);
      //   } else {
      //     name = feature.get(constants.REGION_NAME_KEY);
      //   }
      //   selectStyle.getText().setText(name);
      //   return selectStyle;
      // },
    });

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        highLightedFeatureLayer, selectedFeatureLayer
        , layerRegions
        , layerProvinces
        , layerMunicipalities
      ],
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
        if (feature.get(constants.MUNICIPALITY_NAME_KEY)) {
          code = feature.get(constants.MUNICIPALITY_CODE);
          name = feature.get(constants.MUNICIPALITY_NAME_KEY);
          type = constants.MUNICIPALITY_TYPE_KEY;
        }
        else if (feature.get(constants.PROVINCE_NAME_KEY)) {
          code = feature.get(constants.PROVINCE_CODE);
          name = feature.get(constants.PROVINCE_NAME_KEY);
          type = constants.PROVINCE_TYPE_KEY;
        } else {
          code = feature.get(constants.REGION_CODE);
          name = feature.get(constants.REGION_NAME_KEY);
          type = constants.REGION_TYPE_KEY;
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
      layerMunicipalities.setOpacity(1);
      layerMunicipalities.setMinZoom(this.MAX_ZOOM_LEVEL_PROVINCE);
      console.log('Map loaded');
    });

    let currZoom = null;
    map.on('moveend', function(e) {
      var newZoom = map.getView().getZoom();
      if (currZoom != newZoom) {
        console.log('zoom end, new zoom: ' + newZoom);
        currZoom = newZoom;
      }
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
      } else if (simpleFeature.type === this.PROVINCE_TYPE_KEY) {
        zoomLevel = this.MAX_ZOOM_LEVEL_PROVINCE;
      } else {
        zoomLevel = this.MAX_ZOOM_LEVEL_PROVINCE + 2;
      }
      this.map.getView().setZoom(zoomLevel);
    }
  }
}
