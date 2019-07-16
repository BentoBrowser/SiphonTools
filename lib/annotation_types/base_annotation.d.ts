/**
 * Copyright (c) Nathan Hahn and hist affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export interface SerializedAnnotation {
    key: string;
    type: number;
    comments: {
        key: string;
    }[];
    creator: string;
    text: string;
    creationDate: number;
}
export default class BaseAnnotation {
    key: string;
    type: number;
    rehydrated: boolean;
    comments: {
        key: string;
    }[];
    creator: string;
    creationDate: number;
    text: string;
    update(serialized: SerializedAnnotation): void;
    deserialize(serialized: SerializedAnnotation): void;
    serialize(): SerializedAnnotation;
    rehydrate(): boolean;
    mark(): void;
    unmark(): void;
}
