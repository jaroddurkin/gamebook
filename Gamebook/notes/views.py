from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .forms import NoteForm
from .models import Note


def note_new(request):
    if not request.user.is_authenticated:
        return redirect("login")

    note = Note()
    note.author = request.user
    note.save()
    return redirect('note_edit', note.id)


def note_edit(request, note_id):
    current_note = get_object_or_404(Note, id=note_id, author=request.user, is_deleted=False)

    if request.method == "POST":
        form = NoteForm(request.POST, instance=current_note)
        if form.is_valid():
            note = form.save(commit=False)
            note.save()
            return redirect('notes')
    else:
        form = NoteForm(instance=current_note)
    return render(request, 'note_create.html', {'form': form, 'content': current_note.content})


def note_list(request):

    # Is the user allowed to be on this page?
    if not request.user.is_authenticated:
        return redirect("login")

    # Get a list of ALL notes by user
    # Because we put a foreign key connected to CustomUser, every custom user has a set of notes
    # this is auto generated as note_set because we titled the model Note
    notes = request.user.note_set.filter(is_deleted=False).order_by('-last_edited')
    # order by last_edited post, - means descending (I think), remove - to mean ascending

    # context: what variables will we need to use in our template?
    context = {"notes": notes}

    return render(request, 'note_list.html', context)


def note_view(request, note_id):  # If there is a parameter in the url, specify here AND in urls.py

    if not request.user.is_authenticated:
        return redirect("login")

    # get the object, or if it's not found go to 404 page
    # must import get_object_or_404 to use
    note = get_object_or_404(Note, author=request.user, id=note_id, is_deleted=False)
    return render(request, "note_view.html", {"note": note})


def note_delete(request, note_id):
    if not request.user.is_authenticated:
        return redirect("login")

    note = get_object_or_404(Note, author=request.user, id=note_id, is_deleted=False)
    note.is_deleted = True
    note.save()
    return redirect('notes')
