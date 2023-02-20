import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule, MatRippleModule, MatToolbarModule } from '@angular/material';
import { MatButtonModule, MatDividerModule, MatMenuModule, MatSelectModule } from '@angular/material';
import { MatSidenavModule, MatTableModule, MatTabsModule } from '@angular/material';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormUsuarioComponent } from '../form-usuario/form-usuario.component';
import { SeccionBienestarComponent } from './seccion-bienestar.component';
// importar componentes requeridos en el modulo
import { VoluntariadoComponent } from '../voluntariado/voluntariado.component';
import { AlianzasComponent } from '../alianzas/alianzas.component';
import { BoletinesComponent } from '../boletines/boletines.component';
import { FormBoletinesComponent } from '../form-boletines/form-boletines.component';
import { AlianzaCuponesComponent } from '../alianza-cupones/alianza-cupones.component';

const routes: Routes = [
    {
        path: 'seccionBienestar',
        component: SeccionBienestarComponent,
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
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
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        MatGridListModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatSlideToggleModule,
        MatPaginatorModule
    ],
    entryComponents: [
        SeccionBienestarComponent,
        FormUsuarioComponent,
        SeccionBienestarComponent,
        VoluntariadoComponent,
        AlianzasComponent,
        BoletinesComponent, 
        FormBoletinesComponent,
        AlianzaCuponesComponent
    ],
    declarations: [
        // FormUsuarioComponent,
        // SeccionBienestarComponent,
        // VoluntariadoComponent,
        // AlianzasComponent,
        // BoletinesComponent, 
        // FormBoletinesComponent,
        // AlianzaCuponesComponent
        // pasar componentes 
    ]
})
export class SeccionBienestarModule { }
