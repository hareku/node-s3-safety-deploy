# Node.js S3 Safety Deployment

## Description
This npm package provide a s3 safety deployment.

1. Set s3 lifecycle that delete object that has a "ShouldDelete" tag.
2. `yarn install -g s3-safety-deploy`
3. `s3-safety-deploy --bucket your-bucket-name --upload-dir path-to-dir`

## デプロイの流れ
my-bucketというS3バケットの`/publish`というディレクトリを公開している場合の例。

1. `/publish/*`オブジェクトに"ShouldDelete"タグを付与する。
2. 削除する前バージョンのオブジェウトがあれば削除する。
3. 新しいバージョンのファイルを`/publish`にアップロードする。（上書き）
