# aws-eks-token
[![codecov](https://codecov.io/gh/qinshuang1998/aws-eks-token/branch/main/graph/badge.svg)](https://codecov.io/gh/qinshuang1998/aws-eks-token)
[![Build Status](https://travis-ci.org/qinshuang1998/aws-eks-token.svg?branch=main)](https://travis-ci.org/github/qinshuang1998/aws-eks-token)

Generate EKS token with signature v4 signing process.

## Quick Start

> npm install aws-eks-token

1. Generation with default credential file, the config of aws-eks-token depends on aws-sdk's implementation.

```javascript
const EKSToken = require('aws-eks-token');
EKSToken.renew('cluster-name').then(token => {
    console.log(token);
});
```

2. So, you can also set custom configuration like in aws-sdk.

```javascript
EKSToken.config = {
	accessKeyId: 'AKID',
    secretAccessKey: 'SECRET',
    region: 'us-west-2'
};
```

3. You can set the expiration time and request time you want too.

```javascript
EKSToken.renew('eks-cluster', '60', '20200930T093726Z');
```
