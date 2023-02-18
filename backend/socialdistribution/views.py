from django.http import HttpResponse


def index(request):
    return HttpResponse("Redirect to the Login page")