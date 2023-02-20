import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';

import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatCardModule, MatCardTitle} from '@angular/material/card';
import { MatCheckboxModule, MatRippleModule, MatToolbarModule } from '@angular/material';
import { MatButtonModule, MatDividerModule, MatMenuModule, MatSelectModule } from '@angular/material';
import { MatSidenavModule, MatTableModule, MatTabsModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        MatDatepickerModule,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatChipsModule,
        FormsModule,
        MatTooltipModule,
        MatExpansionModule,
        MatListModule,
        MatCardModule,
        MatCheckboxModule,
        MatRippleModule,
        MatToolbarModule,
        MatInputModule,
        MatButtonModule,
        MatDividerModule,
        MatMenuModule,
        MatSelectModule,
        MatSidenavModule,
        MatTableModule,
        MatTabsModule,
        MatGridListModule,
    ],
    declarations: [ HeaderComponent ],
    exports: [ HeaderComponent ]
})

export class HeaderModule {}