import { Routes } from "@angular/router";

import { EstadisticaUsoComponent } from '../../estadistica-uso/estadistica-uso.component';
import { MapaCalorComponent } from '../../mapa-calor/mapa-calor.component';
import { DispositivosMovilesComponent } from '../../dispositivos-moviles/dispositivos-moviles.component';
import { HomeComponent } from 'src/app/home/home.component';
import { ListaParametrosComponent } from 'src/app/lista-parametros/lista-parametros.component';
// import { FormUsuarioComponent } from 'src/app/form-usuario/form-usuario.component';
import { AdministracionUsuariosComponent } from 'src/app/administracion-usuarios/administracion-usuarios.component'
import { MensajeIndisponibilidadComponent } from 'src/app/mensaje-indisponibilidad/mensaje-indisponibilidad.component';
import { ArchivoComponent } from "src/app/archivo/archivo.component";
import { NotificacionesComponent } from 'src/app/notificaciones/notificaciones.component';
import { ContactanosComponent } from "src/app/contactanos/contactanos.component";
import { SeccionBienestarComponent } from "src/app/seccion-bienestar/seccion-bienestar.component";
import { ReportesComponent } from 'src/app/reportes/reportes.component';
import { PerfilamientoTramitesComponent } from 'src/app/perfilamiento-tramites/perfilamiento-tramites.component';
import { AlianzaCuponesComponent } from "src/app/alianza-cupones/alianza-cupones.component";
import { AlianzasComponent } from "src/app/alianzas/alianzas.component";
import { VoluntariadoComponent } from "src/app/voluntariado/voluntariado.component";
import { BoletinesComponent } from "src/app/boletines/boletines.component";
import { FormBoletinesComponent } from "src/app/form-boletines/form-boletines.component";
import { EventosComponent } from 'src/app/eventos/eventos.component';
import { FormEventosComponent } from 'src/app/form-eventos/form-eventos.component';
import { SeccionEducacionComponent } from 'src/app/seccion-educacion/seccion-educacion.component';
import { PreguntasFrecuentesComponent } from "src/app/preguntas-frecuentes/preguntas-frecuentes.component";
import { FormPreguntasFrecuentesComponent } from 'src/app/form-preguntas-frecuentes/form-preguntas-frecuentes.component';
import { FormBoletinesEducacionComponent } from 'src/app/form-boletines-educacion/form-boletines-educacion.component';
import { BoletinesEducacionComponent } from 'src/app/boletines-educacion/boletines-educacion.component';
import { PodcastEducacionComponent } from 'src/app/podcast-educacion/podcast-educacion.component';
import { FormPodcastEducacionComponent } from 'src/app/form-podcast-educacion/form-podcast-educacion.component';
import { NoticiasEducacionComponent } from 'src/app/noticias-educacion/noticias-educacion.component';
import { FormNoticiasEducacionComponent } from 'src/app/form-noticias-educacion/form-noticias-educacion.component';
import { EventosEducacionComponent} from 'src/app/eventos-educacion/eventos-educacion.component';
import { FormEventosEducacionComponent } from 'src/app/form-eventos-educacion/form-eventos-educacion.component';
import { SegmentacionEduacionComponent } from 'src/app/segmentacion-eduacion/segmentacion-eduacion.component';
import { FormSegmentacionEduacionComponent } from 'src/app/form-segmentacion-eduacion/form-segmentacion-eduacion.component';
import { CalificacionContenidoComponent } from "src/app/calificacion-contenido/calificacion-contenido.component";
import { LineasAtencionComponent } from "src/app/lineas-atencion/lineas-atencion.component"
import { RedesSocialesComponent } from "src/app/redes-sociales/redes-sociales.component"
// Mas informacion
import { MasInformacionComponent } from 'src/app/mas-informacion/mas-informacion.component';
import { SubMasInformacionComponent } from "src/app/sub-mas-informacion/sub-mas-informacion.component";





export const AdminLayoutRoutes: Routes= [
     {path: 'home', component: HomeComponent},
     {path: 'dispositivos', component: DispositivosMovilesComponent},
     {path: 'uso', component: EstadisticaUsoComponent},
     {path: 'mapa', component: MapaCalorComponent},
     {path: 'parametros', component: ListaParametrosComponent},
     // {path: 'users', component: FormUsuarioComponent},
     {path: 'users', component: AdministracionUsuariosComponent},
     {path: 'mensajeIndisponibilidad', component: MensajeIndisponibilidadComponent},
     {path: 'archivoPAC', component: ArchivoComponent},
     {path: 'notificaciones', component: NotificacionesComponent},
     {path: 'contactanos', component: ContactanosComponent},
     {path: 'contactanos/redesSociales', component: RedesSocialesComponent},
     {path: 'contactanos/lineasAtencion', component: LineasAtencionComponent},
     {path: 'seccionBienestar', component: SeccionBienestarComponent},
     {path: 'seccionBienestar/alianzas', component: AlianzasComponent},
     {path: 'seccionBienestar/cupon', component: AlianzaCuponesComponent},
     {path: 'seccionBienestar/boletines', component: BoletinesComponent},
     {path: 'seccionBienestar/boletin', component: FormBoletinesComponent},
     {path: 'seccionBienestar/eventos', component: EventosComponent},
     {path: 'seccionBienestar/evento', component: FormEventosComponent},
     {path: 'seccionBienestar/voluntariado', component: VoluntariadoComponent},
     {path: 'reportes', component: ReportesComponent},
     {path: 'perfilamiento', component: PerfilamientoTramitesComponent},
     {path: 'seccionEducacion', component: SeccionEducacionComponent},
     {path: 'preguntasFrecuentes', component: PreguntasFrecuentesComponent},
     {path: 'preguntasFrecuentes/sub', component: PreguntasFrecuentesComponent},
     {path: 'preguntasFrecuentes/sub/lista', component: FormPreguntasFrecuentesComponent},
     {path: 'seccionEducacion/boletin', component: FormBoletinesEducacionComponent},
     {path: 'seccionEducacion/boletines', component: BoletinesEducacionComponent},
     {path: 'seccionEducacion/podcasts', component: PodcastEducacionComponent},
     {path: 'seccionEducacion/podcast', component: FormPodcastEducacionComponent},
     {path: 'seccionEducacion/noticias', component:NoticiasEducacionComponent},
     {path: 'seccionEducacion/noticia', component:FormNoticiasEducacionComponent},
     {path: 'seccionEducacion/eventos', component:EventosEducacionComponent},
     {path: 'seccionEducacion/evento', component: FormEventosEducacionComponent},
     {path: 'seccionEducacion/segmentaciones', component: SegmentacionEduacionComponent},
     {path: 'seccionEducacion/segmentacion', component: FormSegmentacionEduacionComponent},
     {path: 'calificacionContenidos', component: CalificacionContenidoComponent},
     {path: 'masInformacion', component: MasInformacionComponent},
     {path: 'masInformacion/sub', component: SubMasInformacionComponent},
    
     
     // {path: 'alianza', component: AlianzaCuponesComponent},
];
