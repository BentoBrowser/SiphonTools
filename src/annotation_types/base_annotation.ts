/**
 * Copyright (c) Nathan Hahn and hist affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Serves as the base for all annotations. Has some basic fields that all annotations should
 */

import uuid from 'uuid/v4'

export interface SerializedAnnotation {
    key: string;
    type: number;
    comments: {key: string}[];
    creator: string;
    text: string;
    creationDate: number;
}

//TODO allow for a custom UUID generator?
export default class BaseAnnotation {

    public key = uuid(); //UUID for this annotation
    public type = 0;
    public rehydrated = true; //Determine if we have found this highlight yet (and if we haven't keep trying with the MutationObserver)
    public comments: {key: string}[] = [] //A list of comments associated with this annotation
    public creator = "unknown" //Who made this thing
    public creationDate = Date.now() //When was it made?
    public text = ""

    public update(serialized: SerializedAnnotation): void { //A serialized annotation representation we want to use to update our current annotation
        this.comments = serialized.comments
        this.creator = serialized.creator
        this.creationDate = serialized.creationDate
    }

    public deserialize(serialized: SerializedAnnotation): void {
        this.key = serialized.key
        this.rehydrated = false
        this.comments = serialized.comments
        this.type = serialized.type
        this.creator = serialized.creator || "unknown"
        this.creationDate = serialized.creationDate || Date.now()
    }

    //How we can serialize this annotation
    public serialize(): SerializedAnnotation {
        return {key: this.key, type: this.type, text: this.text, comments: this.comments, creator: this.creator, creationDate: this.creationDate};
    }

    //Rehydrates the object for use on the dom. This can fail. Returns true if the item is already rehydrated, or can be sucessfully rehydrated.
    //Returns false otherwise.
    public rehydrate(): boolean {
        return true;
    }

    public mark(): void {
    //No Op  -- please impliment in a base class
    }

    public unmark(): void {
    //No Op  -- please impliment in a base class
    }

}
