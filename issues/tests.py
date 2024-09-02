from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Issue

class IssueAPITests(APITestCase):
    def setUp(self):
        # Create some test data
        self.issue1 = Issue.objects.create(title="Test Issue 1", description="Description for test issue 1")
        self.issue2 = Issue.objects.create(title="Test Issue 2", description="Description for test issue 2")
        self.issue3 = Issue.objects.create(title="Test Issue 3", description="Description for test issue 3")
        self.list_url = reverse('issue-list')

    def test_list_issues(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Since we return a random issue

    def test_create_issue(self):
        data = {
            "title": "New Test Issue",
            "description": "Description for new test issue"
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Issue.objects.count(), 4)
        self.assertEqual(Issue.objects.last().title, "New Test Issue")

    def test_update_issue(self):
        url = reverse('issue-detail', args=[self.issue1.id])
        data = {
            "title": "Updated Test Issue",
            "description": "Updated description for test issue"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.issue1.refresh_from_db()
        self.assertEqual(self.issue1.title, "Updated Test Issue")
        self.assertEqual(self.issue1.description, "Updated description for test issue")

    def test_delete_issue(self):
        url = reverse('issue-detail', args=[self.issue1.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Issue.objects.count(), 2)