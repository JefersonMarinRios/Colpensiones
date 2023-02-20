import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts";

import { FusionChartsModule } from "angular-fusioncharts";
import { AdminLayoutRoutes } from "./admin-layout.routing";

import { DispositivosMovilesComponent } from "src/app/dispositivos-moviles/dispositivos-moviles.component";
import { EstadisticaUsoComponent } from "src/app/estadistica-uso/estadistica-uso.component";
import { MapaCalorComponent } from "src/app/mapa-calor/mapa-calor.component";
import { HomeComponent } from "src/app/home/home.component";
import { ListaParametrosComponent } from "src/app/lista-parametros/lista-parametros.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
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
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatPaginatorModule } from "@angular/material/paginator";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatNativeDateModule} from '@angular/material';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {MatRadioModule} from '@angular/material/radio';
import * as FusionCharts from "fusioncharts";
import * as Charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { FormUsuarioComponent } from "src/app/form-usuario/form-usuario.component";
import { MensajeIndisponibilidadComponent } from 'src/app/mensaje-indisponibilidad/mensaje-indisponibilidad.component'
import { FormAgradecimientoComponent } from 'src/app/form-agradecimiento/form-agradecimiento.component'
import { FormAlertaComponent } from 'src/app/form-alerta/form-alerta.component';
import { NotificacionesComponent } from 'src/app/notificaciones/notificaciones.component';
import { ContactanosComponent } from "src/app/contactanos/contactanos.component";
import { RedesSocialesComponent } from "src/app/redes-sociales/redes-sociales.component";
import { LineasAtencionComponent } from "src/app/lineas-atencion/lineas-atencion.component";
// import * as CryptoJS from 'crypto-js'

import { ArchivoComponent } from "src/app/archivo/archivo.component";

// Seccion bienestar
import { SeccionBienestarComponent } from 'src/app/seccion-bienestar/seccion-bienestar.component';
import { VoluntariadoComponent } from 'src/app/voluntariado/voluntariado.component'
import { AlianzasComponent } from 'src/app/alianzas/alianzas.component';
import { BoletinesComponent } from 'src/app/boletines/boletines.component';
import { FormBoletinesComponent } from 'src/app/form-boletines/form-boletines.component';
import { AlianzaCuponesComponent } from 'src/app/alianza-cupones/alianza-cupones.component';
import { FormCuponComponent } from 'src/app/alianza-cupones/form-cupon/form-cupon.component';
import { MenuCuponesComponent } from 'src/app/alianza-cupones/menu-cupones/menu-cupones.component';
import { EventosComponent } from 'src/app/eventos/eventos.component';
import { FormEventosComponent } from 'src/app/form-eventos/form-eventos.component';
// Fin seccion bienestar

import { ReportesComponent } from 'src/app/reportes/reportes.component';
import { AdministracionUsuariosComponent } from 'src/app/administracion-usuarios/administracion-usuarios.component';
import { PerfilamientoTramitesComponent } from 'src/app/perfilamiento-tramites/perfilamiento-tramites.component';

//timepicker
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

//multiselect 
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


// Seccion Educacion
import { SeccionEducacionComponent } from 'src/app/seccion-educacion/seccion-educacion.component';
import { FormBoletinesEducacionComponent } from 'src/app/form-boletines-educacion/form-boletines-educacion.component';
import { BoletinesEducacionComponent } from 'src/app/boletines-educacion/boletines-educacion.component';
import { PodcastEducacionComponent } from 'src/app/podcast-educacion/podcast-educacion.component';
import { FormPodcastEducacionComponent } from 'src/app/form-podcast-educacion/form-podcast-educacion.component';
import { NoticiasEducacionComponent } from 'src/app/noticias-educacion/noticias-educacion.component';
import { FormNoticiasEducacionComponent } from 'src/app/form-noticias-educacion/form-noticias-educacion.component';
import { EventosEducacionComponent } from 'src/app/eventos-educacion/eventos-educacion.component';
import { FormEventosEducacionComponent } from 'src/app/form-eventos-educacion/form-eventos-educacion.component';
import { SegmentacionEduacionComponent } from 'src/app/segmentacion-eduacion/segmentacion-eduacion.component';
import { FormSegmentacionEduacionComponent } from 'src/app/form-segmentacion-eduacion/form-segmentacion-eduacion.component';

// Fin Seccion Educacion

// Calificacion de contenidos
import { CalificacionContenidoComponent } from 'src/app/calificacion-contenido/calificacion-contenido.component';
import { EncuestasComponent } from 'src/app/encuestas/encuestas.component';
import { CalificacionComponent } from 'src/app/calificacion/calificacion.component';
// Fin Calificacion de contenidos

// Preguntas frecuentes
import { PreguntasFrecuentesComponent } from 'src/app/preguntas-frecuentes/preguntas-frecuentes.component';
import { FormPreguntasFrecuentesComponent } from 'src/app/form-preguntas-frecuentes/form-preguntas-frecuentes.component';
// Fin Preguntas frecuentes

// Mas informacion
import { MasInformacionComponent } from 'src/app/mas-informacion/mas-informacion.component';
import { SubMasInformacionComponent } from 'src/app/sub-mas-informacion/sub-mas-informacion.component';

FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    ChartsModule,
    FormsModule,
    FusionChartsModule,
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
    MatDatepickerModule,
    ReactiveFormsModule, 
    MatPaginatorModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatRadioModule,
    NgxMaterialTimepickerModule,
    NgMultiSelectDropDownModule.forRoot()
    // CryptoJS
  ],
  declarations: [
    HomeComponent,
    DispositivosMovilesComponent,
    EstadisticaUsoComponent,
    MapaCalorComponent,
    ListaParametrosComponent,
    FormUsuarioComponent,
    MensajeIndisponibilidadComponent,
    ArchivoComponent,
    FormAgradecimientoComponent,
    FormAlertaComponent,
    NotificacionesComponent,
    ContactanosComponent,
    RedesSocialesComponent,
    LineasAtencionComponent,
    SeccionBienestarComponent,
    VoluntariadoComponent,
    ReportesComponent,
    AdministracionUsuariosComponent,
    PerfilamientoTramitesComponent,
    AlianzasComponent,
    AlianzaCuponesComponent,
    FormCuponComponent,
    MenuCuponesComponent,
    BoletinesComponent, 
    FormBoletinesComponent,
    EventosComponent,
    FormEventosComponent,
    SeccionEducacionComponent,
    PreguntasFrecuentesComponent,
    FormPreguntasFrecuentesComponent,
    FormBoletinesEducacionComponent,
    BoletinesEducacionComponent,
    FormBoletinesEducacionComponent,
    PodcastEducacionComponent,
    FormPodcastEducacionComponent,
    NoticiasEducacionComponent,
    FormNoticiasEducacionComponent,
    EventosEducacionComponent,
    FormBoletinesEducacionComponent,
    FormEventosEducacionComponent,
    SegmentacionEduacionComponent,
    FormSegmentacionEduacionComponent,
    CalificacionContenidoComponent,
    EncuestasComponent,
    CalificacionComponent,
    MasInformacionComponent,
    SubMasInformacionComponent
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {},
    },
  ],
})
export class AdminLayoutModule {}
