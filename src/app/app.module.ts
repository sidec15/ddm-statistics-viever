import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { FeatureListComponent } from './feature-list/feature-list.component';
import { HttpClientModule } from '@angular/common/http';
import { SelectedFeatureComponent } from './selected-feature/selected-feature.component';
import { FilterPipe } from './filter.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    FeatureListComponent,
    SelectedFeatureComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule
    , HttpClientModule
    , FontAwesomeModule
    , FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
