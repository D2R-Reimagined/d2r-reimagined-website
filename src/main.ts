import Aurelia from 'aurelia';
import { RouterConfiguration } from '@aurelia/router';

import '@material/web/all';

import * as Elements from './resources/elements/index.js';
import * as Resources from './resources/index.js';
import { App } from './app.js';
import { cleanCurrentUrl } from './utilities/url-sanitize.js';

import './styles/tailwind.css';
import 'flowbite';

// Global URL cleanup on initial load
cleanCurrentUrl();

// Also clean URL on browser navigation (back/forward) without reloading
window.addEventListener('popstate', () => {
    cleanCurrentUrl();
});

void Aurelia
    .register(
        RouterConfiguration.customize({
            //title: "Betsy Bot Admin Panel",
            useUrlFragmentHash: false,
        }),
    )
    .register(Resources)
    .register(Elements)
    .app(App)
    .start();
