import health from '../../../../static/data/keyed/health-calculator.json';
import type {HealthData} from '$lib/health-calculator';

export function load() {
    return {health: health as HealthData};
}
