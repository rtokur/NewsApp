import { Injectable } from '@nestjs/common';
import { publish } from 'rxjs';

@Injectable()
export class NewsService {
    findAll(page = 1, limit = 10) {
        return {
            data: [
                {
                    id: 1,
                    title: 'Breaking News: NestJS is Awesome!',
                    content: 'NestJS continues to gain popularity among developers for building scalable server-side applications.',
                    imageUrl: 'https://nestjs.com/img/logo-small.svg',
                    publishedAt: new Date().toISOString(),
                    category: {
                        id: 1,
                        name: 'Technology'
                    },
                    source: {
                        id: 1,
                        name: 'Tech News Daily',
                        logoUrl: 'https://technewsdaily.com/logo.png'
                    },
                },
                {
                    id: 2,
                    title: 'Tech Trends 2024',
                    content: 'Explore the top technology trends that are shaping the future of software development in 2024.',
                    imageUrl: 'https://example.com/tech-trends-2024.jpg',
                    publishedAt: new Date().toISOString(),
                    category: {
                        id: 1,
                        name: 'Technology'
                    },  
                    source: {
                        id: 2,
                        name: 'Future Tech Weekly',
                        logoUrl: 'https://futuretechweekly.com/logo.png'
                    },
                }
            ],
            meta: {
                page,
                limit,
                totalItems: 128,
                totalPages: Math.ceil(128 / limit),
            },
        };
    }
}
