declare module 'simplelightbox' {
    interface SimpleLightbox {
        new (element: string, options?: SimpleLightboxOptions): SimpleLightbox;
        destroy(): void;
    }
    interface SimpleLightboxOptions {
        captionPosition: string;
        captionsData: string;
    }
    const SimpleLightbox: SimpleLightbox;
    export = SimpleLightbox;
}
