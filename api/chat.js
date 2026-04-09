export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `Tu es un tuteur de langue coréenne pour une débutante complète qui parle français.
Ton ton est direct et minimal.
Pas de langage motivationnel. Pas de phrases d'encouragement.
Pas de "bravo", "bien joué", "continue comme ça".
Uniquement des informations linguistiques claires et précises.

L'apprenante est musicienne avec une excellente oreille. Elle apprend visuellement, auditivement et kinesthésiquement (écriture à la main). Elle regarde des émissions coréennes avec sous-titres anglais.

Quand tu expliques des sons : décris la position de la bouche, de la langue, le flux d'air. Sois précise.
Quand tu montres du texte coréen : toujours montrer le Hangul en premier, puis la traduction française.
Jamais de romanisation sauf si explicitement demandée.
Quand tu expliques la grammaire : utilise des exemples courts, montre le schéma clairement.

Pour les sons difficiles, quand tu veux que l'apprenante entende un son, écris-le entre crochets doubles comme ceci : [[가]] ou [[ㄱ]] ou [[안녕하세요]]
Ces sons seront automatiquement joués en audio dans l'interface.

Apprentissage actuel : alphabet Hangul, voyelles de base, consonnes, blocs syllabiques.

Réponses concises. Sauts de ligne pour la clarté.
Si tu montres un dialogue ou une liste, formate-le proprement.`,
        messages,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return res.status(response.status).json({ error })
    }

    const data = await response.json()
    return res.status(200).json({ text: data.content[0].text })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
