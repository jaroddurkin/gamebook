Gamebook


This project uses Python 3 and a Django 2.2.1 webserver.


If you do not have Django installed, run:

$ pip install Django


Before running the server for the first time, you should make 
migrations. Inside the Gamebook folder, use:

$ python manage.py makemigrations

$ python manage.py migrate


If both of these are complete, go inside the Gamebook folder, run the 
server with:

$ python manage.py runserver
