/**
 * Copyright (c) Nathan Hahn and hist affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * The framework for a store that should be implimented
 */
const proxyHandler = {
    set(target, prop, value) {
        if (target[prop]) {
            target[prop].update(value);
        }
        else {
            target[prop] = value;
            value.rehydrated = value.rehydrate();
            value.unmark();
            value.mark();
        }
        return true;
    },
    deleteProperty(target, prop) {
        if (prop in target) {
            let annotation = target[prop];
            annotation.unmark();
            delete target[prop];
        }
        return true;
    }
};
export default class Store {
    constructor(typeMap) {
        //Save this information for later use
        const annotations = {}; //Here is our main collection of annotations
        this.annotations = new Proxy(annotations, proxyHandler); //We proxy this for easy updates :)
        this.typeMap = typeMap;
        this.url = window.location.href.split('#')[0]; //Remove the hash
        let pushState = window.history.pushState;
        window.history.pushState = () => {
            pushState.apply(history, arguments);
            let url = window.location.href.split('#')[0]; //Remove the hash
            if (url != this.url) {
                this.onURLChanged(url);
            }
            this.url = url;
        };
        window.addEventListener("popstate", (event) => {
            let url = window.location.href.split('#')[0]; //Remove the hash
            if (url != this.url) {
                this.onURLChanged(url);
            }
            this.url = url;
        });
    }
    //TODO we need to deal with the case where you have the url changing
    //due to javascript
    init() {
        //Setup a mutation observer to constantly try and find missing annotations as
        //Javascript might change out page structure
        let mutationConfig = { childList: true, subtree: true };
        this.observer = new MutationObserver((mutations) => {
            //We have a mutation! Find those missing annotations
            Object.keys(this.annotations).forEach((key) => {
                let annotation = this.annotations[key];
                if (!annotation.rehydrated) {
                    annotation.rehydrated = annotation.rehydrate();
                }
            });
        });
        this.observer.observe(document.body, mutationConfig);
    }
    tearDown() {
        this.observer.disconnect();
    }
    onURLChanged(newUrl) {
        //NO-OP right now
    }
    saveAnnotation(annotation) {
        this.annotations[annotation.key] = annotation;
        let serialized = annotation.serialize();
        serialized.type = Object.keys(this.typeMap).find(key => this.typeMap[key] === annotation.constructor);
        serialized.url = this.url;
        return serialized;
    }
    removeAnnotation(annotation) {
        delete this.annotations[annotation.key];
    }
    updateAnnotation(annotation) {
        let currentAnnotation = this.annotations[annotation.key];
        currentAnnotation.update(annotation);
    }
    importAnnotation(serialized) {
        let type = this.typeMap[serialized.type];
        if (!type) {
            console.error("Unrecognized annotation type!");
            return;
        }
        let annotation = Object.create(type.prototype);
        annotation.deserialize(serialized);
        this.annotations[serialized.key] = annotation;
        return annotation;
    }
    addComment(annotationId, commentBody) {
        console.error("Please impliment this store method for adding comments");
    }
    removeComment(annotationId, commentId) {
        console.error("Please impliment this store method for removing comments");
    }
    editComment(annotationId, commentId, edits) {
        console.error("Please impliment this store method for editing comments");
    }
}
//# sourceMappingURL=store.js.map