export function createArtistParams(id: string) {
  return {
    variables: { uri: `spotify:artist:${id}`, locale: "" },
    operationName: "queryArtistOverview",
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash:
          "1ac33ddab5d39a3a9c27802774e6d78b9405cc188c6f75aed007df2a32737c72",
      },
    },
  };
}
