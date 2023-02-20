import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AppRoutingModule } from "./app.routing";

import { LoginModule } from "./login/login.module";
import { HeaderModule } from "./shared/header/header.module";
import { SidebarModule } from "./sidebar/sidebar.module";

import { AppComponent } from "./app.component";

import { MapOperator } from "rxjs/internal/operators/map";
import { MatChipsModule } from "@angular/material/chips";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatListModule } from "@angular/material/list";
import { MatCardModule, MatCardTitle } from "@angular/material/card";
import { MatCheckboxModule, MatRippleModule, MatToolbarModule } from "@angular/material";
import {
  MatButtonModule,
  MatDividerModule,
  MatMenuModule,
  MatSelectModule,
} from "@angular/material";
import { MatSidenavModule, MatTableModule, MatTabsModule } from "@angular/material";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material";
import { MatGridListModule } from "@angular/material/grid-list";
import { ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSnackBarModule } from "@angular/material";
import { FusionChartsModule } from "angular-fusioncharts";
import { UsuarioService } from "./servicios/usuario.service";
import { MatPaginatorModule } from "@angular/material";
//timepicker
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

// multiselect
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

// import * as CryptoJS from 'crypto-js'

// Import FusionCharts library and chart modules
import * as FusionCharts from "fusioncharts";
import * as Charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { ChartsModule } from "ng2-charts";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./login/login.component";








FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatCardModule,
    MatCheckboxModule,
    MatRippleModule,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    HeaderModule,
    SidebarModule,
    FusionChartsModule,
    AppRoutingModule,
    MatPaginatorModule,
    NgxMaterialTimepickerModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [AppComponent, AdminLayoutComponent, LoginComponent],
  providers: [HttpClientModule, UsuarioService],
  bootstrap: [AppComponent],
})
export class AppModule {}
