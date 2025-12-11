import { frappe } from './frappe';
import { NewsResponse } from './types';

async function getNews(): Promise<NewsResponse[] | null> {
    try {
        const res = await frappe.db().getDocList('Employee News', {
            fields: ['name', 'title', 'short_description', 'description', 'thumbnail', 'creation'],
            filters: [
                ['enabled', '=', 1],
            ]
        });

        return res.map((item) => ({
            name: item.name,
            title: item.title,
            short_description: item.short_description,
            description: item.description,
            thumbnail: item.thumbnail,
            potrait_image: null,
            creation: item.creation,
        }));
    } catch (error) {
        console.error('Error fetching news:', error);
        return null;
    }
}

async function getNewsByName(name: string): Promise<NewsResponse | null> {
    try {
        const res = await frappe.db().getDoc('Employee News', name);
        if (!res) {
            return null;
        }
        return {
            name: res.name,
            title: res.title,
            short_description: res.short_description,
            description: res.description,
            thumbnail: res.thumbnail,
            potrait_image: res.potrait_image,
            creation: res.creation,
        };
    } catch (error) {
        console.error('Error fetching news by name:', error);
        return null;
    }
}

export { getNews, getNewsByName };