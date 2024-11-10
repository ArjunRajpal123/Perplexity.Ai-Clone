import { NextResponse } from 'next/server'
import { parse } from 'node-html-parser';
import OpenAI from "openai";
const openai = new OpenAI();


export async function POST(request: Request) {
  try {
    // Parse the form data
    const formData = await request.formData()
    const query = formData.get('query')

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=73a4a626f8a93470a&q=${encodeURIComponent(query)}&num=5`

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

    // for each result extract the content from the page and pass it to openai to summarize
    // first make get request to the page and extract the content
    // then convert the content to a summary using open ai api
    // then return the summary as a snippet

    /// get requests go here
    
    let rawText = ""

    topResults.forEach(async (result: {
        title: string,
        link: string,
        snippet: string,
        image: string,
      }) => {
        const pageContent = await fetch(result.link)
        const content = await pageContent.text()
        
        const doc = parse(content);
        const paragraphs = doc.querySelectorAll('p');
        const paragraphTexts = Array.from(paragraphs).map(p => p.textContent);
        const text = paragraphTexts.join('\n');
        rawText += text
    })


    // openai api goes here
    const openaiData = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: `You are a search feature like perplexity summarize this ${rawText } and format response in markdown` },
            { role: "user", content: `Query: ${query}` },
            ],
        max_tokens: 4000,
    })
    const summary = openaiData.choices[0].message.content
    return NextResponse.json({summary ,results: topResults })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
