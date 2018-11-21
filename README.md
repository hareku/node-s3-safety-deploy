# Node.js S3 Safety Deployment

## Description
This npm package provide a s3 safety deployment.

1. Set s3 lifecycle that delete object that has a "ShouldDelete" tag.
2. `yarn add s3-safety-deploy`
3. `s3-safety-deploy --bucket your-bucket-name --upload-dir path-to-dir`

## デプロイの流れ
my-bucketというS3バケットの`/publish`というディレクトリを公開している場合の例。

1. 新しいバージョンのファイルをアップロードする前に、既存（前バージョン）のファイルをリスト化しておく
2. 新しいバージョンのファイルをアップロードする
3. `delete-pattern`で削除するファイルが指定されていれば、該当する前バージョンのファイルを削除する
4. その他の前バージョンのファイルに全て`ShouldDelete`というキーのタグを付与する（値は`1`）
