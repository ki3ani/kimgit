import random
from django.core.management.base import BaseCommand
from issues.models import Issue

class Command(BaseCommand):
    help = 'Generate 100 random issues'

    def handle(self, *args, **kwargs):
        Issue.objects.all().delete()  # Clear existing issues
        for i in range(100):
            title = f"Issue {i+1}"
            description = f"This is the description for issue {i+1}."
            Issue.objects.create(title=title, description=description)
        self.stdout.write(self.style.SUCCESS('Successfully generated 100 issues'))