import fetch from "node-fetch";

const literalApiUrl = "https://literal.club/graphql/";
const literalApiToken = process.env.LITERAL_TOKEN;
const queryData = {
  query: `
    query myReadingStates {
      myReadingStates {
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

    const { data } = await response.json();
    return data.myReadingStates || [];
  } catch (error) {
    console.log(error.message || error);
    return [];
  }
}
