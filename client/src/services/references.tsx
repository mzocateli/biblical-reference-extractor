export async function fetchReferences(translation: string, text: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ translation, text }),
  });
  return response.json();
}

export function createReferencesElements(data: Record<string, string>): JSX.Element[] {
  const referencesText = [];
  for (const reference in data) {
    referencesText.push(
      <p key={reference}>
        <b>{reference}</b>: {data[reference]}
      </p>
    );
  }
  return referencesText;
}
