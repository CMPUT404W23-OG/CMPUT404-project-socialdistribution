from django.db import models


class Incoming_Node(models.Model):
    Connection_Name = models.CharField(max_length=50)
    url = models.CharField(max_length=300)
    Username = models.CharField(max_length=50)
    Password = models.CharField(max_length=50)

    def __str__(self):
        return self.Connection_Name
    
class Outgoing_Node(models.Model):
    Connection_Name = models.CharField(max_length=50)
    url = models.CharField(max_length=300)
    Username = models.CharField(max_length=50)
    Password = models.CharField(max_length=50)

    def __str__(self):
        return self.Connection_Name