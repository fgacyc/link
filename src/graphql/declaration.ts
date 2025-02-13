import { gql } from "graphql-request";

export const fetchSinglePerson = gql`
  query ($name: String) {
    userCollection(filter: { name: { eq: $name } }) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const fetchAllPerson = gql`
  query {
    userCollection {
      edges {
        node {
          id
          name
          email
        }
      }
    }
  }
`;
