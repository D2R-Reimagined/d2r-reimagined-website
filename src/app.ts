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
        ,
        {
            path: 'armors',
            component: import('./pages/bases/armors'),
            title: 'Armor Bases',
        },
        {
            path: 'weapons',
            component: import('./pages/bases/weapons'),
            title: 'Weapon Bases',
        },
        {
            path: 'affixes',
            component: import('./pages/affixes/affixes'),
            title: 'Affixes',
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

    /**
     * Handles font selection from the dropdown and safely closes the <details> element.
     * Using a single method avoids multi‑statement binding expressions that Aurelia disallows.
     */
    selectFont(font: Font, event?: Event) {
        this.handleFontSelected(font);
        // Close the <details> dropdown if the event came from within it
        const target = event?.target as HTMLElement | undefined;
        const details = target?.closest('details') as HTMLDetailsElement | null;
        if (details) {
            details.removeAttribute('open');
        }
        // Also close the mobile nav panel if it is open
        this.closeMobileMenu();
    }

    /**
     * Closes the mobile navigation panel by adding the 'hidden' class back to the container.
     */
    closeMobileMenu() {
        const panel = document.getElementById('navbarSupportedContent');
        if (panel && !panel.classList.contains('hidden')) {
            panel.classList.add('hidden');
        }
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
