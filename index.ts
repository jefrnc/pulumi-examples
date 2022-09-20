import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

export const secGroup = new aws.ec2.SecurityGroup("demo-secgrp", {
    ingress: [
        { protocol: "tcp", fromPort: 80, toPort: 80, cidrBlocks: ["0.0.0.0/0"] },
        { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
    ],
});

export const ec2 = new aws.ec2.Instance("demo-web-server", {
    instanceType: "t2.micro",
    securityGroups: [secGroup.name],        // reference the group object above
    ami: "ami-0d058fe428540cd89",           // AMI for ubuntu 20.04, amd64, ap-southeast-1
    tags: {Name: "demo-ec2-server"}
});

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("my-bucket");

// Export the name of the bucket
export const bucketName = bucket.id;

// Export the name of the bucket
export const EC2publicIp = ec2.publicIp;
