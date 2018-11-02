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
   }

   deleteProperty(target, prop) {
     if (prop in target) {
       let annotation = target[prop]
       annotation.unmark();
       delete target[prop];
     }
   }
 }

 export default class Store {
   constructor(user, triggerMap) {
     //Save this information for later use
     this.user = user; //The current user
     const highlights = {}; //Here is our main collection of highlights
     this.highlights = new Proxy(highlights, proxyHandler) //We proxy this for easy updates :)
     this.init();
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

     //Initialize Triggers
     Object.keys(this.triggerMap).forEach(AnnotationType => {
       let triggers = this.triggerMap[AnnotationType]
       triggers.forEach(triggerSet => {
         let Trigger = triggerSet.trigger
         triggerSet.instance = new Trigger(triggerSet, AnnotationType, this)
         triggerSet.instance.init(input)
       })
     })
   }

   tearDown() {
     this.observer.disconnect();
     //Initialize Triggers
     Object.keys(this.triggerMap).forEach(AnnotationType => {
       let triggers = this.triggerMap[AnnotationType]
       triggers.forEach(triggerSet => {
         triggerSet.instance.tearDown()
       })
     })
   }

   saveAnnotation(annotation) {
     this.highlights[annotation.key] = annotation
     let serialized = annotation.serialize();
     serialized.type = this.triggerMap[serialized.type]
     return serialized
   }

   removeAnnotation(annotation) {
     delete this.highlights[annotation.key]
   }

   importAnnotation(serialized) {
     let type = Object.keys(this.triggerMap).find(key => object[key] === value.type);
     if (!type) {
       console.error("Unrecognized annotation type!")
       return
     }
     let annotation = Object.create(type)
     annotation.deserialize(serialized)
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
