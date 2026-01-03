const BASE_URL = 'https://gnews.io/api/v4';

type GetTopHeadlinesParams = {
    topic?: string;
    lang?: string;
    max?: number;
};

export async function getTopHeadlines({topic = "general", lang = "en", max = 10,}: GetTopHeadlinesParams) {
    const params = new URLSearchParams({
        topic,
        lang,
        max: max.toString(),
        token: process.env.EXPO_PUBLIC_GNEWS_API_KEY!,
    }); 

    const response = await fetch(`${BASE_URL}/top-headlines?${params}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch top headlines');
    }

    return response.json();
}