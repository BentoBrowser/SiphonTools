import ElementAnnotation, {ElementSerializedAnnotation} from './element_annotation'

export interface LinkSerializedAnnotation extends ElementSerializedAnnotation {
    href: string;
}

export default class Link extends ElementAnnotation{

    public href: string
    public allReferences: Element[]

    public constructor(linkNode: HTMLLinkElement) {
        super(linkNode);
        this.href = linkNode.href
        this.allReferences = Array.from(document.querySelectorAll('a')).filter((elem): boolean => elem.href == this.href)
        this.text = linkNode.innerText
    }

    public serialize(): LinkSerializedAnnotation {
        let save = super.serialize()
        return Object.assign(save, {href: this.href})
    }

    public deserialize(serialized: LinkSerializedAnnotation): void {
        super.deserialize(serialized)
        this.href = serialized.href
    }

    public rehydrate(): boolean {
        super.rehydrate()
        this.allReferences = Array.from(document.querySelectorAll('a')).filter((elem): boolean => elem.href == this.href)
        if (!this.element) {
            this.element = this.allReferences[0] as HTMLElement
        }
        return !!this.element
    }

    public mark(): void {
        this.allReferences.forEach((): void => {
            this.element.classList.add(`siphon-link`)
            this.element.classList.add(`siphon-annotation-${this.key}`);
        })
    }

    public unmark(): void {
        this.allReferences.forEach((): void  => {
            this.element.classList.remove(`siphon-link`)
            this.element.classList.remove(`siphon-annotation-${this.key}`)
        })
    }
}
