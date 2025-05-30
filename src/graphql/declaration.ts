import { gql } from "graphql-request";

export const addShadowUser = gql`
  mutation addShadowUser(
    $name: String
    $contact: String
    $dob: Datetime
    $gender: gender
    $cg: String
  ) {
    insertIntoshadow_userCollection(
      objects: {
        name: $name
        phone_number: $contact
        date_of_birth: $dob
        gender: $gender
        cg: $cg
      }
    ) {
      records {
        name
      }
    }
  }
`;

// Mutation to update a single person
export const updateSinglePerson = gql`
  mutation mutateAcc($email: String, $name: String) {
    updateuserCollection(
      filter: { email: { eq: $email } }
      set: { name: $name }
    ) {
      records {
        name
        address
        email
      }
    }
  }
`;

export const fetchSinglePerson = gql`
  query ($email: String) {
    userCollection(filter: { email: { eq: $email } }) {
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

export const fetchCGDetails = gql`
  query {
    connect_groupCollection {
      edges {
        node {
          id
        }
      }
    }
  }
`;

export const getUserCG = gql`
  query GetUserCG($uid: String) {
    user_connect_groupCollection(filter: { user_id: { eq: $uid } }) {
      edges {
        node {
          connect_group_id
          user {
            name
            id
          }
        }
      }
    }
  }
`;

export const getCGMembers = gql`
  query GetCGMembers($uid: String) {
    user_connect_groupCollection(filter: { user_id: { eq: $uid } }) {
      edges {
        node {
          connect_group {
            id
            user_connect_groupCollection {
              edges {
                node {
                  user {
                    name
                    id
                    avatar_url
                    deleted
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getShadowUserCG = gql`
  query GetShadowUser($cgid: String) {
    shadow_userCollection(filter: { cg: { eq: $cgid } }) {
      edges {
        node {
          name
          cg
          pastoral_status
          nodeId
        }
      }
    }
  }
`;
