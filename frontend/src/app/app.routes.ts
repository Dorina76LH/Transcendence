import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings';
import { LanguageComponent } from './languages';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';

export const routes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'profile', component: ProfileComponent},
	{path: 'settings', component: SettingsComponent},
	{path: 'languages', component: LanguageComponent},
	{path: 'chat', component:ChatComponent},
	{path: 'login', component:LoginComponent},
	{path: 'register', component:RegisterComponent}
];