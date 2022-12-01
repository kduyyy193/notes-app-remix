
import { json, redirect, useLoaderData } from 'build';
import NewNote, { links as newNoteLinks } from '~/components/NewNote';
import { getStoredNotes, storeNotes } from '~/data/note';
import NoteList, {links as stylesNoteList} from "~/components/NoteList"

export function links() {
    return [...newNoteLinks(), ...stylesNoteList()];
  }
export default function NotesPage() {
    const notes = useLoaderData()
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
    const notes = await getStoredNotes();
    if (!notes || notes.length === 0) {
      throw json(
        { message: 'Could not find any notes.' },
        {
          status: 404,
          statusText: 'Not Found',
        }
      );
    }
    return notes;
  }

export async function actions({request}) {
    const formData = await request.formData()
    const noteData = Object.entries(formData)

    if (noteData.title.trim().length < 5) {
        return { message: 'Invalid title - must be at least 5 characters long.' };
      }

    const existingNotes = await getStoredNotes()
    noteData.id = new Date().toISOString()
    const updateNotes = existingNotes.concat(noteData)
    await storeNotes(updateNotes)
    return redirect('/notes')
}