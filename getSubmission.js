import { gql, request } from "graphql-request";

export async function getSubmissionCodeList(challengeId, leetcodeSession) {
  const submissionList = await getSubmissionList(challengeId, leetcodeSession);

  const document = gql`
    query submissionDetails($submissionId: Int!) {
      submissionDetails(submissionId: $submissionId) {
        runtime
        runtimeDisplay
        runtimePercentile
        runtimeDistribution
        memory
        memoryDisplay
        memoryPercentile
        memoryDistribution
        code
        timestamp
        statusCode
        user {
          username
          profile {
            realName
            userAvatar
          }
        }
        lang {
          name
          verboseName
        }
        question {
          questionId
          titleSlug
          hasFrontendPreview
        }
        notes
        flagType
        topicTags {
          tagId
          slug
          name
        }
        runtimeError
        compileError
        lastTestcase
        codeOutput
        expectedOutput
        totalCorrect
        totalTestcases
        fullCodeOutput
        testDescriptions
        testBodies
        testInfo
        stdOutput
      }
    }
  `;

  let submissionInfos = [];

  for (const submission of submissionList) {
    const res = await request(
      "https://leetcode.com/graphql/",
      document,
      {
        submissionId: submission.id,
      },
      {
        authority: "leetcode.com",
        "content-type": "application/json",
        cookie: `LEETCODE_SESSION=${leetcodeSession}`,
      }
    );
    submissionInfos.push({
      code: res.submissionDetails.code,
      lang: submission.lang,
    });
  }

  return submissionInfos;
}

async function getSubmissionList(challengeId, leetcodeSession) {
  const document = gql`
    query submissionList(
      $offset: Int!
      $limit: Int!
      $lastKey: String
      $questionSlug: String!
      $lang: Int
      $status: Int
    ) {
      questionSubmissionList(
        offset: $offset
        limit: $limit
        lastKey: $lastKey
        questionSlug: $questionSlug
        lang: $lang
        status: $status
      ) {
        lastKey
        hasNext
        submissions {
          id
          title
          titleSlug
          status
          statusDisplay
          lang
          langName
          runtime
          timestamp
          url
          isPending
          memory
          hasNotes
          notes
          flagType
          topicTags {
            id
          }
        }
      }
    }
  `;
  const res = await request(
    "https://leetcode.com/graphql/",
    document,
    {
      questionSlug: challengeId,
      offset: 0,
      limit: 20,
      lastKey: null,
    },
    {
      authority: "leetcode.com",
      "content-type": "application/json",
      cookie: `LEETCODE_SESSION=${leetcodeSession}`,
    }
  );
  console.log(res.questionSubmissionList.submissions[0]);
  const codeLangSubmission = {};

  const submissionList = res.questionSubmissionList.submissions.filter(
    (sub) => {
      if (sub.statusDisplay != "Accepted") {
        return false;
      }
      if (!codeLangSubmission[sub.lang]) {
        codeLangSubmission[sub.lang] = true;
        return true;
      }
      return false;
    }
  );

  return submissionList;
}
