import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Parse the form data
    const formData = await request.formData()
    const query = formData.get('query')

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
    }

    // Fetch data from the custom search API
    // const apiKey = process.env.GOOGLE_SEARCH_API_KEY
    // const cx = process.env.GOOGLE_SEARCH_CX
    const url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyAmfGW3UIwV5-ridIjdi4t3SuBV1xwsy9M&cx=73a4a626f8a93470a&q=${encodeURIComponent(query)}&num=5`

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`)
    }

    const data = await response.json()

    // Extract the top 5 results
    const topResults = data.items?.slice(0, 5).map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      image: item.pagemap?.cse_image?.[0]?.src,
    })) || []

    console.log('Search API results:', topResults)

    return NextResponse.json({ results: topResults })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
