import { gql } from '@apollo/client';

export const DATING_TEXT = gql`
query Query {
  allTexts {
    _id
    owner {
      username
    }
    text
    score
    postDate
    comments {
      text
    }
    display
    private
  }
}
`;
