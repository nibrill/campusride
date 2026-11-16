import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addCircleOutline, listOutline, personOutline, searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="viajes">
          <ion-icon name="search-outline"></ion-icon>
          <ion-label>Viajes</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="publicar">
          <ion-icon name="add-circle-outline"></ion-icon>
          <ion-label>Publicar</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="mis-viajes">
          <ion-icon name="list-outline"></ion-icon>
          <ion-label>Mis viajes</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="perfil">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Perfil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsPage {
  constructor() {
    addIcons({ addCircleOutline, listOutline, personOutline, searchOutline });
  }
}
