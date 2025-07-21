import Aurelia from 'aurelia';
import { RouterConfiguration } from '@aurelia/router';

import '@material/web/all';
import 'bootstrap';

import { App } from './app';
import * as Resources from './resources';

import 'bootstrap/dist/css/bootstrap.css';
import '@betsybot/betsy-web-components/dist/style.css';

import * as BetsyWebComponentsPlugin from '@betsybot/betsy-web-components';
import * as Elements from './resources/elements';

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
