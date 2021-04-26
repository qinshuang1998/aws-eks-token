const EKSToken = require('..');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = require('chai').expect;

describe('Token_Generation_Test', function () {
    it('parameter_missing', async function () {
        EKSToken.config = {
            accessKeyId: 'AKID',
            secretAccessKey: 'SECRET',
        };
        await expect(EKSToken.renew()).to.be.rejectedWith('Lose the accessKeyId, secretAccessKey or region');
    });

    it('set_config', function () {
        EKSToken.config = {
            accessKeyId: 'AKID',
            secretAccessKey: 'SECRET',
            region: 'us-west-2'
        };
        expect(EKSToken.config.credentials.accessKeyId).to.be.equal('AKID');
        expect(EKSToken.config.credentials.secretAccessKey).to.be.equal('SECRET');
        expect(EKSToken.config.region).to.be.equal('us-west-2');
    });

    it('renew_token_realtime', async function () {
        let token = await EKSToken.renew();
        expect(token).to.have.length.above(11);
    });

    it('renew_token', async function () {
        let token = await EKSToken.renew('eks-cluster', '60', '20200930T093726Z');
        expect(token).to.be.equal('k8s-aws-v1.' +
            'aHR0cHM6Ly9zdHMudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vP0FjdGlvbj1H' +
            'ZXRDYWxsZXJJZGVudGl0eSZWZXJzaW9uPTIwMTEtMDYtMTUmWC1BbXotQWxn' +
            'b3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lE' +
            'JTJGMjAyMDA5MzAlMkZ1cy13ZXN0LTIlMkZzdHMlMkZhd3M0X3JlcXVlc3Qm' +
            'WC1BbXotRGF0ZT0yMDIwMDkzMFQwOTM3MjZaJlgtQW16LUV4cGlyZXM9NjAm' +
            'WC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JTNCeC1rOHMtYXdzLWlkJlgtQW16' +
            'LVNpZ25hdHVyZT1mZjFjODljMTZmMjUyNzVmOGE0YzczMTE2NzhmNDQ3NzIy' +
            'NjQ2ZDY0MzU4ODg1NGExMTRkMTY4YjA2MmM0YmYw');
    });

    it('renew_token_with_sessionToken', async function () {
        EKSToken.config = {
            accessKeyId: 'AKID',
            secretAccessKey: 'SECRET',
            sessionToken: 'FwoGZXIvYXdzEMP//////////wEaDLuLD7I1gA6LW1mZcSKxAZWj_trunc',
            region: 'us-west-2'
        };
        let token = await EKSToken.renew('eks-cluster', '60', '20200930T093726Z');
        expect(token).to.be.equal('k8s-aws-v1.' +
            'aHR0cHM6Ly9zdHMudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vP0FjdGlvbj1H' +
            'ZXRDYWxsZXJJZGVudGl0eSZWZXJzaW9uPTIwMTEtMDYtMTUmWC1BbXotQWxn' +
            'b3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lE' +
            'JTJGMjAyMDA5MzAlMkZ1cy13ZXN0LTIlMkZzdHMlMkZhd3M0X3JlcXVlc3Qm' +
            'WC1BbXotRGF0ZT0yMDIwMDkzMFQwOTM3MjZaJlgtQW16LUV4cGlyZXM9NjAm' +
            'WC1BbXotU2VjdXJpdHktVG9rZW49RndvR1pYSXZZWGR6RU1QJTJGJTJGJTJG' +
            'JTJGJTJGJTJGJTJGJTJGJTJGJTJGd0VhREx1TEQ3STFnQTZMVzFtWmNTS3hB' +
            'WldqX3RydW5jJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCUzQngtazhzLWF3' +
            'cy1pZCZYLUFtei1TaWduYXR1cmU9OWQzZDU5ZmVlNjk5NDUwMjI0YjcwOTli' +
            'YjZkY2U1YmNhMGE3Njc3ODcwMjMyYTNjMTczMDE2MTNmMDAxMjYxNQ');
    });
});
