### Automate Rollback of Serverless application with AWS CodeDeploy

####Descrition: 
Using AWS CodeDeploy and AWS Lambda versions to deploy our functions in a blue-green deployment manner to reduce the occurrence of errors in our application in a production system.

#####Steps to Follow:
Make sure you've install `sam cli` in your local, if not follow [here](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html).

1. Navigate to template.yaml file, read the comments in order to understand properly.
2. Run sam build command with,
```
sam build
```
3. Deploy the resources to aws cloud with the following cmd, 
```
sam deploy --stack-name "serverless-codedeploy" --resolve-s3 --capabilities CAPABILITY_IAM
```
4. Navigate to `functions/order.js` and create some error intentionally and deploy again, in order to see rollback action.

5. Run to delete the deployed aws resources.
```
sam delete --stack-name "serverless-codedeploy" 
```
