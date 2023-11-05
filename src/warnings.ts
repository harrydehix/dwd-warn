/**
 * The raw warnings object provided in the official JSONP file.
 */
export type RawWarnings = {
    time: number;
    copyright: string;
    warnings: {
        [Property in string]: {
            state: string;
            type: number;
            level: number;
            start: number;
            end: number;
            regionName: string;
            event: string;
            headline: string;
            instruction: string;
            description: string;
            stateShort: string;
            altitudeStart: number | null;
            altitudeEnd: number | null;
        }[];
    };
};

/**
 * Warnings for a particular region.
 */
export class RegionWarnings {
    regionName: string;
    state: string;
    stateShort: string;
    id: string;
    warnings: {
        type: number;
        level: number;
        start: Date;
        end: Date;
        event: string;
        headline: string;
        instruction: string;
        description: string;
        altitudeStart: number | null;
        altitudeEnd: number | null;
    }[];

    constructor(
        id: string,
        rawRegionWarnings: RawWarnings["warnings"][string]
    ) {
        this.id = id;
        this.regionName = rawRegionWarnings[0].regionName;
        this.state = rawRegionWarnings[0].state;
        this.stateShort = rawRegionWarnings[0].stateShort;
        this.warnings = rawRegionWarnings.map((warning) => {
            return {
                type: warning.type,
                level: warning.level,
                start: new Date(warning.start),
                end: new Date(warning.end),
                event: warning.event,
                headline: warning.headline,
                instruction: warning.instruction,
                description: warning.description,
                altitudeStart: warning.altitudeStart,
                altitudeEnd: warning.altitudeEnd,
            };
        });
    }
}

/**
 * API to the DWD warnings.
 */
export default class Warnings {
    private readonly json: RawWarnings;

    private constructor(json: any) {
        this.json = json;
    }

    /**
     * Gets the time of the latest update.
     * @returns
     */
    public time() {
        return new Date(this.json.time);
    }

    /**
     * Gets the raw unprocessed warnings object.
     * @returns the raw unprocessed warnings
     */
    public raw(): RawWarnings {
        return this.json;
    }

    /**
     * Fetches the warnings from the official dwd server (`https://www.dwd.de/DWD/warnungen/warnapp/json/warnings.json`).
     * @returns all warnings
     */
    public static async fetchWarnings() {
        const resp = await fetch(
            "https://www.dwd.de/DWD/warnungen/warnapp/json/warnings.json"
        );
        const json = JSON.parse(
            (await resp.text())
                .replace("warnWetter.loadWarnings(", "")
                .replace(");", "")
        );
        return new Warnings(json);
    }

    /**
     * Filters the current warnings by an id.
     * @param id
     * @returns the warnings belonging to the specified id
     */
    public filterById(id: string) {
        for (const key in this.json.warnings) {
            if (key === id) {
                return new RegionWarnings(key, this.json.warnings[key]);
            }
        }
    }

    /**
     * Filters the current warnings by a region name.
     * @param regionName the name of the region (e.g. "Kreis Ahrweiler")
     * @returns the current warnings of the region
     */
    public filterByRegionName(regionName: string) {
        for (const key in this.json.warnings) {
            if (this.json.warnings[key][0].regionName === regionName) {
                return new RegionWarnings(key, this.json.warnings[key]);
            }
        }
    }
}
