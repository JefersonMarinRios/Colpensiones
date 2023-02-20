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
import { MatInputModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatProgressBarModule } from '@angular/material/progress-bar';
// importar componentes requeridos en el modulo
import { FormUsuarioComponent } from '../form-usuario/form-usuario.component';
import { AlianzaCuponesComponent } from './alianza-cupones.component';
import { MenuCuponesComponent } from './menu-cupones/menu-cupones.component';
import { FormCuponComponent } from './form-cupon/form-cupon.component'


const routes: Routes = [
    {
        path: 'alianza',
        component: AlianzaCuponesComponent,
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
        MatSlideToggleModule
    ],
    entryComponents: [
        AlianzaCuponesComponent,
        FormUsuarioComponent,
        // AlianzaCuponesComponent,
        MenuCuponesComponent,
        FormCuponComponent,
    ],
    declarations: [
        // pasar componentes 
    ]
})
export class AlianzaCuponesModule { }
