import * as pulumi from "@pulumi/pulumi";
import "mocha";

pulumi.runtime.setMocks({
    newResource: function (args: pulumi.runtime.MockResourceArgs): { id: string, state: any } {
        return {
            id: args.inputs.name + "_id",
            state: args.inputs,
        };
    },
    call: function (args: pulumi.runtime.MockCallArgs) {
        return args.inputs;
    },
});


describe("TDD Demo Infrastructure", function () {
    let infra: typeof import("../index");

    before(async function () {
        infra = await import("../index");
    })

    describe("# ec2 server", function () {
        it("must have a name tag", function (done) {
            pulumi.all([infra.ec2.urn, infra.ec2.tags]).apply(([urn, tags]) => {
                if (!tags || !tags["Name"]) {
                    done(new Error(`Missing a name tag on server ${urn}`));
                } else {
                    done();
                }
            });
        });
    });

    describe("# security group", function () {
        it("must not open port 22 (SSH) to the Internet", function (done) {
            pulumi.all([infra.secGroup.urn, infra.secGroup.ingress]).apply(([urn, ingress]) => {
                if (ingress.find(rule =>
                    rule.fromPort === 22 && (rule.cidrBlocks || []).find(block => block === "0.0.0.0/0"))) {
                    done(new Error(`Illegal SSH port 22 open to the Internet (CIDR 0.0.0.0/0) on group ${urn}`));
                } else {
                    done();
                }
            });
        });
    });
});