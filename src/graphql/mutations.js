/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updateClapCount = /* GraphQL */ `
  mutation UpdateClapCount($id: ID!) {
    updateClapCount(id: $id) {
      type
      id
      owner
      event
      count
      emoji
      timestamp
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createClap = /* GraphQL */ `
  mutation CreateClap(
    $input: CreateClapInput!
    $condition: ModelClapConditionInput
  ) {
    createClap(input: $input, condition: $condition) {
      type
      id
      owner
      event
      count
      emoji
      timestamp
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateClap = /* GraphQL */ `
  mutation UpdateClap(
    $input: UpdateClapInput!
    $condition: ModelClapConditionInput
  ) {
    updateClap(input: $input, condition: $condition) {
      type
      id
      owner
      event
      count
      emoji
      timestamp
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteClap = /* GraphQL */ `
  mutation DeleteClap(
    $input: DeleteClapInput!
    $condition: ModelClapConditionInput
  ) {
    deleteClap(input: $input, condition: $condition) {
      type
      id
      owner
      event
      count
      emoji
      timestamp
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
