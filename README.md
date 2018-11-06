# SiphonTools

SiphonTools is a library for easy creation and management of webpage annotations. 

## Installation

Install siphon-tools using npm or yarn

`npm install --save bentobrowser/siphon-tools`

`yarn add bentobrowser/siphon-tools`

## Usage

SiphonTools is broken up into three main components: a store for saving annotations, annotation objects that represent annotated sections of a web page, and "selectors" - a set of declarative event handler for managing the creation of annotations.

SiphonTools provides a number of common versions of these different items. A simple configuration of SiphonTools for saving highlights on a page might look as follow:

```javascript
import SiphonTools from 'siphon-tools'
import {Highlight, HighlightSelector, Store} from 'siphon-tools

let store = new Store("user123", {
  "Highlight": Highlight
 })
 store.init();
 
 SiphonTools.initializeSelectors([
   HighlightSelector({
     onTrigger: (range, e) => {
      let highlight = new Highlight(range)
      store.saveAnnotation(highlight)
     }
   })
 ])
```

This simple configuration defines a store with a couple of required properties -- the first being a user, and the second being a mapping of serializable types (strings, numbers) to the different annotation objects (Highlight in this case) for when we want to persist the annotations to a database.

The second part is setting up the selectors. It is up to you, the end user, to define when after a selector is complete, an annotation should be saved. In this example, we are immediately saving any highlights a user makes on a page, but normally you might display a toolbar here first, and then after the user clicks a "save" button, you would save the annotation to the store.

## Real-Life Usage

In reality, the above configuration would be insufficient for most applications. The main reason has to do with the provided `Store` class -- as it's written, it would only store information in memory for the page, which wouldn't allow you to take full advantage of SiphonTool's ability to serialize and restore annotations on a page.

The store class, however, does make it fairly simple to manage these annotations and connect them to a datasource. The main methods for doing this are:
-  `init()` - Called when you want to initize the store. A good place to put any database connection items. Remember to call `super.init()!`
- `saveAnnotation(annotation_obj)` - Called when you want to serialize and store an annotation. The current method just returns the serialized version of an annotation object
- `removeAnnotation(annotation_obj)` - Called to remove an annotation from the store
- `updateAnnotation(serialized_annotation)` - Called to update an existing annotation object with a new serialzed version of it
- `importAnnotation(serialized_annotation)` - How we can import the saved annotations created using the `saveAnnotation` method. Takes a serialzed annotation object, saves it into the store, and returns the deserilized, javasvcript object version of it. 

In your implimentation, it's best to extend this base store class, and override these methods as needed to connect to your database. Most of them return something useful in their current implimentation, so be sure to call `super`!
