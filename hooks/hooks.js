const aws = require('aws-sdk');
const codedeploy = new aws.CodeDeploy({ apiVersion: '2014-10-06' });
var lambda = new aws.Lambda();
const LAMBDA_FUNCTION_ARN = process.env.LambdaCurrentVersion;


module.exports.pre = async (event, context, callback) => {
  console.log("Entering PreTraffic Hook...");

  let deploymentId = event.DeploymentId;
  let lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;
  var lambdaResult = "Failed";


  // Perform validation of the newly deployed Lambda version
  var lambdaParams = {
    FunctionName: LAMBDA_FUNCTION_ARN,
    InvocationType: "RequestResponse",
  };


  await lambda.invoke(lambdaParams, function (err, data) {
    if (err) lambdaResult = "Failed";
    else {
      var result = JSON.parse(data.Payload);
      if (result.body) lambdaResult = "Succeeded";
      else lambdaResult = "Failed";
    }
  }).promise();

  // params for CodeDeploy......
  var params = {
    deploymentId: deploymentId,
    lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
    status: lambdaResult
  };
  console.log('Params:: ', params);
  return codedeploy.putLifecycleEventHookExecutionStatus(params).promise()
    .then(data => callback(null, 'Validation test succeeded'))
    .catch(err => callback('Validation test failed'));
};




// For Post Hook Lambda function.......
// module.exports.post = (event, context, callback) => {
//   var deploymentId = event.DeploymentId;
//   var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;

//   console.log('Check some stuff after traffic has been shifted...');

//   var params = {
//     deploymentId: deploymentId,
//     lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
//     status: 'Failed' // status can be 'Succeeded' or 'Failed'
//   };

//   return codedeploy.putLifecycleEventHookExecutionStatus(params).promise()
//     .then(data => callback(null, 'Validation test succeeded'))
//     .catch(err => callback('Validation test failed'));
// };