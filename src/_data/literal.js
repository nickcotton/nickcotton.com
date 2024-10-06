import fetch from "node-fetch";

const literalApiUrl = "https://literal.club/graphql/";
const literalApiToken = process.env.LITERAL_TOKEN;
const queryData = {
  query: `
    query myReadingStates {
      myReadingStates {
        status
        book {
          slug
          title
          cover
        }
      }
    }
  `,
};

export default async function () {
  try {
    const response = await fetch(literalApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${literalApiToken}`,
      },
      body: JSON.stringify(queryData),
    });

    const jsonResponse = await response.json();
    const data = jsonResponse?.data;
    if (!data) {
      throw new Error("No data returned from API");
    }
    const readingOrFinished = data.myReadingStates.filter(
      (state) => state.status === "IS_READING" || state.status === "FINISHED",
    );
    return readingOrFinished || [];
  } catch (error) {
    console.log(error.message || error);
    return [];
  }
}
