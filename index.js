const AWS = require('aws-sdk');
const Promise = require("bluebird");
const crypto = require("crypto-js");
const { SHA256, HmacSHA256 } = crypto;
const { Hex, Base64, Utf8 } = crypto.enc;
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

module.exports = class EKSToken {
    static _config = new AWS.Config();

    static preInspection() {
        return Promise.fromCallback((cb) => {
            this._config.getCredentials(cb);
        });
    }

    static renew(clusterName = 'eks-cluster', expires = '60', formatTime) {
        return this.preInspection().then((resolve) => {
            const [accessKeyId, secretAccessKey, region] = [
                this._config.credentials.accessKeyId,
                this._config.credentials.secretAccessKey,
                this._config.region
            ];
            // YYYYMMDD'T'HHMMSS'Z'
            const fullDate = formatTime || dayjs.utc().format('YYYYMMDDTHHmmss[Z]');
            const subDate = fullDate.substring(0, 8);
            const canonicalRequest =
                'GET' + '\n' +
                '/' + '\n' +
                'Action=GetCallerIdentity&' +
                'Version=2011-06-15&' +
                'X-Amz-Algorithm=AWS4-HMAC-SHA256&' +
                `X-Amz-Credential=${accessKeyId}%2F${subDate}%2F${region}%2Fsts%2Faws4_request&` +
                `X-Amz-Date=${fullDate}&` +
                `X-Amz-Expires=${expires}&` +
                `X-Amz-SignedHeaders=host%3Bx-k8s-aws-id` + '\n' +
                `host:sts.${region}.amazonaws.com\nx-k8s-aws-id:${clusterName}\n` + '\n' +
                'host;x-k8s-aws-id' + '\n' +
                'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
            const hashedCanonicalRequest = Hex.stringify(SHA256(canonicalRequest));
            const stringToSign =
                'AWS4-HMAC-SHA256' + '\n' +
                fullDate + '\n' +
                `${subDate}/${region}/sts/aws4_request` + '\n' +
                hashedCanonicalRequest;
            const signingKey = ((key, dateStamp, regionName, serviceName) => {
                var kDate = HmacSHA256(dateStamp, "AWS4" + key);
                var kRegion = HmacSHA256(regionName, kDate);
                var kService = HmacSHA256(serviceName, kRegion);
                var kSigning = HmacSHA256("aws4_request", kService);
                return kSigning;
            })(secretAccessKey, subDate, region, 'sts');
            const signature = Hex.stringify(HmacSHA256(stringToSign, signingKey));
            const presignedURL =
                `https://sts.${region}.amazonaws.com/?` +
                'Action=GetCallerIdentity&' +
                'Version=2011-06-15&' +
                'X-Amz-Algorithm=AWS4-HMAC-SHA256&' +
                `X-Amz-Credential=${accessKeyId}%2F${subDate}%2F${region}%2Fsts%2Faws4_request&` +
                `X-Amz-Date=${fullDate}&` +
                `X-Amz-Expires=${expires}&` +
                'X-Amz-SignedHeaders=host%3Bx-k8s-aws-id&' +
                `X-Amz-Signature=${signature}`;
            const eksToken = 'k8s-aws-v1.' + Base64.stringify(Utf8.parse(presignedURL)).replace(/=/g, '');
            return eksToken;
        })
    }

    static get config() {
        return this._config;
    }

    static set config(option) {
        option && this._config.update(option);
    }
}
