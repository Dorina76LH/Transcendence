import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { LanguageComponent } from './languages/language.components';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login';
import { RegisterComponent } from './register/register.component';
// import { ProfileSettingsComponent } from './profile_settings';
import { GDPRComponent } from './gdpr/gdpr.component';
import { FriendsComponent } from './friends/friends.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'login', component:LoginComponent},
	{path: 'register', component:RegisterComponent},
	{path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
	{path: 'settings', component: SettingsComponent},
	{path: 'languages', component: LanguageComponent},
	{path: 'chat', component:ChatComponent, canActivate: [AuthGuard]},
	// {path: 'profile-settings', component:ProfileSettingsComponent, canActivate: [AuthGuard]},
	{path : 'gdpr', component:GDPRComponent, canActivate: [AuthGuard]},
	{path : 'friends', component: FriendsComponent, canActivate: [AuthGuard]},
	{path : 'contact', component: ContactComponent},
	{path : 'about', component: AboutComponent},
];