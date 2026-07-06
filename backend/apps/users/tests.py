
#la commande pour lancer les tests unitaires. 
    #docker exec transcendence_backend python manage.py test apps.users.tests --verbosity=2


from unittest.mock import patch, MagicMock
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import SocialAccount

User = get_user_model()


class SocialAuthViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = reverse('social_auth')

    # ------------------------------------------------------------------
    # Helpers : évite de répéter le même mock dans chaque test
    # ------------------------------------------------------------------

    def _mock_google(self, mock_post, mock_get, uid='111', email='ada@gmail.com'):
        mock_post.return_value = MagicMock(json=lambda: {'access_token': 'fake_token'})
        mock_get.return_value  = MagicMock(ok=True, json=lambda: {'sub': uid, 'email': email})

    def _mock_github(self, mock_post, mock_get, uid='222', email='ada@github.com'):
        mock_post.return_value = MagicMock(json=lambda: {'access_token': 'fake_token'})
        mock_get.return_value  = MagicMock(ok=True, json=lambda: {'id': int(uid), 'email': email})

    def _mock_42(self, mock_post, mock_get, uid='333', email='ada@student.42.fr'):
        mock_post.return_value = MagicMock(json=lambda: {'access_token': 'fake_token'})
        mock_get.return_value  = MagicMock(ok=True, json=lambda: {'id': int(uid), 'email': email})

    # ------------------------------------------------------------------
    # 1. Paramètres manquants / invalides
    # ------------------------------------------------------------------

    def test_missing_provider_returns_400(self):
        """Pas de provider → 400"""
        response = self.client.post(self.url, {'code': 'abc'}, format='json')
        self.assertEqual(response.status_code, 400)

    def test_missing_code_returns_400(self):
        """Pas de code → 400"""
        response = self.client.post(self.url, {'provider': 'google'}, format='json')
        self.assertEqual(response.status_code, 400)

    def test_unknown_provider_returns_400(self):
        """Provider inconnu → 400"""
        response = self.client.post(self.url, {'provider': 'twitter', 'code': 'abc'}, format='json')
        self.assertEqual(response.status_code, 400)

    # ------------------------------------------------------------------
    # 2. Échange de code échoue
    # ------------------------------------------------------------------

    @patch('apps.users.views.requests.post')
    def test_code_exchange_fails_returns_400(self, mock_post):
        """Le provider ne renvoie pas d'access_token → 400"""
        mock_post.return_value = MagicMock(json=lambda: {'error': 'invalid_grant'})
        response = self.client.post(self.url, {'provider': 'google', 'code': 'expired'}, format='json')
        self.assertEqual(response.status_code, 400)

    # ------------------------------------------------------------------
    # 3. Nouveau user créé (un par provider)
    # ------------------------------------------------------------------

    @patch('apps.users.views.requests.get')
    @patch('apps.users.views.requests.post')
    def test_google_new_user_gets_tokens(self, mock_post, mock_get):
        """Premier login Google → crée user + SocialAccount, retourne tokens JWT"""
        self._mock_google(mock_post, mock_get)

        response = self.client.post(self.url, {'provider': 'google', 'code': 'c'}, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'ada@gmail.com')
        self.assertEqual(User.objects.count(), 1)
        self.assertTrue(User.objects.get().is_online)
        self.assertEqual(SocialAccount.objects.filter(provider='google').count(), 1)

    @patch('apps.users.views.requests.get')
    @patch('apps.users.views.requests.post')
    def test_github_new_user_gets_tokens(self, mock_post, mock_get):
        """Premier login GitHub → crée user + SocialAccount"""
        self._mock_github(mock_post, mock_get)

        response = self.client.post(self.url, {'provider': 'github', 'code': 'c'}, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(SocialAccount.objects.filter(provider='github').count(), 1)

    @patch('apps.users.views.requests.get')
    @patch('apps.users.views.requests.post')
    def test_42_new_user_gets_tokens(self, mock_post, mock_get):
        """Premier login 42 → crée user + SocialAccount"""
        self._mock_42(mock_post, mock_get)

        response = self.client.post(self.url, {'provider': '42', 'code': 'c'}, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(SocialAccount.objects.filter(provider='42').count(), 1)

    # ------------------------------------------------------------------
    # 4. User existant retrouvé (pas de doublon)
    # ------------------------------------------------------------------

    @patch('apps.users.views.requests.get')
    @patch('apps.users.views.requests.post')
    def test_second_login_reuses_existing_user(self, mock_post, mock_get):
        """Deux logins avec le même compte Google → toujours 1 seul user"""
        self._mock_google(mock_post, mock_get, uid='111', email='ada@gmail.com')
        self.client.post(self.url, {'provider': 'google', 'code': 'c1'}, format='json')

        self._mock_google(mock_post, mock_get, uid='111', email='ada@gmail.com')
        self.client.post(self.url, {'provider': 'google', 'code': 'c2'}, format='json')

        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(SocialAccount.objects.count(), 1)

    @patch('apps.users.views.requests.get')
    @patch('apps.users.views.requests.post')
    def test_different_providers_create_separate_accounts(self, mock_post, mock_get):
        """Google uid=1 et GitHub uid=1 sont deux users distincts"""
        self._mock_google(mock_post, mock_get, uid='1', email='google@test.com')
        self.client.post(self.url, {'provider': 'google', 'code': 'c1'}, format='json')

        self._mock_github(mock_post, mock_get, uid='1', email='github@test.com')
        self.client.post(self.url, {'provider': 'github', 'code': 'c2'}, format='json')

        self.assertEqual(SocialAccount.objects.count(), 2)

    # ------------------------------------------------------------------
    # 5. Profil introuvable chez le provider
    # ------------------------------------------------------------------

    @patch('apps.users.views.requests.get')
    @patch('apps.users.views.requests.post')
    def test_profile_fetch_fails_returns_400(self, mock_post, mock_get):
        """Le provider renvoie une erreur sur /userinfo → 400"""
        mock_post.return_value = MagicMock(json=lambda: {'access_token': 'tok'})
        mock_get.return_value  = MagicMock(ok=False)

        response = self.client.post(self.url, {'provider': 'google', 'code': 'c'}, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(User.objects.count(), 0)

    # ------------------------------------------------------------------
    # 6. GitHub sans email (email privé sur GitHub)
    # ------------------------------------------------------------------

    @patch('apps.users.views.requests.get')
    @patch('apps.users.views.requests.post')
    def test_github_without_email_uses_fallback(self, mock_post, mock_get):
        """GitHub peut ne pas renvoyer d'email → on génère un email fallback"""
        mock_post.return_value = MagicMock(json=lambda: {'access_token': 'tok'})
        mock_get.return_value  = MagicMock(ok=True, json=lambda: {'id': 999, 'email': None})

        response = self.client.post(self.url, {'provider': 'github', 'code': 'c'}, format='json')

        self.assertEqual(response.status_code, 200)
        user = User.objects.get()
        self.assertEqual(user.email, 'github_999@noreply.github.com')
