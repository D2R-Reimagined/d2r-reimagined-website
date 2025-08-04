import Aurelia from 'aurelia';
import { RouterConfiguration } from '@aurelia/router';

import '@material/web/all';
import 'tailwindcss/index.css';

import * as Elements from './resources/elements/index.js';
import * as Resources from './resources/index.js';
import { App } from './app.js';

import '@betsybot/betsy-web-components/dist/style.css';

import * as BetsyWebComponentsPlugin from '@betsybot/betsy-web-components';

void Aurelia
    .register(
        RouterConfiguration.customize({
            //title: "Betsy Bot Admin Panel",
            useUrlFragmentHash: false,
        }),
    )
    .register(BetsyWebComponentsPlugin)
    .register(Resources)
    .register(Elements)
    .app(App)
    .start();
