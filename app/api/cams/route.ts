import { API_URL } from "@/lib/api-url";

export async function GET() {
    const res = await fetch(`${API_URL}/cams`);
    if (!res.ok) {
        return Response.json({ error: 'Błąd pobierania listy kamer' }, { status: res.status });
    }
    const data = await res.json();
    return Response.json(data);
}
