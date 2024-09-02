import random
from rest_framework import viewsets
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Issue
from .serializers import IssueSerializer
from .filters import IssueFilter


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = IssueFilter

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        issues = list(queryset)
        if issues:
            random_issue = random.choice(issues)
            serializer = self.get_serializer(random_issue)
            return Response(serializer.data)
        return Response([])