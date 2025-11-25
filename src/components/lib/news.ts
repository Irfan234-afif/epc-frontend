import { frappe } from './frappe';
import { NewsResponse } from './types';

async function getNews(): Promise<NewsResponse[] | null> {
    try {
        const res = await frappe.db().getDocList('Employee News', {
            fields: ['name', 'title', 'short_description', 'description', 'thumbnail'],
        });

        return res.map((item) => ({
            name: item.name,
            title: item.title,
            short_description: item.short_description,
            description: item.description,
            thumbnail: item.thumbnail,
        }));
    } catch (error) {
        console.error('Error fetching news:', error);
        return null;
    }
}

export { getNews };