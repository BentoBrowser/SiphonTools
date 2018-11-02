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
     } else {
       target[prop] = value
       value.rehydrated = value.rehydrate();
       value.unmark();
       value.mark();
     }
     return true;
   },
   deleteProperty(target, prop) {
     if (prop in target) {
       let annotation = target[prop]
       annotation.unmark();
       delete target[prop];
     }
     return true
   }
 }

 export default class Store {
   constructor(user, typeMap) {
     //Save this information for later use
     this.user = user; //The current user
     const highlights = {}; //Here is our main collection of highlights
     this.highlights = new Proxy(highlights, proxyHandler) //We proxy this for easy updates :)
     this.typeMap = typeMap
   }

   //TODO we need to deal with the case where you have the url changing
   //due to javascript

   init() {
     //Setup a mutation observer to constantly try and find missing highlights as
     //Javascript might change out page structure
     let mutationConfig = { childList: true, subtree: true };
     this.observer = new MutationObserver((mutations) => {
       //We have a mutation! Find those missing highlights
       Object.keys(this.highlights).forEach((key) => {
         let annotation = this.highlights[key];
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

   saveAnnotation(annotation) {
     this.highlights[annotation.key] = annotation
     let serialized = annotation.serialize();
     serialized.type = Object.keys(this.typeMap).find(key => this.typeMap[key] === annotation.constructor);
     return serialized
   }

   removeAnnotation(annotation) {
     delete this.highlights[annotation.key]
   }

   updateAnnotation(annotation) {
     let currentAnnotation = this.highlights[annotation.key]
     currentAnnotation.update(annotation)
   }

   importAnnotation(serialized) {
     let type = this.typeMap[serialized.type]
     if (!type) {
       console.error("Unrecognized annotation type!")
       return
     }
     let annotation = Object.create(type.prototype)
     annotation.deserialize(serialized)
     this.highlights[serialized.key] = annotation
     return annotation
   }

   addComment(annotationId, commentBody) {
     console.error("Please impliment this store method for adding comments")
   }

   removeComment(annotationId, commentId) {
     console.error("Please impliment this store method for removing comments")
   }

   editComment(annotationId, commentId, edits) {
     console.error("Please impliment this store method for editing comments")
   }

 }
