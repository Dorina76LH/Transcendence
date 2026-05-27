from django.contrib.auth import get_user_model
from django.shortcuts import render
from django.db import models
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.chat.models import Conversation, Message
from apps.friends.models import FriendRequest, Friendship

