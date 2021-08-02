import { gql, useQuery } from "@apollo/client";

/* export const LOGIN_USER = gql`
  mutation Mutation($logInInput: logInInput) {
  logIn(input: $logInInput) {
    username
  }
}
`; */
/* export const SIGN_UP_USER =  gql`
  mutation Mutation($addUserInput: newUserInput!) {
  addUser(input: $addUserInput) {
    username
  }
}
`; */
/* export const ADD_DATING = gql`
mutation Mutation($addDatingTextInput: newDTI) {
  addDatingText(input: $addDatingTextInput) {
    username
  }
}
`; */
export const LOGIN_USER = gql`
  mutation Mutation($logInEmail: String, $logInPassword: String) {
    logIn(email: $logInEmail, password: $logInPassword) {
      username
    }
  }
`;
export const LOGOUT_USER = gql`
  mutation Mutation($logOutId: ObjectID) {
    logOut(_id: $logOutId)
  }
`;

export const SIGN_UP_USER = gql`
  mutation Mutation($addUserUser: newUserInput!) {
    addUser(user: $addUserUser) {
      username
    }
  }
`;

export const ADD_DATING = gql`
  mutation Mutation($addDatingTextText: newDTI) {
    addDatingText(text: $addDatingTextText) {
      text
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddCommentMutation($addCommentComment: newComment) {
    addComment(comment: $addCommentComment) {
      text
    }
  }
`;
