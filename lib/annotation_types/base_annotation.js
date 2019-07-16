/**
 * Copyright (c) Nathan Hahn and hist affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Serves as the base for all annotations. Has some basic fields that all annotations should
 */
import uuid from 'uuid/v4';
//TODO allow for a custom UUID generator?
export default class BaseAnnotation {
    constructor() {
        this.key = uuid(); //UUID for this annotation
        this.type = 0;
        this.rehydrated = true; //Determine if we have found this highlight yet (and if we haven't keep trying with the MutationObserver)
        this.comments = []; //A list of comments associated with this annotation
        this.creator = "unknown"; //Who made this thing
        this.creationDate = Date.now(); //When was it made?
        this.text = "";
    }
    update(serialized) {
        this.comments = serialized.comments;
        this.creator = serialized.creator;
        this.creationDate = serialized.creationDate;
    }
    deserialize(serialized) {
        this.key = serialized.key;
        this.rehydrated = false;
        this.comments = serialized.comments;
        this.type = serialized.type;
        this.creator = serialized.creator || "unknown";
        this.creationDate = serialized.creationDate || Date.now();
    }
    //How we can serialize this annotation
    serialize() {
        return { key: this.key, type: this.type, text: this.text, comments: this.comments, creator: this.creator, creationDate: this.creationDate };
    }
    //Rehydrates the object for use on the dom. This can fail. Returns true if the item is already rehydrated, or can be sucessfully rehydrated.
    //Returns false otherwise.
    rehydrate() {
        return true;
    }
    mark() {
        //No Op  -- please impliment in a base class
    }
    unmark() {
        //No Op  -- please impliment in a base class
    }
}
//# sourceMappingURL=base_annotation.js.map