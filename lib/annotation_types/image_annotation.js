import ElementAnnotation from './element_annotation';
export default class Image extends ElementAnnotation {
    constructor(imageNode, cropping) {
        super(imageNode); //Rect should be an object with
        if (imageNode.tagName == "IMG") {
            this.src = imageNode.src;
            this.allReferences = Array.from(document.querySelectorAll('img')).filter((elem) => elem.src == this.src);
            this.cropping = null;
            this.text = imageNode.getAttribute('alt') || ""; //Save the alt text as the source text
        }
        else { //Assume background image
            let urlMatch = /(?:\(['"]?)(.*?)(?:['"]?\))/;
            let backgroundImage = window.getComputedStyle(imageNode).backgroundImage;
            if (backgroundImage) {
                let match = backgroundImage.match(urlMatch);
                this.src = (match) ? match[1] : "";
            }
            else {
                this.src = "";
            }
            this.allReferences = Array.from(document.querySelectorAll(imageNode.tagName)).filter((elem) => window.getComputedStyle(elem).backgroundImage == backgroundImage);
            this.cropping = null;
            this.text = imageNode.innerText;
        }
        if (cropping) { //Rect is an optional cropping we have for the image
            this.cropping = {
                left: cropping.left || 0,
                right: cropping.right || 0,
                top: cropping.top || 0,
                bottom: cropping.bottom || 0
            };
        }
    }
    serialize() {
        let save = super.serialize();
        return Object.assign(save, { src: this.src, cropping: this.cropping });
    }
    deserialize(serialized) {
        super.deserialize(serialized);
        this.src = serialized.src;
        this.cropping = serialized.cropping;
    }
    rehydrate() {
        super.rehydrate();
        this.allReferences = Array.from(document.querySelectorAll('img')).filter((elem) => elem.src == this.src);
        if (!this.element) {
            this.element = this.allReferences[0];
        }
        return !!this.element;
    }
    mark() {
        this.allReferences.forEach(() => {
            this.element.classList.add(`siphon-image`);
            this.element.classList.add(`siphon-annotation-${this.key}`);
        });
    }
    unmark() {
        this.allReferences.forEach(() => {
            this.element.classList.remove(`siphon-image`);
            this.element.classList.remove(`siphon-annotation-${this.key}`);
        });
    }
}
//# sourceMappingURL=image_annotation.js.map