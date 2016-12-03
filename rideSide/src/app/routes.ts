import { Routes } from '@angular/router';

import { FeedComponent } from './feed.component'
import { NewAnswerComponent } from './new-answer.component';

export const routes: Routes = [
  { path: '', component: FeedComponent },
  { path: 'create', component: NewAnswerComponent }
];
