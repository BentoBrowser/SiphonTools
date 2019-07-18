import ElementAnnotation, {ElementSerializedAnnotation} from './element_annotation'
import {Dimensions} from './anchored_annotation'

export interface ImageSerializedAnnotation extends ElementSerializedAnnotation {
    src: string;
    cropping: Dimensions | null;
}

export default class Image extends ElementAnnotation{
    public src: string
    public allReferences: Element[]
    public cropping: Dimensions | null

    public constructor(imageNode: HTMLImageElement, cropping: Dimensions) {
        super(imageNode); //Rect should be an object with
        if (imageNode.tagName == "IMG") {
            this.src = imageNode.src
            this.allReferences = Array.from(document.querySelectorAll('img')).filter((elem): boolean => elem.src == this.src)
            this.cropping = null
            this.text = imageNode.getAttribute('alt') || ""//Save the alt text as the source text
        } else { //Assume background image
            let urlMatch = /(?:\(['"]?)(.*?)(?:['"]?\))/
            let backgroundImage = window.getComputedStyle(imageNode).backgroundImage
            if (backgroundImage) {
                let match = backgroundImage.match(urlMatch)
                this.src = (match)? match[1]:""
            } else {
                this.src = ""
            }

            this.allReferences = Array.from(document.querySelectorAll(imageNode.tagName)).filter((elem): boolean => window.getComputedStyle(elem).backgroundImage == backgroundImage)
            this.cropping = null
            this.text = imageNode.innerText
        }
        if (cropping) { //Rect is an optional cropping we have for the image
            this.cropping = {
                left: cropping.left || 0,
                right: cropping.right || 0,
                top: cropping.top || 0,
                bottom: cropping.bottom || 0
            }
        }
    }

    public serialize(): ImageSerializedAnnotation {
        let save = super.serialize()
        return Object.assign(save, {src: this.src, cropping: this.cropping})
    }

    public deserialize(serialized: ImageSerializedAnnotation): void {
        super.deserialize(serialized)
        this.src = serialized.src
        this.cropping = serialized.cropping
    }

    public rehydrate(): boolean {
        super.rehydrate()
        this.allReferences = Array.from(document.querySelectorAll('img')).filter((elem): boolean => elem.src == this.src)
        if (!this.element) {
            this.element = this.allReferences[0] as HTMLElement
        }
        return !!this.element
    }

    public mark(): void {
        this.allReferences.forEach((): void => {
            this.element.classList.add(`siphon-image`)
            this.element.classList.add(`siphon-annotation-${this.key}`);
        })
    }

    public unmark(): void {
        this.allReferences.forEach((): void => {
            this.element.classList.remove(`siphon-image`)
            this.element.classList.remove(`siphon-annotation-${this.key}`)
        })
    }
}
