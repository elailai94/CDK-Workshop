import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";

import { Construct } from "constructs";

interface HitCounterProps {
    // The function for which we want to count url hits
    downstream: lambda.IFunction;
}

class HitCounter extends Construct {
    constructor(scope: Construct, id: string, props: HitCounterProps) {
        super(scope, id);


    }
}

export { HitCounter };
