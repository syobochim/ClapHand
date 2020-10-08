/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getClap = /* GraphQL */ `
  query GetClap($id: ID!) {
    getClap(id: $id) {
      type
      id
      owner
      event
      count
      emoji
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const listClaps = /* GraphQL */ `
  query ListClaps(
    $filter: ModelClapFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClaps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        type
        id
        owner
        event
        count
        emoji
        timestamp
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listClapsSortedByTimestamp = /* GraphQL */ `
  query ListClapsSortedByTimestamp(
    $type: String
    $timestamp: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelClapFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClapsSortedByTimestamp(
      type: $type
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        type
        id
        owner
        event
        count
        emoji
        timestamp
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listClapsByOwner = /* GraphQL */ `
  query ListClapsByOwner(
    $owner: String
    $timestamp: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelClapFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClapsByOwner(
      owner: $owner
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        type
        id
        owner
        event
        count
        emoji
        timestamp
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
