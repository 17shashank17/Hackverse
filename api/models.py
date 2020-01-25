from django.db import models

class Location(models.Model):
    latitude = models.FloatField(null=False)
    longitude = models.FloatField(null=False)
    safe_count = models.IntegerField(default=1)

    def __str__(self):
        return f'Latitude: {self.latitude}, Longitude: {self.longitude}'

class DistressLocation(models.Model):
    latitude = models.FloatField(null=False)
    longitude = models.FloatField(null=False)

    def __str__(self):
        return f'Latitude: {self.latitude}, Longitude: {self.longitude}'