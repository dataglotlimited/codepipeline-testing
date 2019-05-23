import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import moment = require('moment');

export interface s3BucketProps {
    bucketSuffix: string;
}

export class s3Bucket extends cdk.Construct {
    constructor(parent: cdk.Construct, name: string, props: s3BucketProps) {
        super(parent, name);

        // Bucket Name param here is the resourvce name in the output CloudFormation
        // script, so the resource name to reference. Note that it gets concatenated
        // with random letters & numbers
        const suffixedBucket = new s3.Bucket(this, 'SuffixedBucket', {
            bucketName: this.makeBucketName(props)
        });

        // Because the CF outputs become a dictionary we will need to override the 
        // concatenation so we know the key
        const cfnOutput = new cdk.CfnOutput(this, 'SuffixedBucketOutput', { value: suffixedBucket.bucketName });
        cfnOutput.overrideLogicalId('SuffixedBucketOutput');
    };

    makeBucketName(props: s3BucketProps) : string {
        // Bucket Name as it will be in AWS
        if (typeof props.bucketSuffix === 'string' && props.bucketSuffix.length)
            return cdk.Aws.accountId + moment().format('YYYYMMMDDhhmmss') + props.bucketSuffix;

        return cdk.Aws.accountId + 'nosuffix';
    }
}