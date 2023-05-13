from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from django.core.files.storage import FileSystemStorage


# Create your views here.
def create_community(req: HttpRequest):
	if req.method == 'POST':
		commName = req.POST.get('communityName', None)
		topic = req.POST.get('topic', None)
		desc = req.POST.get('description', None)
		icon_img = req.FILES.get('communityIcon', None)
		print(commName, topic, desc, icon_img)
		if icon_img:
			fs = FileSystemStorage(location='static/userassets')
			fs.save(icon_img.name, icon_img)
	return JsonResponse({"status": "success"})
