export class UrlModel {
    private static Urls: UrlModel[] = [];

    public readonly id: number;
    public readonly url: string;
    public readonly shortUrl: string;
    public readonly created_at: Date;

    public _number_of_visits: number;

    public get number_of_visits() {
        return this._number_of_visits;
    }

    constructor(url: string) {
        this.id = UrlModel.Urls.length + 1;
        this.url = url;
        this.shortUrl = UrlModel.generateShortUrl();
        this.created_at = new Date();
        this._number_of_visits = 0;
        UrlModel.Urls.push(this);
    }

    private static generateShortUrl() {
        return `/${Math.random().toString(36).substring(2, 8)}`;
    }

    public async delete() {
        // Delete the URL from the database
    }

    public static getAll() {
        // Get all the URLs from the database
        return UrlModel.Urls.map((url) => {
            return {
                id: url.id,
                url: url.url,
                shortUrl: url.shortUrl,
                created_at: url.created_at
            };
        });
    }

    public static getNormalUrl(shortUrl: URL) {
        console.log(shortUrl.pathname);
        const url = UrlModel.Urls.find((url) => url.shortUrl === shortUrl.pathname);
        if (url) {
            url._number_of_visits++;
            return url.url;
        }
        return null;
    }
}