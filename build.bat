cd /d %~dp0
call npm run build
aws s3 rm s3://satouxr1522bucket --recursive
aws s3 sync ./dist s3://satouxr1522bucket
aws cloudfront create-invalidation --distribution-id E2O1URQY6ORPVY --paths "/*"
