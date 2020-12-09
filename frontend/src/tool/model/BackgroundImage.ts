export default class BackgroundImage {
    backgroundImage: HTMLImageElement;
    private imageLoaded: Boolean = false;

    constructor(imageSource: string) {
        this.backgroundImage = new Image();
        this.backgroundImage.src = imageSource;
        this.backgroundImage.onload = this.setImageLoaded.bind(this, true);
    }

    setImageLoaded(imageLoaded: Boolean) {
        this.imageLoaded = imageLoaded;
    }

    toggleImageLoaded() {
        this.imageLoaded = !this.imageLoaded;
    }

    isImageLoaded(): Boolean {
        return this.imageLoaded;
    }
}