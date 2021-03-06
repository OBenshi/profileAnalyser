import {
  ApolloError,
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';
import { datingTextNs, UserNs } from '../../@types';
import datingTextModel from '../../models/datingTextsModel';
import { ObjectID } from 'mongodb';
import userModel from '../../models/usersModel';
import { getUser } from '../../context';
import watsonTA from '../../watson';

export const resolvers = {
  //* ---------------------------- // SECTION Query ---------------------------- */

  Query: {
    //* ---------------------------- SECTION ALL TEXTS --------------------------- */
    allTexts: async (a, b, { auth }) => {
      try {
        const userAuth = await getUser(auth);
        console.log(`userAuth in allTexts`, userAuth);
        if (userAuth === null) {
          return new AuthenticationError('UNAUTHORIZED');
        }
        try {
          console.log('you should not be seeing this');
          const datingTexts = await datingTextModel
            .find({})
            .populate({ path: 'owner' })
            .sort({ postDate: -1 })
            .populate({
              path: 'comments',
              options: { sort: { postDate: -1 } },
              populate: { path: 'owner' },
            });
          return datingTexts;
        } catch (err) {
          console.error('¡error! : ', err);
          throw new ApolloError('Error retrieving all dating texts', '500');
        }
      } catch (err) {
        return new AuthenticationError('UNAUTHORIZED');
      }
      //* ------------------------- END !SECTION ALL TEXTS ------------------------- */
    },
    //* ----------------------------- SECTION A TEXT ----------------------------- */
    aText: async (parent: any, args: ObjectID, { auth }) => {
      try {
        const userAuth = await getUser(auth);

        console.log(`userAuth in aText`, userAuth);
        if (userAuth === null) {
          return new AuthenticationError('UNAUTHORIZED');
        }
        try {
          const datingText = await datingTextModel
            .findById(args)
            .populate({ path: 'comments' });
          if (datingText === null) {
            return new ApolloError('Dating Text not found', '204');
          }
          return datingText;
        } catch (err) {
          console.log(`err`, err);
          return new ApolloError('Error finding Dating text', '500');
        }
      } catch (err) {
        return new AuthenticationError('UNAUTHORIZED');
      }
      //* --------------------------- END !SECTION A TEXT -------------------------- */
    },
    //* ----------------------------- SECTION A TONE ----------------------------- */
    aTone: async (parent: any, args: string, { auth }) => {
      try {
        const userAuth = await getUser(auth);
        console.log(`userAuth in aText`, userAuth);
        if (userAuth === null) {
          return new AuthenticationError('UNAUTHORIZED');
        }
        try {
          console.log(`args`, args);
          const toneResult = await watsonTA(args);
          console.log('toneResult', toneResult);
          return toneResult;
        } catch (err) {
          return new ApolloError(err);
        }
      } catch (err) {
        return new AuthenticationError('UNAUTHORIZED');
      }
      //* --------------------------- END !SECTION A TONE -------------------------- */
    },
    //* --------------------------- SECTION SEARCH TEXT -------------------------- */
    searchText: async (parent: any, args: { searchTerm: string }, { auth }) => {
      try {
        const userAuth = await getUser(auth);
        console.log(`userAuth in search`, userAuth);
        if (userAuth === null) {
          return new AuthenticationError('UNAUTHORIZED');
        }
        try {
          const { searchTerm } = args;
          console.log(`searchTerm`, searchTerm);
          const datingTexts = await datingTextModel
            .find({ text: { $regex: searchTerm, $options: 'i' } })
            .populate({ path: 'owner' })
            .populate({ path: 'comments', populate: { path: 'owner' } });
          return datingTexts;
        } catch (err) {
          console.error('¡error! : ', err);
          throw new ApolloError('Error retrieving all dating texts', '500');
        }
      } catch (err) {
        return new AuthenticationError('UNAUTHORIZED');
      }
      //* ------------------------ END !SECTION SEARCH TEXT ------------------------ */
    },
    //* --------------------------- END !SECTION Query --------------------------- */
  },

  //* ---------------------------- SECTION Mutation ---------------------------- */
  Mutation: {
    //*--------------------------- SECTION DT MAINTENANCE -------------------------- */
    textMaintenance: async (parent, args, { auth }) => {
      try {
        datingTextModel.createIndexes({
          text: 'text',
        });

        return { status: 200, msg: 'update successful' };
      } catch (err) {
        console.log(`err`, err);
        throw new ApolloError('shit', '69');
      }
    },

    //* ----------------------- END !SECTION DT MAINTENANCE ---------------------- */

    //* ---------------------------- SECTION ADD TEXT ---------------------------- */
    addDatingText: async (
      parent,
      args: { text: datingTextNs.newText },
      { auth }
    ) => {
      try {
        const userAuth = await getUser(auth);
        console.log(`userAuth in addText`, userAuth);
        if (userAuth === null) {
          return new AuthenticationError('UNAUTHORIZED');
        }
        try {
          const { postDate, text, toneResults, xprivate } = args.text;
          console.log(`tones`, toneResults);
          const newDT: datingTextNs.datingTextSchemaData = new datingTextModel({
            owner: userAuth.id,
            postDate,
            text,
            score: 0,
            display: true,
            private: xprivate,
            comments: [],
            toneResults: toneResults,
          });
          if (newDT === null) {
            return new ApolloError('failed to post text', '502');
          }
          const savedText: datingTextNs.datingTextSchemaData =
            await newDT.save();
          if (savedText === null) {
            return new ApolloError('failed to save text', '503');
          }
          const user = await userModel.findByIdAndUpdate(
            { _id: userAuth.id },
            { $addToSet: { datingTexts: savedText._id } },
            { useFindAndModify: false }
          );
          if (user === null) {
            return new ApolloError('failed to save text to user', '504');
          }
          return savedText;
        } catch (err) {
          console.log(`err`, err);
          throw new ApolloError('Could not create new Text', '500');
        }
      } catch (err) {
        return new AuthenticationError('UNAUTHORIZED');
      }
      //* -------------------------- END !SECTION ADD TEXT ------------------------- */
    },
    //* ---------------------------- SECTION EDIT TEXT --------------------------- */
    editDatingText: async (
      parent: any,
      { text, xprivate, display, _id }: datingTextNs.editText,
      { auth }
    ) => {
      try {
        const userAuth = await getUser(auth);

        console.log(`userAuth in edit`, userAuth);
        if (userAuth === null) {
          return new AuthenticationError('UNAUTHORIZED');
        }
        try {
          const editDT = datingTextModel
            .findByIdAndUpdate(
              { _id: _id },
              {
                $set: {
                  text: text,
                  private: xprivate,
                  display: display,
                },
              },
              { useFindAndModify: false, new: true }
            )
            .populate({ path: 'comments', populate: { path: 'owner' } });
          if (editDT === null) {
            return new ApolloError('failed to edit text', '502');
          }
          return editDT;
        } catch (err) {
          console.log(`err`, err);
          throw new ApolloError('Could not edit Text', '500');
        }
      } catch (err) {
        return new AuthenticationError('UNAUTHORIZED');
      }
    },

    //* ------------------------- END !SECTION EDIT TEXT ------------------------- */
  },
  //* -------------------------- END !SECTION Mutation ------------------------- */
};
