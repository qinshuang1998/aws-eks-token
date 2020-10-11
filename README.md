# aws-eks-token
[![codecov](https://codecov.io/gh/qinshuang1998/aws-eks-token/branch/main/graph/badge.svg)](https://codecov.io/gh/qinshuang1998/aws-eks-token)
[![Build Status](https://travis-ci.org/qinshuang1998/aws-eks-token.svg?branch=main)](https://travis-ci.org/github/qinshuang1998/aws-eks-token)

Generate EKS token with signature v4 signing process.

## Quick Start

#### 0. Install from npm.

```shell
npm install aws-eks-token
```

#### 1. Generation with default credential file, we will read your credentials in an effective way, the config of aws-eks-token depends on aws-sdk's implementation.

```javascript
const EKSToken = require('aws-eks-token');
EKSToken.renew('cluster-name').then(token => {
    console.log(token);
});
```
> If more than one credential source is available to the SDK, the default precedence of selection is as follows:
>
> 1. Credentials that are explicitly set through the service-client constructor
> 2. Environment variables
> 3. The shared credentials file
> 4. Credentials loaded from the ECS credentials provider (if applicable)
> 5. Credentials that are obtained by using a credential process specified in the shared AWS config file or the shared credentials file. For more information, see [Loading Credentials in Node.js using a Configured Credential Process](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-configured-credential-process.html).
> 6. Credentials loaded from AWS IAM using the credentials provider of the Amazon EC2 instance (if configured in the instance metadata)
>
> For more information, see [Class: AWS.Credentials](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Credentials.html) and [Class: AWS.CredentialProviderChain](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CredentialProviderChain.html) in the API reference.

#### 2. So, you can also set custom configuration like in aws-sdk.

```javascript
EKSToken.config = {
    accessKeyId: 'AKID',
    secretAccessKey: 'SECRET',
    region: 'us-west-2'
};
```

#### 3. You can set the expiration time and request time you want too.

```javascript
EKSToken.renew('eks-cluster', '60', '20200930T093726Z');
```
