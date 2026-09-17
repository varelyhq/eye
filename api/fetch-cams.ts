export async function fetchCams() {
    const res = await fetch('/api/cams');
    if (!res.ok) throw new Error('Błąd pobierania listy kamer');
    return res.json();
}
