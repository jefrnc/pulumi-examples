import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

let projectGitUrl = "https://github.com/jefrnc/app-demo-nextjs-helloworld.git"
let projectName = "devops_app-demo-nextjs-helloworld"
let appRoot = ""

const config = new pulumi.Config();
const githubAccessToken = config.requireSecret("github-accessToken");

const amplifyApp = new aws.amplify.App(`${projectName}`, {
    accessToken: githubAccessToken.apply(v => v),
    repository: projectGitUrl,
    environmentVariables: {
        AMPLIFY_DIFF_DEPLOY: "false",
        AMPLIFY_MONOREPO_APP_ROOT: appRoot,
    },
    customRules: [
        { source: "/<*>", target: "/index.html", status: "404-200" },
    ],
    autoBranchCreationConfig: {
        enableAutoBuild: true,
    },
    autoBranchCreationPatterns: [
        "*",
        "*/**",
        //"DEV-*",
    ],
    enableAutoBranchCreation: true,
    buildSpec: `version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
    appRoot: ${appRoot}`,
    enableBranchAutoDeletion: true
});

const developBranch = new aws.amplify.Branch("develop", {
    appId: amplifyApp.id,
    branchName: "develop",
    framework: "React",
    enableAutoBuild: true,
    stage: "DEVELOPMENT",
    environmentVariables: {
        REACT_APP_API_SERVER: "https://api.dev.example.com",
    },
});

const mainBranch = new aws.amplify.Branch("main", {
    appId: amplifyApp.id,
    branchName: "main",
    framework: "React",
    enableAutoBuild: true,
    enableNotification: true,
    stage: "PRODUCTION",
    environmentVariables: {
        REACT_APP_API_SERVER: "https://api.example.com",
    },
});

const amplifyAppMasterEventRule = new aws.cloudwatch.EventRule("amplifyAppMasterEventRule", {
    description: pulumi.interpolate`AWS Amplify build notifications for :  App: ${amplifyApp.id} Branch: ${mainBranch.branchName}`,
    eventPattern: pulumi.all([amplifyApp.id, mainBranch.branchName]).apply(([id, branchName]) => JSON.stringify({
        detail: {
            appId: [id],
            branchName: [branchName],
            jobStatus: [
                "SUCCEED",
                "FAILED",
                "STARTED",
            ],
        },
        "detail-type": ["Amplify Deployment Status Change"],
        source: ["aws.amplify"],
    })),
});
const amplifyAppMasterTopic = new aws.sns.Topic("amplifyAppMasterTopic", {});
const amplifyAppMasterEventTarget = new aws.cloudwatch.EventTarget("amplifyAppMasterEventTarget", {
    rule: amplifyAppMasterEventRule.name,
    arn: amplifyAppMasterTopic.arn,
    inputTransformer: {
        inputPaths: {
            jobId: "$.detail.jobId",
            appId: "$.detail.appId",
            region: "$.region",
            branch: "$.detail.branchName",
            status: "$.detail.jobStatus",
        },
        inputTemplate: "\"Build notification from the AWS Amplify Console for app: https://<branch>.<appId>.amplifyapp.com/. Your build status is <status>. Go to https://console.aws.amazon.com/amplify/home?region=<region>#<appId>/<branch>/<jobId> to view details on your build. \"",
    },
});
// SNS Topic for Amplify notifications
const amplifyAppMasterPolicyDocument = pulumi.all([mainBranch.arn, amplifyAppMasterTopic.arn]).apply(([masterArn, amplifyAppMasterTopicArn]) => aws.iam.getPolicyDocumentOutput({
    statements: [{
        sid: `Allow_Publish_Events ${masterArn}`,
        effect: "Allow",
        actions: ["SNS:Publish"],
        principals: [{
            type: "Service",
            identifiers: ["events.amazonaws.com"],
        }],
        resources: [amplifyAppMasterTopicArn],
    }],
}));

const amplifyAppMasterTopicPolicy = new aws.sns.TopicPolicy("amplifyAppMasterTopicPolicy", {
    arn: amplifyAppMasterTopic.arn,
    policy: amplifyAppMasterPolicyDocument.apply(amplifyAppMasterPolicyDocument => amplifyAppMasterPolicyDocument.json),
});


// const exampleBackendEnvironment = new aws.amplify.BackendEnvironment("exampleBackendEnvironment", {
//     appId: amplifyApp.id,
//     environmentName: "dev",
//     deploymentArtifacts: `${projectName}-deployment`.replace(/_/g, "-"),
//     stackName: projectName.replace(/_/g, "-"),
// });