import { onLanguageChanged, t } from '../../utilities/translation-store';

const DISCORD_URL = 'https://discord.gg/9zZkYrSA8C';

export class Home {
    public discordUrl: string = DISCORD_URL;
    public discordBefore: string = '';
    public discordAfter: string = '';

    private unsubscribe?: () => void;

    public attached(): void {
        this.refreshDiscordParts();
        this.unsubscribe = onLanguageChanged(() => this.refreshDiscordParts());
    }

    public detached(): void {
        this.unsubscribe?.();
        this.unsubscribe = undefined;
    }

    private refreshDiscordParts(): void {
        const template = t('home_discord_text');
        const idx = template.indexOf('{0}');
        if (idx >= 0) {
            this.discordBefore = template.substring(0, idx);
            this.discordAfter = template.substring(idx + '{0}'.length);
        } else {
            this.discordBefore = template;
            this.discordAfter = '';
        }
    }
}
