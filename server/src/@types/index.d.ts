import { ObjectID } from "mongodb";
// import { ObjectId } from "mongoose";
import { Document, Model } from "mongoose";

export namespace GeneralNs {
  interface Error {
    msg: string;
    code: number;
  }
  interface info {
    msg: string;
    code: number;
  }
}
/** @namespace UserNs a Namespace for user related types */
export namespace UserNs {
  interface userProfile {
    // _id: ObjectID;
    username: string;
    firstName: string;
    lastName: string;
    birthday: string;
    email: string;
    password: string;
    rank: number;
    // avatar?: string;
    loggedIn: boolean;
    datingTexts: Array<datingTextNs.datingText>;
    comments: Array<commentsNs.comment>;
  }
  interface newUser {
    username: string;
    firstName: string;
    lastName: string;
    birthday: string;
    email: string;
    password: string;
    // avatar?: string;
  }
  interface updateBlock {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    // avatar?: string;
  }

  interface updateUser {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    // avatar: string;
  }

  interface logInInput {
    email: string;
    password: string;
  }
  interface logOutInput {
    _id: ObjectID;
  }

  interface logInUser {
    id: ObjectID;
    iat: number;
    exp: number;
  }

  interface userSchemaData extends userProfile, Document {}
}
export namespace datingTextNs {
  interface datingText {
    text: string;
    score: number;
    postDate: Date;
    owner: ObjectID;
    comments: Array<ObjectID>;
    display: boolean;
    xprivate: boolean;
    toneResults: object;
  }
  interface newText {
    text: string;
    postDate: Date;
    // owner: ObjectID;
    toneResults: object;
    xprivate: boolean;
  }
  interface editText {
    _id: ObjectID;
    text: string;
    toneResults: object;
    display: boolean;
    xprivate: boolean;
  }
  /**
   *
   *
   * @interface datingTextSchemaData
   * @extends {datingText}
   * @extends {Document}{@link Document}
   */
  interface datingTextSchemaData extends datingText, Document {}
}

export namespace commentsNs {
  interface newComment {
    text: string;
    score: number;
    // owner: ObjectID;
    onText: ObjectID;
  }
  interface comment extends newComment {
    display: boolean;
    postDate: Date;
    owner: ObjectID;
  }
  interface commentsSchemaData extends comment, Document {}
}
