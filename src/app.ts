import { route } from '@aurelia/router';

@route({
    title: 'D2R Reimagined',
    routes: [
        {
            path: '',
            component: import('./pages/home/home'),
            title: 'Home',
        },
        {
            path: 'cube-recipes',
            component: import('./pages/cube-recipes/cube-recipes'),
            title: 'Cube Recipes',
        },
        {
            path: 'uniques',
            component: import('./pages/uniques/uniques'),
            title: 'Uniques',
        },
        {
            path: 'sets',
            component: import('./pages/sets/sets'),
            title: 'Sets',
        },
        {
            path: 'runewords',
            component: import('./pages/runewords/runewords'),
            title: 'Runewords',
        },
        {
            path: 'grail',
            component: import('./pages/grail/grail'),
            title: 'Holy Grail',
        }
    ]
})

export class App {
    fonts: Font[] = [
        { class: 'font-classic', name: 'Classic' },
        { class: 'font-resurrected', name: 'Resurrected' },
        { class: 'font-neutral', name: 'Neutral' },
    ];

    attached() {
        this.loadFont();
    }

    handleFontSelected(font: Font) {
        window.localStorage.setItem('font', font.class);
        this.loadFont();
    }

    loadFont() {
        const selectedFont = window.localStorage.getItem('font') || 'font-resurrected';
        if (selectedFont) {
            const allClasses = this.fonts.map(font => font.class);
            document.body.classList.remove(...allClasses);
            document.body.classList.add(selectedFont);
        }
    }
}

type Font = {
    class: string;
    name: string;
};
